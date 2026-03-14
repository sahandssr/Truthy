import { useState } from "react";
import PreviewModal from "./PreviewModal";

function DocIcon({ type }) {
  if (type === "Image") {
    return (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    );
  }
  return (
    <svg width="14" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  );
}

export default function DocumentsTab({ documents }) {
  const [preview, setPreview] = useState(null);

  return (
    <div className="tab-content">
      <div className="docs-list">
        {documents.map((doc) => (
          <div key={doc.id} className="doc-row">
            <div className="doc-thumbnail">
              <DocIcon type={doc.type} />
            </div>
            <div className="doc-row-info">
              <div className="doc-row-name">{doc.name}</div>
              <div className="doc-row-meta">{doc.type}</div>
            </div>
            <div className="doc-row-actions">
              <span className={`badge badge-${doc.status}`}>
                {doc.status === "present" ? "Present" : "Missing"}
              </span>
              {doc.status === "present" && (
                <button className="btn-preview" onClick={() => setPreview(doc)}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Open
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {preview && (
        <PreviewModal
          title={preview.name}
          subtitle={preview.type}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}
