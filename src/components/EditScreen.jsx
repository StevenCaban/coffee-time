import { useState } from 'react';
import { formatMs } from '../utils';
import styles from './EditScreen.module.css';

export function EditScreen({ recordedSteps, existingBrew, onSave, onDiscard }) {
  const [brewName, setBrewName] = useState(existingBrew?.name ?? '');
  const [brewDetails, setBrewDetails] = useState(existingBrew?.details ?? '');
  const [steps, setSteps] = useState(
    existingBrew
      ? existingBrew.steps
      : recordedSteps.map((s, i) => ({ ...s, name: `Step ${i + 1}`, notes: '' }))
  );

  function updateStep(index, field, value) {
    setSteps(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  }

  function handleSave() {
    const brew = {
      id: existingBrew?.id ?? String(Date.now()),
      name: brewName.trim() || 'Untitled Brew',
      details: brewDetails.trim(),
      createdAt: existingBrew?.createdAt ?? Date.now(),
      steps,
    };
    onSave(brew);
  }

  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>{existingBrew ? 'Edit Brew' : 'Save Brew'}</h1>

      <div className={styles.form}>
        <label className={styles.label}>Brew Name</label>
        <input
          className={styles.input}
          placeholder="e.g. V60 Light Roast"
          value={brewName}
          onChange={e => setBrewName(e.target.value)}
        />

        <label className={styles.label}>Brew Details</label>
        <textarea
          className={styles.textarea}
          placeholder="e.g. 20g coffee, 300g water, 93°C"
          value={brewDetails}
          onChange={e => setBrewDetails(e.target.value)}
          rows={3}
        />
      </div>

      <div className={styles.stepList}>
        <h3 className={styles.sectionTitle}>Steps</h3>
        {steps.map((step, i) => (
          <div key={i} className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <span className={styles.stepDuration}>{formatMs(step.duration)}</span>
            </div>
            <input
              className={styles.input}
              placeholder={`Step ${i + 1} name (e.g. Bloom)`}
              value={step.name}
              onChange={e => updateStep(i, 'name', e.target.value)}
            />
            <textarea
              className={styles.textarea}
              placeholder="Notes for this step..."
              value={step.notes}
              onChange={e => updateStep(i, 'notes', e.target.value)}
              rows={2}
            />
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button className={styles.secondary} onClick={onDiscard}>Discard</button>
        <button className={styles.primary} onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}
