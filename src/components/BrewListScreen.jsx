import { useRef, useState } from 'react';
import { formatDate } from '../utils';
import styles from './BrewListScreen.module.css';

export function BrewListScreen({ brews, onSelect, onDelete, onEdit, onNewBrew, onExportBrew, onExportAll, onImport }) {
  const fileInputRef = useRef(null);
  const [toast, setToast] = useState(null);

  function showToast(msg, isError = false) {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    try {
      const count = await onImport(file);
      showToast(`Imported ${count} brew${count !== 1 ? 's' : ''}`);
    } catch (err) {
      showToast(err.message || 'Import failed', true);
    }
  }

  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>Coffee Time</h1>

      <div className={styles.topActions}>
        <button className={styles.newBrew} onClick={onNewBrew}>+ New Brew</button>
        <div className={styles.transferBtns}>
          <button className={styles.transferBtn} onClick={() => fileInputRef.current.click()} title="Import brews">
            ↑ Import
          </button>
          {brews.length > 0 && (
            <button className={styles.transferBtn} onClick={onExportAll} title="Export all brews">
              ↓ Export All
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {toast && (
        <div className={`${styles.toast} ${toast.isError ? styles.toastError : ''}`}>
          {toast.msg}
        </div>
      )}

      {brews.length === 0 ? (
        <p className={styles.empty}>No saved brews yet. Record your first one!</p>
      ) : (
        <div className={styles.list}>
          <h3 className={styles.sectionTitle}>Saved Brews</h3>
          {brews.map(brew => (
            <div key={brew.id} className={styles.card} onClick={() => onSelect(brew)}>
              <div className={styles.cardInfo}>
                <div className={styles.brewName}>{brew.name}</div>
                {brew.details && <div className={styles.brewDetails}>{brew.details}</div>}
                <div className={styles.meta}>
                  {brew.steps.length} step{brew.steps.length !== 1 ? 's' : ''} · {formatDate(brew.createdAt)}
                </div>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.exportBtn}
                  onClick={e => { e.stopPropagation(); onExportBrew(brew); }}
                  aria-label="Export brew"
                  title="Export brew"
                >
                  ↓
                </button>
                <button
                  className={styles.editBtn}
                  onClick={e => { e.stopPropagation(); onEdit(brew); }}
                  aria-label="Edit brew"
                >
                  ✎
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={e => { e.stopPropagation(); onDelete(brew.id); }}
                  aria-label="Delete brew"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
