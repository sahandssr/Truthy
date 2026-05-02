# Truthy

As an immigrant, when you first submit an application to the Canadian ministry of immigration (IRCC), it takes monnths, if not years, for that application to be reviewed for an initial "R10 Completeness Check" before entering the queue for processing. This is a laborious human-led and, hence, highly time-consuming process. Truthy is a Business-to-Government (B2G) AI-powered automation application that has aimed at reducing this process from months to seconds, hence leading to faster overall processing of IRCC applications.

## Services

- `api`: Main FastAPI gateway and orchestration layer. This is the system entrypoint and calls the downstream `indexer` and `agentic-rag` services.
- `streamlit`: Internal dashboard frontend for officers, analysts, and demo workflows.
- `indexer`: Policy ingestion and indexing service for program guides, checklists, form instructions, and rule updates.
- `agentic-rag`: Retrieval and reasoning service that analyzes extracted application data against indexed policy knowledge.
- `redis`: Fast cache system where a policy's modification date on exisiting regulations' database is frequently checked against the live version to determine if amendment to the database is required.

## Architecture Summary

The platform is organized as a service-oriented monorepo:

1. `streamlit` provides the user interface.
2. `api` receives UI requests and coordinates workflows.
3. `api` calls `indexer` for policy ingestion and refresh workflows.
4. `api` calls `agentic-rag` for retrieval, reasoning, and completeness analysis.
5. Shared contracts, prompts, and documentation live at the repository level.

This structure follows the requested operating model:

- frontend with Streamlit
- indexer service
- agentic RAG service
- FastAPI as the main service that invokes the two backend intelligence services

## Repository Docs

- [`STRUCTURE.md`](/Users/abtinzandi/Desktop/Truthy/STRUCTURE.md): Full folder-by-folder explanation.
- [`docs/architecture/overview.md`](/Users/abtinzandi/Desktop/Truthy/docs/architecture/overview.md): High-level system architecture.
- [`docs/architecture/service-interactions.md`](/Users/abtinzandi/Desktop/Truthy/docs/architecture/service-interactions.md): Service communication model.

## Docker Compose

The repository includes a `docker-compose.yml` file with the following services:

- `api`
- `streamlit`
- `indexer`
- `agentic-rag`
- `redis`
- `Pinecone`

`redis` and `qdrant` are included as foundational infrastructure for caching and retrieval-oriented indexing.

## Indexer Novelty

The indexer now includes a Redis-backed IRCC freshness cache.

- For each operational-guidelines source URL, the crawler extracts only the page's `Date modified` value.
- Redis stores the source link identity and the last observed modified date.
- Before indexing, the indexer compares the current modified date against Redis.
- If the date has not changed, the source is skipped before chunking, embedding, and Pinecone upsert.

This reduces unnecessary embedding calls and makes policy-refresh runs cheaper when IRCC pages are unchanged.

The cache is also exposed through the indexer service as a lightweight
inspection endpoint:

- `GET /cache/policy-freshness`

This endpoint returns the tracked IRCC source URLs and their currently cached
`Date modified` values, which makes the freshness optimization auditable
without storing any extra policy content in Redis.

The current program coverage includes:

- `visitor`
  - 2 operational-guidelines pages
  - 1 local document checklist PDF
- `study permit`
  - 1 operational-guidelines page for study permit application assessment
  - 1 local document checklist PDF

## What's Next?

Currently, Truthy is enabled to perform the "R10 Completeness Check" on only two IRCC programs, Temporary Resident Visas and Study Permits (from outside Canada). Following the current implementation, our team aims to expand to the 350+ distinct programs existing within the Canadian immigration system. Furthermore, we wish to increase our AI model's accuracy in scavenging the content of files and read through different file types (word, jpg, png, etc.). In tandem, we will also attempt to enhance our model's reasoning capabilities.

## Local Run Instructions

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Build the containers:

```bash
docker compose build
```

3. Start the stack:

```bash
docker compose up
```

4. Planned service endpoints:

- Streamlit UI: `http://localhost:8501`
- FastAPI gateway: `http://localhost:8000`
- Indexer service: `http://localhost:8001`
- Indexer Redis cache log: `http://localhost:8001/cache/policy-freshness`
- Agentic RAG service: `http://localhost:8002`
- Qdrant: `http://localhost:6333`
