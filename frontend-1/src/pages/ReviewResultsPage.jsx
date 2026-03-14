import { useNavigate, useLocation, useParams } from "react-router-dom";

const PROGRAM_LABELS = {
  trv: "Visitor Visa (TRV)",
  study: "Study Permit",
  work: "Work Permit",
  citizenship_minor: "Citizenship for Minor",
};

function buildResults(review) {
  if (!review) return null;
  const files = review.files || [];
  const hasUnsigned = files.some((f) => f.id === "unsigned_form");
  const hasUnreadable = files.some((f) => f.id === "unreadable_scan");
  const hasPassport = files.some((f) => f.id === "passport");
  const hasImmForm = files.some((f) => f.id === "imm_0008");
  const hasFunds = files.some((f) => f.id === "proof_of_funds");
  const hasBirth = files.some((f) => f.id === "birth_certificate");
  const hasPurpose = files.some((f) => f.id === "purpose_letter");

  const stages = [
    {
      name: "Required Forms",
      status: hasImmForm ? "PASS" : "FAIL",
      explanation: hasImmForm
        ? "IMM 0008 (Generic Application Form) is present and identified."
        : "IMM 0008 (Generic Application Form) is missing. This form is mandatory for all programs.",
    },
    {
      name: "Signature Validation",
      status: hasUnsigned ? "FAIL" : "PASS",
      explanation: hasUnsigned
        ? "One or more forms appear to be missing required applicant signatures. IMM 5257 signature field is blank."
        : "All submitted forms appear to have the required signatures in the expected fields.",
    },
    {
      name: "Identity Documents",
      status: hasPassport ? "PASS" : "FAIL",
      explanation: hasPassport
        ? "Valid passport information page detected. Document is readable and within expected format."
        : "Passport copy is required but was not found in the submitted package.",
    },
    {
      name: "Financial Evidence",
      status: hasFunds ? "PASS" : "FAIL",
      explanation: hasFunds
        ? "Proof of funds document is present. Financial evidence appears sufficient based on document headers."
        : "No proof of financial support was submitted. This is required to demonstrate ability to cover costs.",
    },
    {
      name: "Document Readability",
      status: hasUnreadable ? "WARN" : "PASS",
      explanation: hasUnreadable
        ? "One document (unreadable_scan.pdf) has low image resolution. Key fields may not be legible for officer review."
        : "All submitted documents appear to be readable and of adequate quality.",
    },
    {
      name: "Supporting Documents",
      status: hasPurpose || hasBirth ? "PASS" : "WARN",
      explanation: hasPurpose || hasBirth
        ? "Supporting documents are present. Items submitted: " + [hasPurpose && "purpose of travel letter", hasBirth && "birth certificate"].filter(Boolean).join(", ") + "."
        : "No supplementary supporting documents were included. Depending on applicant circumstances, additional documents may be required.",
    },
  ];

  const passCount = stages.filter((s) => s.status === "PASS").length;
  const failCount = stages.filter((s) => s.status === "FAIL").length;
  const warnCount = stages.filter((s) => s.status === "WARN").length;
  const overall = failCount > 0 ? "incomplete" : warnCount > 0 ? "needs_review" : "complete";

  const issues = stages.filter((s) => s.status !== "PASS").map((s) => s.explanation);

  let finalText = "";
  if (overall === "complete") {
    finalText = `This application package for ${PROGRAM_LABELS[review.program] || review.program} appears complete. All required forms are present, signatures have been verified, and supporting documentation meets program requirements. The application is ready for officer adjudication.`;
  } else if (overall === "needs_review") {
    finalText = `This application package is substantially complete but has one or more items requiring officer attention. ${warnCount} warning(s) were identified that may affect processability. Officer review is recommended before advancing to adjudication.`;
  } else {
    finalText = `This application package is incomplete. ${failCount} critical issue(s) were identified that must be resolved before this application can be processed. The officer should contact the applicant or return the application for corrections.`;
  }

  return { stages, passCount, failCount, warnCount, overall, finalText, issues };
}

