from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any

from langchain_core.documents import Document

from app.core.config import IndexerSettings
from app.embeddings.embedder import embed_query
from app.vectorstore.pinecone_retriever import PineconeRetrieverClient, PineconeSearchMatch


@dataclass(frozen=True)
class RetrievedContext:
    """Normalized retrieval result returned to downstream application logic.

    Args:
        index_name: Logical Pinecone index label that produced the match.
        record_id: Pinecone record identifier for the matched chunk.
        score: Similarity score returned by Pinecone.
        metadata: Metadata stored alongside the matched vector.
        text: Retrieved chunk text extracted from metadata for prompt assembly.

    Returns:
        RetrievedContext: Immutable retrieval result for one matched chunk.
    """

    index_name: str
    record_id: str
    score: float
    metadata: dict[str, Any]
    text: str

    def to_dict(self) -> dict[str, Any]:
        """Convert the retrieval result to a serializable dictionary.

        Args:
            None.

        Returns:
            dict[str, Any]: Plain dictionary representation of the retrieved
            chunk.
        """
        return asdict(self)


@dataclass(frozen=True)
class ApplicationRetrievalResult:
    """Structured response produced by the application retriever.

    Args:
        application_name: Human-readable application name used in the query.
        query_text: Final semantic query text built from application context.
        retrieved_contexts: Combined results from both Pinecone indexes.

    Returns:
        ApplicationRetrievalResult: Immutable retrieval response container.
    """

    application_name: str
    query_text: str
    retrieved_contexts: list[RetrievedContext]

    def to_dict(self) -> dict[str, Any]:
        """Convert the retrieval result to a serializable dictionary.

        Args:
            None.

        Returns:
            dict[str, Any]: Plain dictionary representation of the retrieval
            output.
        """
        return {
            "application_name": self.application_name,
            "query_text": self.query_text,
            "retrieved_contexts": [
                context.to_dict() for context in self.retrieved_contexts
            ],
        }


class ApplicationPackageRetriever:
    """Retrieve guideline and checklist context for one application package.

    This retriever accepts the program name and pre-extracted file texts,
    composes a single semantic query, embeds that query, and searches both
    Pinecone indexes. It uses LangChain `Document` objects to model the input
    file texts and keeps the returned output normalized for downstream FastAPI
    or agentic-RAG orchestration.

    Args:
        settings: Environment-backed runtime settings for Pinecone access.
        pinecone_retriever: Optional Pinecone search client override for tests.

    Returns:
        ApplicationPackageRetriever: Configured retrieval workflow manager.
    """

    def __init__(
        self,
        settings: IndexerSettings,
        *,
        pinecone_retriever: PineconeRetrieverClient | None = None,
    ) -> None:
        """Initialize the application retriever.

        Args:
            settings: Runtime settings including Pinecone configuration.
            pinecone_retriever: Optional Pinecone search client override.

        Returns:
            None.
        """
        self.settings = settings
        self.pinecone_retriever = pinecone_retriever or PineconeRetrieverClient(
            settings
        )

    def retrieve(
        self,
        application_name: str,
        file_texts: list[str],
        *,
        top_k_per_index: int | None = None,
    ) -> ApplicationRetrievalResult:
        """Retrieve relevant context from both indexes for an application.

        Args:
            application_name: Name of the application program, such as
                "visitor visa".
            file_texts: Pre-extracted plain-text representations of uploaded
                files.
            top_k_per_index: Optional per-index match count override.

        Returns:
            ApplicationRetrievalResult: Combined retrieval output across the
            operational-guidelines and checklist indexes.
        """
        query_text = self._build_query_text(application_name, file_texts)
        query_vector = embed_query(query_text)

        operational_matches = self.pinecone_retriever.search_operational_guidelines(
            query_vector,
            top_k=top_k_per_index,
        )
        checklist_matches = self.pinecone_retriever.search_document_checklists(
            query_vector,
            top_k=top_k_per_index,
        )

        retrieved_contexts = [
            *self._normalize_matches(
                index_name="operational-guidelines-instructions",
                matches=operational_matches,
            ),
            *self._normalize_matches(
                index_name="document-checklist-pdf",
                matches=checklist_matches,
            ),
        ]

        return ApplicationRetrievalResult(
            application_name=application_name,
            query_text=query_text,
            retrieved_contexts=retrieved_contexts,
        )

    def _build_query_text(self, application_name: str, file_texts: list[str]) -> str:
        """Build one semantic retrieval query from the app name and file texts.

        Args:
            application_name: Application program name.
            file_texts: Pre-extracted plain text from uploaded files.

        Returns:
            str: Combined query text for embedding and retrieval.
        """
        cleaned_application_name = application_name.strip()
        file_documents = self._build_file_documents(file_texts)

        query_parts = [f"Application name: {cleaned_application_name}"]
        for index, document in enumerate(file_documents, start=1):
            query_parts.append(f"File {index}:\n{document.page_content}")

        return "\n\n".join(part for part in query_parts if part.strip())

    def _build_file_documents(self, file_texts: list[str]) -> list[Document]:
        """Convert raw file strings into LangChain documents.

        Args:
            file_texts: Plain text extracted from uploaded files.

        Returns:
            list[Document]: LangChain documents carrying file-order metadata.
        """
        documents: list[Document] = []
        for index, file_text in enumerate(file_texts, start=1):
            cleaned_text = file_text.strip()
            if not cleaned_text:
                continue
            documents.append(
                Document(
                    page_content=cleaned_text,
                    metadata={"file_index": index},
                )
            )
        return documents

    def _normalize_matches(
        self,
        *,
        index_name: str,
        matches: list[PineconeSearchMatch],
    ) -> list[RetrievedContext]:
        """Normalize Pinecone matches into application-facing result objects.

        Args:
            index_name: Logical index name used in the output.
            matches: Raw structured Pinecone matches.

        Returns:
            list[RetrievedContext]: Normalized retrieval results for one index.
        """
        normalized_results: list[RetrievedContext] = []

        for match in matches:
            metadata = dict(match.metadata or {})
            text = str(metadata.get("text", "")).strip()
            normalized_results.append(
                RetrievedContext(
                    index_name=index_name,
                    record_id=match.record_id,
                    score=match.score,
                    metadata=metadata,
                    text=text,
                )
            )

        return normalized_results
