import { useNavigate } from "react-router-dom";
import { APPLICANTS } from "../lib/mockData";

const STATS = [
  { label: "Active Reviews", value: "5", sub: "3 require attention", color: "#1F3A6E", icon: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>) },
  { label: "Incomplete", value: "2", sub: "Missing required docs", color: "#9B1414", icon: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>) },
  { label: "Pending Review", value: "2", sub: "Awaiting officer action", color: "#b45309", icon: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>) },
  { label: "Complete", value: "1", sub: "Ready for decision", color: "#1a7a4a", icon: (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>) },
];

const POLICY_UPDATES = [
  { program: "Visitor Visa (TRV)", updated: "Mar 12, 2026", change: "Updated biometrics exemption list", status: "current" },
  { program: "Study Permit", updated: "Mar 8, 2026", change: "New financial proof thresholds", status: "current" },
  { program: "Work Permit", updated: "Feb 28, 2026", change: "LMIA requirement clarification", status: "aging" },
];

const HEALTH = [
  { name: "Agentic RAG Engine", status: "online", latency: "240ms" },
  { name: "Policy Knowledge Base", status: "online", latency: "12ms" },
  { name: "Document Indexer", status: "online", latency: "88ms" },
  { name: "API Gateway", status: "online", latency: "34ms" },
];

