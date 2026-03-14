export default function ApplicantSummary({ applicant }) {
  const initials = applicant.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <div className="applicant-summary">
      <div className="summary-left">
        <div className="applicant-avatar">{initials}</div>
        <div className="applicant-title">
          <h2>{applicant.name}</h2>
          <p>{applicant.id}</p>
        </div>
      </div>

      <div className="summary-meta">
        <div className="meta-item">
          <span className="meta-label">
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            Date of Birth
          </span>
          <span className="meta-value">{applicant.dob}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            Nationality
          </span>
          <span className="meta-value">{applicant.nationality}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Application Type
          </span>
          <span className="meta-value">{applicant.applicationType}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Biometrics
          </span>
          <span className="meta-value">
            <span className={`badge ${applicant.biometrics === "Received" ? "badge-complete" : "badge-pending"}`}>
              {applicant.biometrics}
            </span>
          </span>
        </div>
        <div className="meta-item">
          <span className="meta-label">
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            Fee Payment
          </span>
          <span className="meta-value">
            <span className={`badge ${applicant.feePayment === "Paid" ? "badge-complete" : "badge-pending"}`}>
              {applicant.feePayment}
            </span>
          </span>
        </div>
        <div className="meta-item">
          <span className="meta-label">
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Submitted
          </span>
          <span className="meta-value">{applicant.submitted}</span>
        </div>
      </div>

      <div className="summary-actions">
        <button className="btn-secondary">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
          </svg>
          Follow-up
        </button>
      </div>
    </div>
  );
}
