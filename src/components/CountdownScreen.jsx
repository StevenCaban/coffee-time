import { useCountdown } from '../hooks/useCountdown';
import { formatMs } from '../utils';
import styles from './CountdownScreen.module.css';

function pad(n) {
  return String(Math.floor(n)).padStart(2, '0');
}

function formatCountdown(ms) {
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${pad(m)}:${pad(s)}`;
}

export function CountdownScreen({ brew, onDone }) {
  const { status, currentStep, remaining, flashing, start, pause, reset } = useCountdown(brew);

  const steps = brew.steps;

  return (
    <div className={`${styles.screen} ${flashing ? styles.flash : ''}`}>
      <button className={styles.backBtn} onClick={onDone}>← Back</button>

      <div className={styles.brewInfo}>
        <h1 className={styles.brewName}>{brew.name}</h1>
        {brew.details && <p className={styles.brewDetails}>{brew.details}</p>}
      </div>

      {status === 'done' ? (
        <div className={styles.doneBlock}>
          <div className={styles.doneText}>Done!</div>
          <p className={styles.doneSubtext}>Enjoy your brew.</p>
          <div className={styles.controls}>
            <button className={styles.secondary} onClick={reset}>Restart</button>
            <button className={styles.primary} onClick={onDone}>Finish</button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.timerBlock}>
            <div className={styles.stepLabel}>
              {steps[currentStep]?.name || `Step ${currentStep + 1}`}
            </div>
            <div className={styles.countdown}>{formatCountdown(remaining)}</div>
            <div className={styles.progress}>
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          <div className={styles.controls}>
            {status === 'idle' && (
              <button className={styles.primary} onClick={start}>Start</button>
            )}
            {status === 'running' && (
              <>
                <button className={styles.secondary} onClick={pause}>Pause</button>
                <button className={styles.secondary} onClick={reset}>Reset</button>
              </>
            )}
            {status === 'paused' && (
              <>
                <button className={styles.primary} onClick={start}>Resume</button>
                <button className={styles.secondary} onClick={reset}>Reset</button>
              </>
            )}
          </div>
        </>
      )}

      <div className={styles.stepList}>
        {steps.map((step, i) => {
          const isActive = i === currentStep && status !== 'done';
          const isDone = i < currentStep || status === 'done';
          return (
            <div
              key={i}
              className={`${styles.stepRow} ${isActive ? styles.active : ''} ${isDone ? styles.done : ''}`}
            >
              <div className={styles.stepMeta}>
                <span className={styles.stepName}>{step.name || `Step ${i + 1}`}</span>
                {step.notes && <span className={styles.stepNotes}>{step.notes}</span>}
              </div>
              <span className={styles.stepDur}>{formatMs(step.duration)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
