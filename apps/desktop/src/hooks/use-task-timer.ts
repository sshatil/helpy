import { useCallback, useEffect, useRef, useState } from 'react';
import { TaskStatus } from '../lib/plans/types';

type UseTaskTimerOptions = {
  duration: number;
  initialStatus?: TaskStatus;
  onStatusChange?: (status: TaskStatus) => void;
  onComplete?: () => void;
};

function getDurationInSeconds(duration: number) {
  return Math.max(0, duration * 60);
}

export function useTaskTimer({
  duration,
  initialStatus = 'ready',
  onStatusChange,
  onComplete,
}: UseTaskTimerOptions) {
  const fullDuration = getDurationInSeconds(duration);

  const [status, setStatus] = useState<TaskStatus>(initialStatus);

  const [remainingSeconds, setRemainingSeconds] = useState(fullDuration);

  const endTimeRef = useRef<number | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const statusRef = useRef<TaskStatus>(initialStatus);

  const onStatusChangeRef = useRef(onStatusChange);

  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    endTimeRef.current = null;
  }, []);

  const setTimerStatus = useCallback((nextStatus: TaskStatus) => {
    statusRef.current = nextStatus;

    setStatus(nextStatus);

    onStatusChangeRef.current?.(nextStatus);
  }, []);

  const start = useCallback(() => {
    if (statusRef.current === 'completed') {
      return;
    }

    if (remainingSeconds <= 0) {
      return;
    }

    endTimeRef.current = Date.now() + remainingSeconds * 1000;

    setTimerStatus('running');
  }, [remainingSeconds, setTimerStatus]);

  const pause = useCallback(() => {
    if (statusRef.current !== 'running') {
      return;
    }

    const endTime = endTimeRef.current;

    if (endTime !== null) {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));

      setRemainingSeconds(remaining);
    }

    clearTimer();

    setTimerStatus('paused');
  }, [clearTimer, setTimerStatus]);

  const stop = useCallback(() => {
    clearTimer();

    setRemainingSeconds(fullDuration);

    setTimerStatus('ready');
  }, [clearTimer, fullDuration, setTimerStatus]);

  const reset = useCallback(() => {
    clearTimer();

    setRemainingSeconds(fullDuration);

    setTimerStatus('ready');
  }, [clearTimer, fullDuration, setTimerStatus]);

  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    if (endTimeRef.current === null) {
      return;
    }

    intervalRef.current = setInterval(() => {
      const endTime = endTimeRef.current;

      if (endTime === null) {
        return;
      }

      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));

      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        clearTimer();

        statusRef.current = 'completed';

        setStatus('completed');

        onStatusChangeRef.current?.('completed');

        onCompleteRef.current?.();
      }
    }, 250);

    return clearTimer;
  }, [status, clearTimer]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    status,
    remainingSeconds,
    start,
    pause,
    stop,
    reset,
  };
}
