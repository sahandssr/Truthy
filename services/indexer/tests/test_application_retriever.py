from __future__ import annotations

from app.core.config import IndexerSettings
from app.retrieval.application_retriever import ApplicationPackageRetriever
from app.vectorstore.pinecone_retriever import PineconeSearchMatch


class FakePineconeRetriever:
    """Fake Pinecone retriever returning deterministic cross-index matches.

    Args:
        None.

    Returns:
        FakePineconeRetriever: Test double for Pinecone retrieval calls.
    """

    def __init__(self) -> None:
        """Initialize the fake retriever with call-capture fields.

        Args:
            None.

        Returns:
            None.
        """
        self.guideline_vectors: list[list[float]] = []
        self.checklist_vectors: list[list[float]] = []

    def search_operational_guidelines(
        self,
        vector: list[float],
        *,
        top_k: int | None = None,
        namespace: str | None = None,
        include_metadata: bool = True,
    ) -> list[PineconeSearchMatch]:
        """Return deterministic operational-guideline matches.

        Args:
            vector: Embedded query vector.
            top_k: Optional match-count override.
            namespace: Optional namespace override.
            include_metadata: Whether metadata should be included.

        Returns:
            list[PineconeSearchMatch]: Fake guideline matches.
        """
        self.guideline_vectors.append(vector)
        return [
            PineconeSearchMatch(
                record_id="guideline-1",
                score=0.98,
                metadata={
                    "section_title": "Document requirements",
                    "document_title": "Temporary residents: Document requirements",
                    "text": "Applicants must provide a valid passport and supporting documents.",
                },
            )
        ]

    def search_document_checklists(
        self,
        vector: list[float],
        *,
        top_k: int | None = None,
        namespace: str | None = None,
        include_metadata: bool = True,
    ) -> list[PineconeSearchMatch]:
        """Return deterministic checklist matches.

        Args:
            vector: Embedded query vector.
            top_k: Optional match-count override.
            namespace: Optional namespace override.
            include_metadata: Whether metadata should be included.

        Returns:
            list[PineconeSearchMatch]: Fake checklist matches.
        """
        self.checklist_vectors.append(vector)
        return [
            PineconeSearchMatch(
                record_id="checklist-1",
                score=0.95,
                metadata={
                    "page_number": 1,
                    "document_title": "Visitor document checklist PDF",
                    "text": "Include the completed application form and fee receipt.",
                },
            )
        ]


def test_application_retriever_combines_both_indexes(monkeypatch) -> None:
    """Verify retrieval returns normalized results from both indexes.

    Args:
        monkeypatch: Pytest monkeypatch fixture.

    Returns:
        None.
    """
    fake_retriever = FakePineconeRetriever()
    settings = _build_settings()

    monkeypatch.setattr(
        "app.retrieval.application_retriever.embed_query",
        lambda text: [float(len(text)), 2.0, 3.0],
    )

    retriever = ApplicationPackageRetriever(
        settings,
        pinecone_retriever=fake_retriever,
    )
    result = retriever.retrieve(
        "visitor visa",
        [
            "Passport copy\nTravel history",
            "Bank statement\nEmployment letter",
        ],
        top_k_per_index=3,
    )

    print("\n=== APPLICATION RETRIEVAL RESULT ===")
    print(result.to_dict())

    assert result.application_name == "visitor visa"
    assert len(result.retrieved_contexts) == 2
    assert result.retrieved_contexts[0].index_name == "operational-guidelines-instructions"
    assert result.retrieved_contexts[1].index_name == "document-checklist-pdf"
    assert "valid passport" in result.retrieved_contexts[0].text
    assert "fee receipt" in result.retrieved_contexts[1].text
    assert fake_retriever.guideline_vectors[0] == fake_retriever.checklist_vectors[0]


def test_application_retriever_builds_query_from_application_and_files() -> None:
    """Verify the query text includes the app name and non-empty file texts.

    Args:
        None.

    Returns:
        None.
    """
    retriever = ApplicationPackageRetriever(
        _build_settings(),
        pinecone_retriever=FakePineconeRetriever(),
    )

    query_text = retriever._build_query_text(
        "visitor visa",
        [
            "Passport copy",
            "   ",
            "Financial support evidence",
        ],
    )

    print("\n=== RETRIEVAL QUERY TEXT ===")
    print(query_text)

    assert "Application name: visitor visa" in query_text
    assert "File 1:\nPassport copy" in query_text
    assert "File 2:\nFinancial support evidence" in query_text


def _build_settings() -> IndexerSettings:
    """Construct stable settings for application-retriever tests.

    Args:
        None.

    Returns:
        IndexerSettings: Test settings object.
    """
    return IndexerSettings(
        pinecone_api_key="test-key",
        pinecone_operational_guidelines_index_name="guidelines-index",
        pinecone_document_checklist_index_name="checklist-index",
        pinecone_namespace="truthy-dev",
        pinecone_top_k=5,
        pinecone_dimension=1536,
        pinecone_metric="cosine",
        pinecone_cloud="aws",
        pinecone_region="us-east-1",
        pinecone_deletion_protection="disabled",
    )
