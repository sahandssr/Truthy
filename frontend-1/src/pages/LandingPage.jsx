import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    title: "Document Completeness",
    desc: "Automatically flags missing forms, unsigned documents, and incomplete field entries against program requirements.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    title: "Consistency Checking",
    desc: "Cross-references information across forms and documents to surface discrepancies before officer review.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Policy-Grounded Reasoning",
    desc: "Checks against current IRCC program requirements using a continuously refreshed policy knowledge base.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: "Structured Officer Reports",
    desc: "Generates a plain-language completeness report with pass/fail criteria, ready for officer decision-making.",
  },
];

const STEPS = [
  { num: "01", title: "Upload Application Package", desc: "Drag and drop the applicant's forms, supporting documents, and scanned files." },
  { num: "02", title: "AI Completeness Analysis", desc: "Truthy's agentic reasoning engine checks every document against official program requirements." },
  { num: "03", title: "Review Officer Report", desc: "Receive a structured pass/fail report with explanations. Make decisions faster and with confidence." },
];

const MOCK_CASES = [
  { id: "TRV-2026-004821", name: "Priya Sharma", country: "India", status: "Incomplete", issues: 3 },
  { id: "TRV-2026-004756", name: "Carlos Mendoza Rivera", country: "Mexico", status: "Incomplete", issues: 2 },
  { id: "TRV-2026-004902", name: "Amina Hassan Osman", country: "Somalia", status: "Pending", issues: 4 },
  { id: "TRV-2026-004658", name: "Wei Chen", country: "China", status: "Complete", issues: 0 },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',Arial,sans-serif", color: "#1a202c", background: "#fff" }}>
      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid #e9ecf1", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", height: "60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "34px", height: "34px", background: "#8B1A1A", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <span style={{ fontSize: "17px", fontWeight: 700, color: "#1a202c", letterSpacing: "-0.02em" }}>Truthy</span>
          <span style={{ fontSize: "11px", fontWeight: 500, color: "#8B1A1A", background: "#fde0de", padding: "2px 8px", borderRadius: "999px", letterSpacing: "0.04em" }}>IRCC DEMO</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button onClick={() => navigate("/cases")} style={{ padding: "8px 18px", fontSize: "13px", fontWeight: 500, color: "#5a6270", background: "none", border: "none", cursor: "pointer", borderRadius: "6px" }}>
            Case Review
          </button>
          <button onClick={() => navigate("/dashboard")} style={{ padding: "8px 18px", fontSize: "13px", fontWeight: 600, color: "white", background: "#1F3A6E", border: "none", cursor: "pointer", borderRadius: "6px" }}>
            Officer Portal →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #0d1f3c 0%, #1F3A6E 60%, #2a4a8a 100%)", padding: "80px 48px 0", display: "flex", alignItems: "flex-end", gap: "48px", minHeight: "520px", overflow: "hidden" }}>
        <div style={{ flex: 1, paddingBottom: "72px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "999px", padding: "5px 14px", marginBottom: "28px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399", flexShrink: 0 }} />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Now available for IRCC demo review</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px,4.5vw,58px)", fontWeight: 800, color: "white", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: "22px" }}>
            Application review,<br />
            <span style={{ color: "#7ecfad" }}>done right.</span>
          </h1>
          <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "480px", marginBottom: "36px" }}>
            Truthy is an AI-assisted completeness verification platform built for immigration officers. Check every document, form, and field — in seconds.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/review/new")} style={{ padding: "14px 28px", fontSize: "15px", fontWeight: 700, color: "white", background: "#8B1A1A", border: "none", cursor: "pointer", borderRadius: "8px", letterSpacing: "-0.01em" }}>
              Start Demo Review →
            </button>
            <button onClick={() => navigate("/dashboard")} style={{ padding: "14px 28px", fontSize: "15px", fontWeight: 600, color: "white", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", borderRadius: "8px" }}>
              View Dashboard
            </button>
          </div>
        </div>

        {/* MOCK DASHBOARD PREVIEW */}
        <div style={{ width: "520px", flexShrink: 0, background: "#f4f6f9", borderRadius: "12px 12px 0 0", overflow: "hidden", boxShadow: "0 -8px 40px rgba(0,0,0,0.3)", border: "1px solid #e9ecf1", borderBottom: "none" }}>
          <div style={{ background: "#8B1A1A", height: "40px", display: "flex", alignItems: "center", padding: "0 16px", gap: "10px" }}>
            <div style={{ display: "flex", gap: "6px" }}>
              {["#ff5f57","#febc2e","#28c840"].map((c, i) => <span key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />)}
            </div>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>IRCC Case Review — Truthy</span>
          </div>
          <div style={{ display: "flex", height: "320px" }}>
            <div style={{ width: "160px", background: "white", borderRight: "1px solid #e9ecf1", padding: "12px 0" }}>
              <div style={{ padding: "6px 14px", fontSize: "10px", color: "#9aa3b0", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Active Cases</div>
              {MOCK_CASES.map((c) => (
                <div key={c.id} style={{ padding: "8px 14px", borderLeft: `3px solid ${c.status === "Complete" ? "#1a7a4a" : c.status === "Pending" ? "#b45309" : "#9B1414"}`, marginBottom: "2px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#2d3340" }}>{c.name.split(" ")[0]}</div>
                  <div style={{ fontSize: "9.5px", color: "#9aa3b0" }}>{c.id}</div>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, padding: "16px" }}>
              <div style={{ background: "white", borderRadius: "8px", padding: "12px", marginBottom: "10px", border: "1px solid #e9ecf1" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#2d3340", marginBottom: "6px" }}>Priya Sharma — TRV-2026-004821</div>
                <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
                  {["IMM 5257 ✓","IMM 5707 ✓","IMM 5476 ✓","IMM 5409 ✗"].map((f, i) => (
                    <span key={i} style={{ fontSize: "9px", padding: "2px 7px", borderRadius: "4px", background: f.includes("✗") ? "#FDE0DE" : "#e6f4ed", color: f.includes("✗") ? "#9B1414" : "#1a7a4a", fontWeight: 600 }}>{f}</span>
                  ))}
                </div>
                <div style={{ height: "4px", background: "#e9ecf1", borderRadius: "2px" }}>
                  <div style={{ width: "60%", height: "100%", background: "#8B1A1A", borderRadius: "2px" }} />
                </div>
                <div style={{ fontSize: "9.5px", color: "#9aa3b0", marginTop: "5px" }}>Completeness: 60% — 3 issues found</div>
              </div>
              <div style={{ background: "#1F3A6E", borderRadius: "6px", padding: "10px 12px", color: "white" }}>
                <div style={{ fontSize: "10px", fontWeight: 600, marginBottom: "4px" }}>AI Analysis Complete</div>
                <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>IMM 5409 missing. Purpose of travel letter not uploaded. Marriage certificate required for this application type.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: "#1F3A6E", padding: "0 48px" }}>
        <div style={{ display: "flex", gap: "0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {[
            { value: "< 30s", label: "Average analysis time" },
            { value: "4+", label: "Program types supported" },
            { value: "98%", label: "Document detection accuracy" },
            { value: "PROTECTED B", label: "Security classification" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: "22px 28px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
              <div style={{ fontSize: "24px", fontWeight: 800, color: "white", marginBottom: "4px" }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 48px", background: "#f4f6f9" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#8B1A1A", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "12px" }}>How It Works</div>
            <h2 style={{ fontSize: "36px", fontWeight: 800, color: "#1a202c", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Three steps to a complete review</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px" }}>
            {STEPS.map((s) => (
              <div key={s.num} style={{ background: "white", borderRadius: "12px", padding: "32px 28px", border: "1px solid #e9ecf1", position: "relative", overflow: "hidden" }}>
                <div style={{ fontSize: "48px", fontWeight: 900, color: "#e9ecf1", position: "absolute", top: "16px", right: "20px", lineHeight: 1, userSelect: "none" }}>{s.num}</div>
                <div style={{ fontSize: "13px", fontWeight: 800, color: "#8B1A1A", marginBottom: "12px", letterSpacing: "0.06em" }}>{s.num}</div>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1a202c", marginBottom: "10px", lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ fontSize: "13px", color: "#5a6270", lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "80px 48px", background: "white" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: "#8B1A1A", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "12px" }}>Capabilities</div>
            <h2 style={{ fontSize: "36px", fontWeight: 800, color: "#1a202c", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Built for government-grade verification</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "20px" }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: "18px", background: "#f4f6f9", borderRadius: "12px", padding: "28px 24px", border: "1px solid #e9ecf1" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "10px", background: "#1F3A6E", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#1a202c", marginBottom: "8px" }}>{f.title}</h3>
                  <p style={{ fontSize: "13px", color: "#5a6270", lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: "linear-gradient(135deg, #8B1A1A 0%, #c0392b 100%)", padding: "64px 48px", textAlign: "center" }}>
        <h2 style={{ fontSize: "34px", fontWeight: 800, color: "white", letterSpacing: "-0.02em", marginBottom: "16px" }}>Ready to see it in action?</h2>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.75)", marginBottom: "32px", maxWidth: "480px", margin: "0 auto 32px" }}>
          Run a live demo review on one of our sample TRV application packages — no setup required.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/review/new")} style={{ padding: "14px 32px", fontSize: "15px", fontWeight: 700, color: "#8B1A1A", background: "white", border: "none", cursor: "pointer", borderRadius: "8px" }}>
            Start Demo Review →
          </button>
          <button onClick={() => navigate("/dashboard")} style={{ padding: "14px 32px", fontSize: "15px", fontWeight: 600, color: "white", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer", borderRadius: "8px" }}>
            View Dashboard
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0d1f3c", padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "28px", height: "28px", background: "#8B1A1A", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "white" }}>Truthy</span>
        </div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
          Demo prototype · IRCC Immigration, Refugees and Citizenship Canada · PROTECTED B
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          {["Dashboard", "Start Review", "Cases"].map((l) => (
            <button key={l} onClick={() => navigate(l === "Dashboard" ? "/dashboard" : l === "Start Review" ? "/review/new" : "/cases")} style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", background: "none", border: "none", cursor: "pointer" }}>{l}</button>
          ))}
        </div>
      </footer>
    </div>
  );
}
