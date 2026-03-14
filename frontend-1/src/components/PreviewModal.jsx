export default function PreviewModal({ title, subtitle, onClose }) {
  return (
    <div className="preview-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="preview-modal-header">
          <div className="preview-modal-header-left">
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <div className="preview-modal-controls">
            <button className="preview-ctrl-btn" title="Zoom out">−</button>
            <button className="preview-ctrl-btn" title="Zoom in">+</button>
            <button className="preview-ctrl-btn" title="Download">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </button>
            <button className="preview-close-btn" onClick={onClose} aria-label="Close">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="preview-modal-body">
          <div className="preview-placeholder">
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
            <p><strong>{title}</strong></p>
            <p>Document preview — 3 pages</p>
          </div>
        </div>
      </div>
    </div>
  );
}