function StageBadge({ status }) {
  const cfg = {
    PASS: { bg: "#e6f4ed", color: "#1a7a4a", label: "PASS" },
    FAIL: { bg: "#FDE0DE", color: "#9B1414", label: "FAIL" },
    WARN: { bg: "#fef3cd", color: "#b45309", label: "WARNING" },
  }[status] || { bg: "#e9ecf1", color: "#5a6270", label: status };
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: "5px", fontSize: "10.5px", fontWeight: 700, background: cfg.bg, color: cfg.color, letterSpacing: "0.06em" }}>
      {cfg.label}
    </span>
  );
}

export default function ReviewResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const review = location.state?.review || null;
  const results = buildResults(review);

  if (!review || !results) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f4f6f9", fontFamily: "'Inter','Segoe UI',Arial,sans-serif", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1a202c", marginBottom: "12px" }}>Review Not Found</h2>
          <p style={{ fontSize: "13px", color: "#9aa3b0", marginBottom: "24px" }}>This review session may have expired. Start a new review to continue.</p>
          <button onClick={() => navigate("/review/new")} style={{ padding: "10px 24px", fontSize: "13px", fontWeight: 700, color: "white", background: "#1F3A6E", border: "none", cursor: "pointer", borderRadius: "7px" }}>Start New Review</button>
        </div>
      </div>
    );
  }

  const overallCfg = {
    complete: { label: "Application Complete", color: "#1a7a4a", bg: "#e6f4ed", border: "#b6dfc8" },
    needs_review: { label: "Needs Officer Review", color: "#b45309", bg: "#fef3cd", border: "#f5d77e" },
    incomplete: { label: "Application Incomplete", color: "#9B1414", bg: "#FDE0DE", border: "#f5c6c4" },
  }[results.overall];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f4f6f9", fontFamily: "'Inter','Segoe UI',Arial,sans-serif" }}>
      {/* HEADER */}
      <header style={{ background: "#8B1A1A", color: "white", padding: "0 24px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "30px", height: "30px", background: "#1F3A6E", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, cursor: "pointer" }} onClick={() => navigate("/")}>IRCC</div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600 }}>Completeness Review — {review.id}</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>{PROGRAM_LABELS[review.program] || review.program} · {review.timestamp}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", padding: "3px 10px", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "0.08em" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f59e0b" }} />
            PROTECTED B
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => navigate("/review/new")} style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", background: "none", border: "none", cursor: "pointer" }}>New Review</button>
          <button onClick={() => navigate("/cases")} style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", background: "none", border: "none", cursor: "pointer" }}>← Cases</button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "white" }}>J. Thompson</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>Review Officer</div>
            </div>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1F3A6E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "white" }}>JT</div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: "28px 32px", maxWidth: "1120px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {/* OVERALL VERDICT BANNER */}
        <div style={{ background: overallCfg.bg, border: `1px solid ${overallCfg.border}`, borderRadius: "10px", padding: "20px 24px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: overallCfg.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {results.overall === "complete" ? (
                <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              ) : results.overall === "needs_review" ? (
                <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              ) : (
                <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              )}
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: overallCfg.color, letterSpacing: "-0.01em" }}>{overallCfg.label}</div>
              <div style={{ fontSize: "12.5px", color: "#5a6270", marginTop: "3px" }}>
                {results.passCount} passed · {results.failCount} failed · {results.warnCount} warnings · {review.files.length} files analyzed
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexShrink: 0 }}>
            <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", fontSize: "13px", fontWeight: 600, color: "white", background: "#1F3A6E", border: "none", cursor: "pointer", borderRadius: "7px" }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Report
            </button>
            {results.overall === "incomplete" && (
              <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", fontSize: "13px", fontWeight: 600, color: "#9B1414", background: "white", border: "1px solid #f5c6c4", cursor: "pointer", borderRadius: "7px" }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
                Return to Applicant
              </button>
            )}
            {results.overall === "complete" && (
              <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", fontSize: "13px", fontWeight: 600, color: "#1a7a4a", background: "white", border: "1px solid #b6dfc8", cursor: "pointer", borderRadius: "7px" }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                Approve for Processing
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }}>
          {/* MAIN CONTENT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* REVIEW METADATA */}
            <div style={{ background: "white", borderRadius: "10px", border: "1px solid #e9ecf1", padding: "20px 24px" }}>
              <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#1a202c", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #f4f6f9" }}>Review Metadata</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
                {[
                  { label: "Review ID", value: review.id },
                  { label: "Program", value: PROGRAM_LABELS[review.program] || review.program },
                  { label: "Applicant ID", value: review.applicantId },
                  { label: "Applicant Name", value: review.applicantName },
                  { label: "Files Analyzed", value: `${review.files.length} documents` },
                  { label: "Assessed", value: review.timestamp },
                ].map((m) => (
                  <div key={m.label}>
                    <div style={{ fontSize: "10.5px", fontWeight: 600, color: "#9aa3b0", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "3px" }}>{m.label}</div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "#2d3340" }}>{m.value}</div>
                  </div>
                ))}
              </div>
              {review.notes && (
                <div style={{ marginTop: "16px", padding: "12px 14px", background: "#f4f6f9", borderRadius: "7px", borderLeft: "3px solid #1F3A6E" }}>
                  <div style={{ fontSize: "10.5px", fontWeight: 600, color: "#9aa3b0", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Officer Notes</div>
                  <div style={{ fontSize: "12.5px", color: "#5a6270", lineHeight: 1.5 }}>{review.notes}</div>
                </div>
              )}
            </div>

            {/* STAGE RESULTS */}
            <div style={{ background: "white", borderRadius: "10px", border: "1px solid #e9ecf1", overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: "1px solid #f4f6f9" }}>
                <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#1a202c" }}>Analysis Stages</h2>
                <p style={{ fontSize: "12px", color: "#9aa3b0", marginTop: "2px" }}>AI-generated review against {PROGRAM_LABELS[review.program] || review.program} requirements</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {results.stages.map((stage, i) => (
                  <div key={i} style={{ display: "flex", gap: "16px", padding: "16px 24px", borderBottom: i < results.stages.length - 1 ? "1px solid #f4f6f9" : "none", alignItems: "flex-start" }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px", background: stage.status === "PASS" ? "#e6f4ed" : stage.status === "FAIL" ? "#FDE0DE" : "#fef3cd" }}>
                      {stage.status === "PASS" ? (
                        <svg width="11" height="11" fill="none" stroke="#1a7a4a" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : stage.status === "FAIL" ? (
                        <svg width="11" height="11" fill="none" stroke="#9B1414" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      ) : (
                        <svg width="11" height="11" fill="none" stroke="#b45309" strokeWidth="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#1a202c" }}>{stage.name}</span>
                        <StageBadge status={stage.status} />
                      </div>
                      <p style={{ fontSize: "12.5px", color: "#5a6270", lineHeight: 1.6 }}>{stage.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI FINAL REPORT */}
            <div style={{ background: "white", borderRadius: "10px", border: "1px solid #e9ecf1", padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "#E8F0FB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" fill="none" stroke="#1F3A6E" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#1a202c" }}>AI Completeness Report</h2>
                <span style={{ fontSize: "11px", color: "#9aa3b0", background: "#f4f6f9", padding: "2px 8px", borderRadius: "4px" }}>Truthy Agentic RAG · v1.0</span>
              </div>
              <div style={{ padding: "16px 18px", background: "#f4f6f9", borderRadius: "8px", border: "1px solid #e9ecf1", borderLeft: `3px solid ${overallCfg.color}` }}>
                <p style={{ fontSize: "13.5px", color: "#2d3340", lineHeight: 1.75 }}>{results.finalText}</p>
              </div>
              <div style={{ marginTop: "12px", fontSize: "11px", color: "#9aa3b0", fontStyle: "italic" }}>
                This report is generated by an AI system and is intended to assist officer review only. All final decisions remain with the reviewing officer. Truthy does not make legal determinations.
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* SCORE CARD */}
            <div style={{ background: "white", borderRadius: "10px", border: "1px solid #e9ecf1", padding: "20px" }}>
              <h3 style={{ fontSize: "12.5px", fontWeight: 700, color: "#1a202c", marginBottom: "16px" }}>Score Summary</h3>
              {[
                { label: "Passed", count: results.passCount, color: "#1a7a4a", bg: "#e6f4ed" },
                { label: "Warnings", count: results.warnCount, color: "#b45309", bg: "#fef3cd" },
                { label: "Failed", count: results.failCount, color: "#9B1414", bg: "#FDE0DE" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: s.color }} />
                    <span style={{ fontSize: "12px", color: "#5a6270" }}>{s.label}</span>
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: s.color, background: s.bg, padding: "2px 10px", borderRadius: "5px" }}>{s.count}</span>
                </div>
              ))}
              <div style={{ height: "8px", background: "#f4f6f9", borderRadius: "4px", overflow: "hidden", marginTop: "8px", display: "flex" }}>
                {results.passCount > 0 && <div style={{ height: "100%", background: "#1a7a4a", flex: results.passCount }} />}
                {results.warnCount > 0 && <div style={{ height: "100%", background: "#b45309", flex: results.warnCount }} />}
                {results.failCount > 0 && <div style={{ height: "100%", background: "#9B1414", flex: results.failCount }} />}
              </div>
              <div style={{ fontSize: "11px", color: "#9aa3b0", textAlign: "center", marginTop: "8px" }}>{results.stages.length} criteria evaluated</div>
            </div>

            {/* FILES ANALYZED */}
            <div style={{ background: "white", borderRadius: "10px", border: "1px solid #e9ecf1", padding: "20px" }}>
              <h3 style={{ fontSize: "12.5px", fontWeight: 700, color: "#1a202c", marginBottom: "12px" }}>Files Analyzed</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {review.files.map((f) => (
                  <div key={f.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", background: "#f4f6f9", borderRadius: "7px", border: f.warn ? "1px solid #f5c6c4" : "1px solid transparent" }}>
                    <div style={{ width: "28px", height: "33px", borderRadius: "4px", background: f.warn ? "#FDE0DE" : "white", border: `1px solid ${f.warn ? "#f5c6c4" : "#e9ecf1"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="12" height="12" fill="none" stroke={f.warn ? "#9B1414" : "#9aa3b0"} strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "11.5px", fontWeight: 600, color: "#2d3340", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                      <div style={{ fontSize: "10.5px", color: "#9aa3b0" }}>{f.size}</div>
                    </div>
                    {f.warn && <span style={{ fontSize: "9px", fontWeight: 700, color: "#9B1414", background: "#FDE0DE", padding: "1px 5px", borderRadius: "3px", flexShrink: 0 }}>FLAG</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div style={{ background: "white", borderRadius: "10px", border: "1px solid #e9ecf1", padding: "20px" }}>
              <h3 style={{ fontSize: "12.5px", fontWeight: 700, color: "#1a202c", marginBottom: "12px" }}>Actions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button onClick={() => navigate("/review/new")} style={{ width: "100%", padding: "10px", fontSize: "12.5px", fontWeight: 600, color: "white", background: "#1F3A6E", border: "none", cursor: "pointer", borderRadius: "7px" }}>
                  Start Another Review
                </button>
                <button onClick={() => navigate("/cases")} style={{ width: "100%", padding: "10px", fontSize: "12.5px", fontWeight: 600, color: "#1F3A6E", background: "#E8F0FB", border: "none", cursor: "pointer", borderRadius: "7px" }}>
                  Browse Case Queue
                </button>
                <button onClick={() => navigate("/dashboard")} style={{ width: "100%", padding: "10px", fontSize: "12.5px", fontWeight: 500, color: "#5a6270", background: "white", border: "1px solid #e9ecf1", cursor: "pointer", borderRadius: "7px" }}>
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
