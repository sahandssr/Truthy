import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PROGRAMS = [
  { value: "trv", label: "Visitor Visa (TRV)" },
  { value: "study", label: "Study Permit" },
  { value: "work", label: "Work Permit" },
  { value: "citizenship_minor", label: "Citizenship for Minor" },
];

const MOCK_FILES = [
  { id: "passport", name: "passport.pdf", size: "1.2 MB", type: "PDF", desc: "Passport information page", warn: false },
  { id: "birth_certificate", name: "birth_certificate.pdf", size: "0.8 MB", type: "PDF", desc: "Certified birth certificate", warn: false },
  { id: "imm_0008", name: "imm_form_0008.pdf", size: "0.4 MB", type: "PDF", desc: "IMM 0008 — Generic Application", warn: false },
  { id: "proof_of_funds", name: "proof_of_funds.pdf", size: "2.1 MB", type: "PDF", desc: "Bank statements / financial evidence", warn: false },
  { id: "purpose_letter", name: "purpose_of_travel.pdf", size: "0.3 MB", type: "PDF", desc: "Letter explaining travel purpose", warn: false },
  { id: "unsigned_form", name: "unsigned_form.pdf", size: "0.5 MB", type: "PDF", desc: "⚠ IMM 5257 — signature missing", warn: true },
  { id: "unreadable_scan", name: "unreadable_scan.pdf", size: "3.8 MB", type: "PDF", desc: "⚠ Low-resolution scan, text unclear", warn: true },
];

const ANALYZE_STEPS = [
  "Parsing uploaded documents…",
  "Checking required forms for program…",
  "Verifying signatures and fields…",
  "Running policy compliance check…",
  "Generating completeness report…",
];

