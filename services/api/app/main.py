from __future__ import annotations

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class ProcessResponse(BaseModel):
    report: str


app = FastAPI(title="Truthy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/process", response_model=ProcessResponse)
async def process_application(
    application_name: str = Form(...),
    files: list[UploadFile] = File(...),
) -> ProcessResponse:
    _ = application_name
    _ = files
    return ProcessResponse(report="Process endpoint connected")
