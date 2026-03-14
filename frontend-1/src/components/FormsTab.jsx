import { useState } from "react";
import PreviewModal from "./PreviewModal";

const STATUS_LABELS = {
  signed: "Signed",
  validated: "Validated",
  submitted: "Submitted",
  missing: "Missing",
  unsigned: "Unsigned",
};

export default function FormsTab({ forms }) {
  const [preview, setPreview] = useState(null);

  return (
    <div className="tab-content">
      <div className="forms-list">
        {forms.map((form) => (
          <div key={form.id} className="form-row">
            <div className={`form-row-icon${form.status === "missing" ? " missing-icon" : ""}`}>
              {form.status === "missing" ? (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              ) : (
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              )}
            </div>
            <div className="form-row-info">
              <div className="form-row-name">{form.name}</div>
              <div className="form-row-desc">{form.desc}</div>
            </div>
            <div className="form-row-actions">
              <span className={`badge badge-${form.status}`}>
                {STATUS_LABELS[form.status] || form.status}
              </span>
              {form.status !== "missing" && (
                <button className="btn-preview" onClick={() => setPreview(form)}>
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Preview
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {preview && (
        <PreviewModal
          title={preview.name}
          subtitle={preview.desc}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}
