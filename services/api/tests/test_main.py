from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_process_endpoint_accepts_pdf_uploads() -> None:
    response = client.post(
        "/process",
        data={"application_name": "visitor_visa_application"},
        files=[
            ("files", ("form-1.pdf", b"%PDF-1.4 fake pdf content", "application/pdf")),
            ("files", ("form-2.pdf", b"%PDF-1.4 another fake pdf", "application/pdf")),
        ],
    )

    assert response.status_code == 200
    assert response.json() == {
        "report": "Process endpoint connected",
    }


def test_process_endpoint_requires_application_name() -> None:
    response = client.post(
        "/process",
        files=[
            ("files", ("form-1.pdf", b"%PDF-1.4 fake pdf content", "application/pdf")),
        ],
    )

    assert response.status_code == 422


def test_process_endpoint_requires_files() -> None:
    response = client.post(
        "/process",
        data={"application_name": "visitor_visa_application"},
    )

    assert response.status_code == 422
