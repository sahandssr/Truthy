from __future__ import annotations

from app.chunking.text_chunker import ChunkingConfig, TextChunker
from app.core.config import IndexerSettings
from app.ingestion.crawler import CrawledDocument, CrawlerSource, HierarchicalSection
from app.ingestion.pdf_to_text import ExtractedPdf, TextChunk
from app.vectorstore.index_manager import VisitorProgramIndexer
from app.vectorstore.pinecone_client import PineconeVectorRecord


class FakeCrawler:
    """Fake crawler that returns deterministic visitor-program documents.

    Args:
        None.

    Returns:
        FakeCrawler: Test double for the crawler dependency.
    """

    def __init__(self) -> None:
        """Initialize the fake crawler with guideline and checklist sources.

        Args:
            None.

        Returns:
            None.
        """
        self.sources = [
            CrawlerSource(
                kind="operational_guidelines",
                title="Guidelines",
                url="https://example.com/guidelines",
            ),
            CrawlerSource(
                kind="document_checklist_pdf",
                title="Checklist PDF",
                url="",
                file_path="/workspace/services/data/forms/imm5484e.pdf",
            ),
        ]

    def crawl_all(self) -> list[CrawledDocument]:
        """Return deterministic structured documents for indexing tests.

        Args:
            None.

        Returns:
            list[CrawledDocument]: Fixed document set for tests.
        """
        return [
            CrawledDocument(
                source=CrawlerSource(
                    kind="operational_guidelines",
                    title="Guidelines",
                    url="https://example.com/guidelines",
                ),
                document_title="Guidelines",
                sections=[
                    HierarchicalSection(
                        title="Reviewing documents",
                        level=2,
                        path=["Guidelines", "Reviewing documents"],
                        content="Applicants must provide a passport and proof of ties.",
                    )
                ],
                full_text="Guidelines full text",
            ),
        ]

    def crawl_source(self, source: CrawlerSource) -> CrawledDocument:
        """Return the deterministic guideline document for direct source calls.

        Args:
            source: Source requested by the index manager.

        Returns:
            CrawledDocument: Fixed guideline document for the requested source.
        """
        return self.crawl_all()[0]


class FakePineconeClient:
    """Fake Pinecone client capturing index bootstrap and upsert calls.

    Args:
        None.

    Returns:
        FakePineconeClient: Test double for Pinecone upsert operations.
    """

    def __init__(self) -> None:
        """Initialize the fake Pinecone client.

        Args:
            None.

        Returns:
            None.
        """
        self.bootstrap_called = False
        self.guideline_records: list[PineconeVectorRecord] = []
        self.checklist_records: list[PineconeVectorRecord] = []

    def ensure_required_indexes_exist(self) -> list[dict[str, str]]:
        """Record that bootstrap was called.

        Args:
            None.

        Returns:
            list[dict[str, str]]: Fake bootstrap summary.
        """
        self.bootstrap_called = True
        return [
            {"index_name": "guidelines-index", "status": "created"},
            {"index_name": "checklist-index", "status": "created"},
        ]

    def upsert_operational_guidelines(
        self,
        records: list[PineconeVectorRecord],
    ) -> dict[str, int]:
        """Capture guideline upsert records.

        Args:
            records: Guideline vector records.

        Returns:
            dict[str, int]: Fake upsert summary.
        """
        self.guideline_records.extend(records)
        return {"upserted_count": len(records)}

    def upsert_document_checklists(
        self,
        records: list[PineconeVectorRecord],
    ) -> dict[str, int]:
        """Capture checklist upsert records.

        Args:
            records: Checklist vector records.

        Returns:
            dict[str, int]: Fake upsert summary.
        """
        self.checklist_records.extend(records)
        return {"upserted_count": len(records)}


def test_index_manager_builds_and_routes_records(monkeypatch) -> None:
    """Verify the index manager chunks, embeds, and routes records correctly.

    Args:
        monkeypatch: Pytest monkeypatch fixture.

    Returns:
        None.
    """
    fake_pinecone = FakePineconeClient()
    settings = _build_settings()

    monkeypatch.setattr(
        "app.vectorstore.index_manager.embed_texts",
        lambda texts: [[float(index + 1), float(len(text))] for index, text in enumerate(texts)],
    )
    monkeypatch.setattr(
        "app.vectorstore.index_manager.extract_pdf_to_text_chunks",
        lambda pdf_bytes, **kwargs: ExtractedPdf(
            full_text="Passport copy and fee receipt.",
            chunks=[
                TextChunk(
                    chunk_id="p1-page_text-1",
                    page_number=1,
                    source_type="page_text",
                    text="Passport copy and fee receipt.",
                    char_count=30,
                    metadata={"page_number": 1, "method": "pymupdf_text"},
                )
            ],
            pages=[
                {
                    "page_number": 1,
                    "text": "Passport copy and fee receipt.",
                    "entries": [],
                }
            ],
        ),
    )

    indexer = VisitorProgramIndexer(
        settings,
        crawler=FakeCrawler(),
        pinecone_client=fake_pinecone,
        chunker=TextChunker(ChunkingConfig(chunk_size=80, chunk_overlap=10)),
    )

    summary = indexer.index_all_sources()

    print("\n=== INDEXING SUMMARY ===")
    print(summary.to_dict())
    print("\n=== GUIDELINE RECORDS ===")
    print([record.to_payload() for record in fake_pinecone.guideline_records])
    print("\n=== CHECKLIST RECORDS ===")
    print([record.to_payload() for record in fake_pinecone.checklist_records])

    assert fake_pinecone.bootstrap_called is True
    assert summary.crawled_documents == 2
    assert summary.generated_chunks >= 2
    assert len(fake_pinecone.guideline_records) >= 1
    assert len(fake_pinecone.checklist_records) >= 1
    assert (
        fake_pinecone.checklist_records[0].metadata["source_reference"]
        == "/workspace/services/data/forms/imm5484e.pdf"
    )


def _build_settings() -> IndexerSettings:
    """Construct stable settings for index-manager tests.

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
