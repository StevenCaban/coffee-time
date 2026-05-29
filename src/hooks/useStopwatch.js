import { useState, useEffect, useRef } from 'react';

export function useStopwatch() {
  const [status, setStatus] = useState('idle'); // idle | running | stopped
  const [elapsed, setElapsed] = useState(0);
  const [stepElapsed, setStepElapsed] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const startTimeRef = useRef(null);
  const lapStartRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        setElapsed(now - startTimeRef.current);
        setStepElapsed(now - lapStartRef.current);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [status]);

  function start() {
    const now = Date.now();
    startTimeRef.current = now;
    lapStartRef.current = now;
    setElapsed(0);
    setStepElapsed(0);
    setCompletedSteps([]);
    setStatus('running');
  }

  function newStep() {
    if (status !== 'running') return;
    const now = Date.now();
    const duration = now - lapStartRef.current;
    setCompletedSteps(prev => [...prev, { duration }]);
    lapStartRef.current = now;
    setStepElapsed(0);
  }

  function stop() {
    if (status !== 'running') return;
    const now = Date.now();
    const duration = now - lapStartRef.current;
    setCompletedSteps(prev => [...prev, { duration }]);
    setStatus('stopped');
  }

  function reset() {
    setStatus('idle');
    setElapsed(0);
    setStepElapsed(0);
    setCompletedSteps([]);
    startTimeRef.current = null;
    lapStartRef.current = null;
  }

  return { status, elapsed, stepElapsed, completedSteps, start, newStep, stop, reset };
}
