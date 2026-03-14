const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

export async function submitReview(applicationName, files) {
  const filePayloads = await Promise.all(
    files.map(async (f) => {
      const text = await f.text().catch(() => "");
      return {
        file_name: f.name,
        content_type: f.type || "application/octet-stream",
        text,
      };
    })
  );

  const response = await fetch(`${API_BASE_URL}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      application_name: applicationName,
      files: filePayloads,
    }),
  });

  if (!response.ok) {
    const err = await response.text().catch(() => "Review failed");
    throw new Error(err || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.ok;
}
