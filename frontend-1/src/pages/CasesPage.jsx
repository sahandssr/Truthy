import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import ApplicantSummary from "../components/ApplicantSummary";
import FormsTab from "../components/FormsTab";
import DocumentsTab from "../components/DocumentsTab";
import NotesTab from "../components/NotesTab";
import CompletenessPanel from "../components/CompletenessPanel";
import { APPLICANTS } from "../lib/mockData";

const TABS = [
  {
    id: "forms",
    label: "Forms",
    icon: (
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    id: "documents",
    label: "Supporting Documents",
    icon: (
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: "notes",
    label: "Notes / Review History",
    icon: (
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
];

export default function CasesPage() {
  const [selectedId, setSelectedId] = useState(APPLICANTS[0].id);
  const [activeTab, setActiveTab] = useState("forms");

  const applicant = APPLICANTS.find((a) => a.id === selectedId) || null;

  function handleSelectApplicant(id) {
    setSelectedId(id);
    setActiveTab("forms");
  }

  return (
    <div className="app-shell">
      <Header />
      <div className="main-layout">
        <Sidebar
          applicants={APPLICANTS}
          selectedId={selectedId}
          onSelect={handleSelectApplicant}
        />
        <div className="content-area">
          <div className="main-panel">
            {applicant ? (
              <>
                <ApplicantSummary applicant={applicant} />
                <div className="tabs-bar">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
                {activeTab === "forms" && <FormsTab forms={applicant.forms} />}
                {activeTab === "documents" && <DocumentsTab documents={applicant.documents} />}
                {activeTab === "notes" && <NotesTab notes={applicant.notes} />}
              </>
            ) : (
              <div className="no-selection">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <p>Select an application to begin review</p>
              </div>
            )}
          </div>
          {applicant && (
            <aside className="right-panel">
              <CompletenessPanel key={applicant.id} applicant={applicant} />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
