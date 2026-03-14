import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo" style={{ cursor: "pointer" }} onClick={() => navigate("/")}>IRCC</div>
        <div className="header-title-group">
          <h1>IRCC Case Review</h1>
          <p>Temporary Resident Visa Processing</p>
        </div>
        <div className="protected-badge">
          <span className="protected-badge-dot" />
          PROTECTED B
        </div>
      </div>
      <div className="header-right">
        <button
          onClick={() => navigate("/review/new")}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 14px", fontSize: "12px", fontWeight: 600, color: "white", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", borderRadius: "5px" }}
        >
          + New Review
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", background: "none", border: "none", cursor: "pointer", padding: "6px 10px" }}
        >
          Dashboard
        </button>
        <button className="header-icon-btn" aria-label="Notifications">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="notif-dot" />
        </button>
        <div className="header-officer">
          <div className="officer-info">
            <strong>J. Thompson</strong>
            <span>Review Officer</span>
          </div>
          <div className="officer-avatar">JT</div>
        </div>
      </div>
    </header>
  );
}
