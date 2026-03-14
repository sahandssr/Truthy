import { useState } from "react";
import { submitReview } from "../lib/reviewApi";

function parseResults(data) {
  if (!data) return null;

  const outcomes = data.stage_outcomes || [];
  const finalText = data.final_report_text || "";
  const isComplete = finalText.toLowerCase().includes("complete") && !finalText.toLowerCase().includes("incomplete");

  const items = outcomes.map((o) => ({
    label: o.stage_name,
    pass: o.status === "PASS" || o.status === "pass",
    detail: o.explanation,
  }));

  if (items.length === 0) {
    const overall = isComplete ? "complete" : "incomplete";
    return {
      overall,
      items: [{ label: "Application Review", pass: isComplete, detail: finalText }],
      timestamp: new Date().toLocaleString(),
      finalText,
    };
  }

  return {
    overall: items.every((i) => i.pass) ? "complete" : "incomplete",
    items,
    timestamp: new Date().toLocaleString(),
    finalText,
  };
}

export default function CompletenessPanel({ applicant }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function runCheck() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await submitReview(applicant.id, []);
      setResult(parseResults(data));
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("ECONNREFUSED") || msg.includes("502") || msg.includes("503")) {
        setResult({
          overall: applicant.status === "complete" ? "complete" : "incomplete",
          items: applicant.forms.map((f) => ({
            label: f.name,
            pass: f.status !== "missing" && f.status !== "unsigned",
            detail: f.status === "missing" ? `${f.name} not submitted` : f.desc,
          })).concat(
            applicant.documents
              .filter((d) => d.status === "missing")
              .map((d) => ({ label: d.name, pass: false, detail: "Document not uploaded" }))
          ),
          timestamp: new Date().toLocaleString(),
          finalText: "",
          offline: true,
        });
      } else {
        setError(err.message || "Check failed");
      }
    } finally {
      setLoading(false);
    }
  }

  if (!result && !loading) {
    return (
      <>
        <div className="right-panel-header">Completeness Check</div>
        <div className="completeness-idle">
          <div className="completeness-idle-icon">
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <h3>Completeness Check</h3>
          <p>Evaluate all forms, documents, signatures, and fees against TRV requirements.</p>
          {error && <p style={{ color: "var(--gov-red)", fontSize: "11px" }}>{error}</p>}
          <button className="btn-run-check" onClick={runCheck} disabled={loading}>
            Run Completeness Check
          </button>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <div className="right-panel-header">Completeness Check</div>
        <div className="completeness-idle">
          <div className="spinner-dark" />
          <h3>Evaluating Application</h3>
          <p>Checking forms, documents, and requirements...</p>
        </div>
      </>
    );
  }

  const passCount = result.items.filter((i) => i.pass).length;

  return (
    <>
      <div className="right-panel-header">Completeness Check</div>
      <div className="completeness-results">
        <div className={`result-banner ${result.overall}`}>
          <div className="result-banner-icon">
            {result.overall === "complete" ? (
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            )}
          </div>
          <div className="result-banner-text">
            <strong>{result.overall === "complete" ? "Application Complete" : "Application Incomplete"}</strong>
            <span>{passCount}/{result.items.length} criteria passed{result.offline ? " (offline check)" : ""}</span>
          </div>
        </div>

        <div className="result-checklist">
          <h4>Criteria</h4>
          {result.items.map((item, i) => (
            <div key={i} className={`checklist-item ${item.pass ? "pass" : "fail"}`}>
              <div className="checklist-item-icon">
                {item.pass ? (
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                )}
              </div>
              <div className="checklist-item-text">
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="result-actions">
          <button className="btn-action-primary">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export Report
          </button>
          <button className="btn-action-secondary">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
            </svg>
            Return Application
          </button>
        </div>

        <div className="result-timestamp">Assessed: {result.timestamp}</div>

        <div className="run-again-row">
          <button className="btn-run-check" onClick={runCheck} disabled={loading}>
            {loading ? <span className="spinner" /> : null}
            Re-run Check
          </button>
        </div>
      </div>
    </>
  );
}
