// src/hooks/useAsync.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Generic async hook for service calls.
 * Handles loading, error, and data states.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useAsync(questService.getNearbyQuests);
 *
 * With args:
 *   const { data } = useAsync(() => questService.getQuestById(id), [id]);
 */
const useAsync = (asyncFn, deps = []) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await asyncFn();
      if (result.ok) {
        setState({ data: result.data, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: result.error });
      }
    } catch (err) {
      setState({ data: null, loading: false, error: err?.message || 'Unknown error' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, refetch: execute };
};

export default useAsync;