export default function NewReviewPage() {
  const navigate = useNavigate();
  const [program, setProgram] = useState("trv");
  const [applicantId, setApplicantId] = useState("TRV-2026-005101");
  const [applicantName, setApplicantName] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedFiles, setSelectedFiles] = useState(["passport", "imm_0008", "proof_of_funds", "unsigned_form"]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [error, setError] = useState("");

  function toggleFile(id) {
    setSelectedFiles((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!applicantName.trim()) { setError("Applicant name is required."); return; }
    if (selectedFiles.length === 0) { setError("Select at least one file to analyze."); return; }
    setError("");
    setAnalyzing(true);
    setAnalyzeStep(0);

    for (let i = 0; i < ANALYZE_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 400));
      setAnalyzeStep(i + 1);
    }

    await new Promise((r) => setTimeout(r, 400));

    const files = MOCK_FILES.filter((f) => selectedFiles.includes(f.id));
    const reviewData = {
      id: `REV-${Date.now().toString(36).toUpperCase()}`,
      program,
      applicantId,
      applicantName,
      notes,
      files,
      timestamp: new Date().toLocaleString(),
    };
    navigate(`/review/${reviewData.id}/results`, { state: { review: reviewData } });
  }

  if (analyzing) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f4f6f9", fontFamily: "'Inter','Segoe UI',Arial,sans-serif", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "white", borderRadius: "14px", padding: "52px 56px", maxWidth: "480px", width: "100%", border: "1px solid #e9ecf1", textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
          <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#E8F0FB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", position: "relative" }}>
            <div style={{ width: "60px", height: "60px", border: "3px solid #e9ecf1", borderTop: "3px solid #1F3A6E", borderRadius: "50%", position: "absolute", animation: "spin 0.8s linear infinite" }} />
            <svg width="22" height="22" fill="none" stroke="#1F3A6E" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#8B1A1A", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px" }}>AI Analysis Running</div>
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1a202c", marginBottom: "8px" }}>Evaluating Application</h2>
          <p style={{ fontSize: "13px", color: "#9aa3b0", marginBottom: "32px" }}>Truthy is checking all documents and forms against {PROGRAMS.find(p => p.value === program)?.label} requirements</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", textAlign: "left", marginBottom: "28px" }}>
            {ANALYZE_STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "7px", background: i < analyzeStep ? "#e6f4ed" : i === analyzeStep ? "#E8F0FB" : "#f4f6f9", border: `1px solid ${i < analyzeStep ? "#b6dfc8" : i === analyzeStep ? "#c7d9f5" : "#e9ecf1"}`, transition: "all 0.3s" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: i < analyzeStep ? "#1a7a4a" : i === analyzeStep ? "#1F3A6E" : "#d1d7e0" }}>
                  {i < analyzeStep ? (
                    <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: i === analyzeStep ? "white" : "#9aa3b0" }} />
                  )}
                </div>
                <span style={{ fontSize: "12.5px", fontWeight: 500, color: i < analyzeStep ? "#1a7a4a" : i === analyzeStep ? "#1F3A6E" : "#9aa3b0" }}>{step}</span>
              </div>
            ))}
          </div>
          <div style={{ height: "6px", background: "#e9ecf1", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg, #1F3A6E, #8B1A1A)", borderRadius: "3px", width: `${(analyzeStep / ANALYZE_STEPS.length) * 100}%`, transition: "width 0.5s ease" }} />
          </div>
          <p style={{ fontSize: "12px", color: "#9aa3b0", marginTop: "8px" }}>{Math.round((analyzeStep / ANALYZE_STEPS.length) * 100)}% complete</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f4f6f9", fontFamily: "'Inter','Segoe UI',Arial,sans-serif" }}>
      {/* HEADER */}
      <header style={{ background: "#8B1A1A", color: "white", padding: "0 24px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "30px", height: "30px", background: "#1F3A6E", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, cursor: "pointer" }} onClick={() => navigate("/")}>IRCC</div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600 }}>Start New Review</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>Temporary Resident Visa Processing</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => navigate("/dashboard")} style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", background: "none", border: "none", cursor: "pointer" }}>← Dashboard</button>
        </div>
      </header>

      <main style={{ flex: 1, padding: "32px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "860px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "20px", fontWeight: 800, color: "#1a202c", letterSpacing: "-0.02em", marginBottom: "4px" }}>New Completeness Review</h1>
            <p style={{ fontSize: "13px", color: "#9aa3b0" }}>Submit an application package for AI-assisted analysis against IRCC program requirements.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* APPLICATION DETAILS CARD */}
            <div style={{ background: "white", borderRadius: "10px", border: "1px solid #e9ecf1", padding: "24px 28px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#1a202c", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid #f4f6f9" }}>Application Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                {/* PROGRAM */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5a6270", marginBottom: "6px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Program Type *</label>
                  <select value={program} onChange={(e) => setProgram(e.target.value)} style={{ width: "100%", padding: "10px 14px", fontSize: "13px", border: "1px solid #d1d7e0", borderRadius: "7px", outline: "none", background: "white", color: "#2d3340", appearance: "auto" }}>
                    {PROGRAMS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
                {/* APPLICANT ID */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5a6270", marginBottom: "6px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Applicant ID</label>
                  <input value={applicantId} onChange={(e) => setApplicantId(e.target.value)} style={{ width: "100%", padding: "10px 14px", fontSize: "13px", border: "1px solid #d1d7e0", borderRadius: "7px", outline: "none", color: "#2d3340", boxSizing: "border-box" }} placeholder="e.g. TRV-2026-005101" />
                </div>
                {/* APPLICANT NAME */}
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5a6270", marginBottom: "6px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Applicant Name *</label>
                  <input value={applicantName} onChange={(e) => { setApplicantName(e.target.value); setError(""); }} style={{ width: "100%", padding: "10px 14px", fontSize: "13px", border: `1px solid ${error && !applicantName ? "#9B1414" : "#d1d7e0"}`, borderRadius: "7px", outline: "none", color: "#2d3340", boxSizing: "border-box" }} placeholder="Full legal name" />
                </div>
                {/* NOTES */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#5a6270", marginBottom: "6px", letterSpacing: "0.04em", textTransform: "uppercase" }}>Officer Notes (optional)</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ width: "100%", padding: "10px 14px", fontSize: "13px", border: "1px solid #d1d7e0", borderRadius: "7px", outline: "none", resize: "vertical", color: "#2d3340", fontFamily: "inherit", boxSizing: "border-box" }} placeholder="Any additional context or concerns about this application…" />
                </div>
              </div>
            </div>

            {/* FILE SELECTION CARD */}
            <div style={{ background: "white", borderRadius: "10px", border: "1px solid #e9ecf1", padding: "24px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #f4f6f9" }}>
                <div>
                  <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#1a202c", marginBottom: "2px" }}>Application Files</h2>
                  <p style={{ fontSize: "12px", color: "#9aa3b0" }}>Select the documents uploaded by the applicant, or add your own files below.</p>
                </div>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#1F3A6E", background: "#E8F0FB", padding: "4px 12px", borderRadius: "999px" }}>{selectedFiles.length} selected</span>
              </div>

              {/* DROP ZONE */}
              <div style={{ border: "2px dashed #d1d7e0", borderRadius: "8px", padding: "20px", textAlign: "center", marginBottom: "16px", background: "#fafbfc" }}>
                <svg width="28" height="28" fill="none" stroke="#9aa3b0" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: "0 auto 8px" }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p style={{ fontSize: "12.5px", color: "#9aa3b0", marginBottom: "4px" }}>Drag & drop PDF or image files here</p>
                <p style={{ fontSize: "11.5px", color: "#d1d7e0" }}>or use the demo files below</p>
              </div>

              {/* MOCK FILE LIST */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {MOCK_FILES.map((file) => {
                  const selected = selectedFiles.includes(file.id);
                  return (
                    <label key={file.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px", borderRadius: "8px", border: `1px solid ${selected ? (file.warn ? "#f5c6c4" : "#c7d9f5") : "#e9ecf1"}`, background: selected ? (file.warn ? "#fff8f8" : "#f0f5ff") : "white", cursor: "pointer", transition: "all 0.15s" }}>
                      <input type="checkbox" checked={selected} onChange={() => toggleFile(file.id)} style={{ width: "15px", height: "15px", accentColor: "#1F3A6E", flexShrink: 0 }} />
                      <div style={{ width: "34px", height: "40px", borderRadius: "4px", background: file.warn ? "#FDE0DE" : "#f4f6f9", border: `1px solid ${file.warn ? "#f5c6c4" : "#e9ecf1"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="16" height="16" fill="none" stroke={file.warn ? "#9B1414" : "#9aa3b0"} strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "#2d3340" }}>{file.name}</span>
                          {file.warn && <span style={{ fontSize: "10px", fontWeight: 700, color: "#9B1414", background: "#FDE0DE", padding: "1px 7px", borderRadius: "4px" }}>FLAG</span>}
                        </div>
                        <span style={{ fontSize: "11px", color: "#9aa3b0" }}>{file.desc} · {file.size}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* SUBMIT */}
            {error && <p style={{ fontSize: "12px", color: "#9B1414", background: "#FDE0DE", padding: "10px 14px", borderRadius: "6px", border: "1px solid #f5c6c4" }}>{error}</p>}
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", paddingBottom: "32px" }}>
              <button type="button" onClick={() => navigate("/dashboard")} style={{ padding: "11px 22px", fontSize: "13px", fontWeight: 600, color: "#5a6270", background: "white", border: "1px solid #d1d7e0", cursor: "pointer", borderRadius: "7px" }}>Cancel</button>
              <button type="submit" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 28px", fontSize: "13px", fontWeight: 700, color: "white", background: "#1F3A6E", border: "none", cursor: "pointer", borderRadius: "7px" }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/></svg>
                Run Completeness Check
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
