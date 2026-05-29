import { useStopwatch } from '../hooks/useStopwatch';
import { formatTime, formatMs } from '../utils';
import styles from './StopwatchScreen.module.css';

export function StopwatchScreen({ onFinish, onCancel }) {
  const { status, elapsed, stepElapsed, completedSteps, start, newStep, stop, reset } = useStopwatch();

  function handleStop() {
    stop();
  }

  function handleFinish() {
    onFinish(completedSteps);
    reset();
  }

  function handleDiscard() {
    reset();
    onCancel();
  }

  return (
    <div className={styles.screen}>
      <h1 className={styles.title}>New Brew</h1>

      <div className={styles.timerBlock}>
       
        {status === 'running' && (
          <div className={styles.stepTime}>
            {formatMs(stepElapsed)}
            <div className={styles.totalTime}>Total: {formatTime(elapsed)}</div>
          </div>
        )}
        
        {status === 'stopped' && (
          <div className={styles.stepTime}>Total: {formatTime(elapsed)}</div>
        )}
      </div>

      {status !== 'stopped' ? (
        <div className={styles.controls}>
          {status === 'idle' && (
            <button className={styles.primary} onClick={start}>Start</button>
          )}
          {status === 'running' && (
            <>
              <button className={styles.secondary} onClick={newStep}>New Step</button>
              <button className={styles.danger} onClick={handleStop}>Stop</button>
            </>
          )}
        </div>
      ) : (
        <div className={styles.controls}>
          <button className={styles.secondary} onClick={handleDiscard}>Discard</button>
          <button className={styles.primary} onClick={handleFinish}>Save Brew</button>
        </div>
      )}

      {completedSteps.length > 0 && (
        <div className={styles.stepList}>
          <h3>Steps</h3>
          {completedSteps.map((s, i) => (
            <div key={i} className={styles.stepRow}>
              <span className={styles.stepNum}>Step {i + 1}</span>
              <span className={styles.stepDur}>{formatMs(s.duration)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
