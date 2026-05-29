import { useState, useEffect, useRef, useCallback } from 'react';

function beep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Audio not available
  }
}

export function useCountdown(brew) {
  const [status, setStatus] = useState('idle'); // idle | running | paused | done
  const [currentStep, setCurrentStep] = useState(0);
  const [remaining, setRemaining] = useState(brew ? brew.steps[0]?.duration ?? 0 : 0);
  const [flashing, setFlashing] = useState(false);

  const endTimeRef = useRef(null);
  const intervalRef = useRef(null);
  const currentStepRef = useRef(0);

  const steps = brew?.steps ?? [];

  const advanceStep = useCallback((nextIndex) => {
    beep();
    setFlashing(true);
    setTimeout(() => setFlashing(false), 1000);

    if (nextIndex >= steps.length) {
      setStatus('done');
      setRemaining(0);
      clearInterval(intervalRef.current);
      return;
    }

    currentStepRef.current = nextIndex;
    setCurrentStep(nextIndex);
    const dur = steps[nextIndex].duration;
    setRemaining(dur);
    endTimeRef.current = Date.now() + dur;
  }, [steps]);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        const r = endTimeRef.current - Date.now();
        if (r <= 0) {
          advanceStep(currentStepRef.current + 1);
        } else {
          setRemaining(r);
        }
      }, 50);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [status, advanceStep]);

  function start() {
    if (!brew || steps.length === 0) return;
    if (status === 'paused') {
      endTimeRef.current = Date.now() + remaining;
      setStatus('running');
      return;
    }
    currentStepRef.current = 0;
    setCurrentStep(0);
    const dur = steps[0].duration;
    setRemaining(dur);
    endTimeRef.current = Date.now() + dur;
    setStatus('running');
  }

  function pause() {
    setStatus('paused');
  }

  function reset() {
    clearInterval(intervalRef.current);
    currentStepRef.current = 0;
    setCurrentStep(0);
    setRemaining(steps[0]?.duration ?? 0);
    setStatus('idle');
    setFlashing(false);
    endTimeRef.current = null;
  }

  return { status, currentStep, remaining, flashing, start, pause, reset };
}