function StatusBadge({ status }) {
  const cfg = {
    incomplete: { bg: "#FDE0DE", color: "#9B1414", label: "Incomplete" },
    pending: { bg: "#fef3cd", color: "#b45309", label: "Pending" },
    complete: { bg: "#e6f4ed", color: "#1a7a4a", label: "Complete" },
  }[status] || { bg: "#e9ecf1", color: "#5a6270", label: status };
  return (
    <span style={{ display: "inline-block", padding: "2px 9px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f4f6f9", fontFamily: "'Inter','Segoe UI',Arial,sans-serif" }}>
      {/* HEADER */}
      <header style={{ background: "#8B1A1A", color: "white", padding: "0 24px", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "30px", height: "30px", background: "#1F3A6E", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, cursor: "pointer" }} onClick={() => navigate("/")}>IRCC</div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600, lineHeight: 1.2 }}>Truthy — Officer Dashboard</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", lineHeight: 1 }}>Immigration, Refugees and Citizenship Canada</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", padding: "3px 10px", fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "0.08em" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#f59e0b" }} />
            PROTECTED B
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => navigate("/")} style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", background: "none", border: "none", cursor: "pointer" }}>← Landing</button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "white" }}>J. Thompson</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>Review Officer</div>
            </div>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#1F3A6E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "white" }}>JT</div>
          </div>
        </div>
      </header>

      <main style={{ flex: 1, padding: "28px 32px", maxWidth: "1200px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
        {/* PAGE TITLE + QUICK ACTIONS */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#1a202c", letterSpacing: "-0.02em", marginBottom: "4px" }}>Good morning, Officer Thompson</h1>
            <p style={{ fontSize: "13px", color: "#5a6270" }}>March 14, 2026 · 5 applications in your queue</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => navigate("/review/new")} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", fontSize: "13px", fontWeight: 700, color: "white", background: "#1F3A6E", border: "none", cursor: "pointer", borderRadius: "7px" }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Start New Review
            </button>
            <button onClick={() => navigate("/cases")} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px", fontSize: "13px", fontWeight: 600, color: "#1F3A6E", background: "white", border: "1px solid #d1d7e0", cursor: "pointer", borderRadius: "7px" }}>
              View All Cases
            </button>
          </div>
        </div>

        {/* STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "28px" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ background: "white", borderRadius: "10px", padding: "20px", border: "1px solid #e9ecf1", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", color: s.color, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: "26px", fontWeight: 800, color: "#1a202c", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#2d3340", marginTop: "2px" }}>{s.label}</div>
                <div style={{ fontSize: "11px", color: "#9aa3b0", marginTop: "1px" }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }}>
          {/* ACTIVE APPLICATIONS TABLE */}
          <div style={{ background: "white", borderRadius: "10px", border: "1px solid #e9ecf1", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #e9ecf1" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 700, color: "#1a202c" }}>Active Reviews</h2>
              <button onClick={() => navigate("/cases")} style={{ fontSize: "12px", color: "#1F3A6E", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all →</button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f4f6f9" }}>
                    {["Application ID","Applicant","Country","Submitted","Status","Action"].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", fontSize: "10.5px", fontWeight: 700, color: "#9aa3b0", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {APPLICANTS.map((a, i) => (
                    <tr key={a.id} style={{ borderTop: "1px solid #f4f6f9", background: i % 2 === 0 ? "white" : "#fafbfc" }}>
                      <td style={{ padding: "12px 16px", fontSize: "12px", fontWeight: 600, color: "#1F3A6E", whiteSpace: "nowrap" }}>{a.id}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#E8F0FB", border: "1.5px solid #2A4F8E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#1F3A6E", flexShrink: 0 }}>
                            {a.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#2d3340" }}>{a.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "12px", color: "#5a6270" }}>{a.country}</td>
                      <td style={{ padding: "12px 16px", fontSize: "12px", color: "#5a6270", whiteSpace: "nowrap" }}>{a.submitted}</td>
                      <td style={{ padding: "12px 16px" }}><StatusBadge status={a.status} /></td>
                      <td style={{ padding: "12px 16px" }}>
                        <button onClick={() => navigate("/cases")} style={{ fontSize: "11.5px", color: "#1F3A6E", background: "#E8F0FB", border: "none", cursor: "pointer", padding: "4px 12px", borderRadius: "5px", fontWeight: 600 }}>
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* QUICK ACTIONS */}
            <div style={{ background: "white", borderRadius: "10px", border: "1px solid #e9ecf1", padding: "16px 18px" }}>
              <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#1a202c", marginBottom: "12px" }}>Quick Actions</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { label: "Start New Review", icon: "＋", desc: "Submit a new application package", action: "/review/new", primary: true },
                  { label: "View Demo Cases", icon: "◻", desc: "Browse all 5 TRV applications", action: "/cases", primary: false },
                  { label: "Refresh Policy KB", icon: "↻", desc: "Last updated Mar 12, 2026", action: null, primary: false },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => item.action && navigate(item.action)}
                    style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", background: item.primary ? "#1F3A6E" : "#f4f6f9", border: item.primary ? "none" : "1px solid #e9ecf1", borderRadius: "7px", cursor: item.action ? "pointer" : "default", textAlign: "left", width: "100%" }}
                  >
                    <div style={{ width: "30px", height: "30px", borderRadius: "7px", background: item.primary ? "rgba(255,255,255,0.15)" : "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: item.primary ? "white" : "#1F3A6E", flexShrink: 0, border: item.primary ? "none" : "1px solid #e9ecf1" }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: "12.5px", fontWeight: 600, color: item.primary ? "white" : "#2d3340" }}>{item.label}</div>
                      <div style={{ fontSize: "11px", color: item.primary ? "rgba(255,255,255,0.6)" : "#9aa3b0" }}>{item.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* POLICY REFRESHES */}
            <div style={{ background: "white", borderRadius: "10px", border: "1px solid #e9ecf1", padding: "16px 18px" }}>
              <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#1a202c", marginBottom: "12px" }}>Recent Policy Refreshes</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {POLICY_UPDATES.map((p) => (
                  <div key={p.program} style={{ padding: "10px 12px", background: "#f4f6f9", borderRadius: "7px", borderLeft: `3px solid ${p.status === "current" ? "#1a7a4a" : "#b45309"}` }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#2d3340", marginBottom: "2px" }}>{p.program}</div>
                    <div style={{ fontSize: "11px", color: "#5a6270", marginBottom: "4px" }}>{p.change}</div>
                    <div style={{ fontSize: "10.5px", color: "#9aa3b0" }}>{p.updated}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SYSTEM HEALTH */}
            <div style={{ background: "white", borderRadius: "10px", border: "1px solid #e9ecf1", padding: "16px 18px" }}>
              <h2 style={{ fontSize: "13px", fontWeight: 700, color: "#1a202c", marginBottom: "12px" }}>System Health</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {HEALTH.map((h) => (
                  <div key={h.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#34d399", flexShrink: 0 }} />
                      <span style={{ fontSize: "12px", color: "#2d3340" }}>{h.name}</span>
                    </div>
                    <span style={{ fontSize: "11px", color: "#9aa3b0" }}>{h.latency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
