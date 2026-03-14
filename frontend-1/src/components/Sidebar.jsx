import { useState } from "react";

const FILTERS = ["All", "Pending", "Complete", "Incomplete"];

export default function Sidebar({ applicants, selectedId, onSelect }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = applicants.filter((a) => {
    const matchSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" ||
      a.status === filter.toLowerCase() ||
      (filter === "Pending" && a.status === "pending") ||
      (filter === "Complete" && a.status === "complete") ||
      (filter === "Incomplete" && a.status === "incomplete");
    return matchSearch && matchFilter;
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-search">
        <div className="search-input-wrap">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or ID..."
          />
        </div>
      </div>

      <div className="sidebar-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-btn${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="sidebar-list">
        <div className="sidebar-count">{filtered.length} of {applicants.length} applications</div>
        {filtered.map((a) => (
          <div
            key={a.id}
            className={`applicant-row${selectedId === a.id ? " active" : ""}`}
            onClick={() => onSelect(a.id)}
          >
            <div className="applicant-row-top">
              <span className="applicant-row-name">{a.name}</span>
              <span className={`badge badge-${a.status}`}>
                {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
              </span>
            </div>
            <div className="applicant-row-id">{a.id}</div>
            <div className="applicant-row-meta">
              <span>{a.country}</span>
              <span>{a.submitted}</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
