'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/toast';

export interface ProgressMap {
  [taskId: string]: boolean;
}

export function useProgress(initialProgressMap?: ProgressMap) {
  const [progressMap, setProgressMap] = useState<ProgressMap>(initialProgressMap || {});
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const pendingToggles = useRef<Set<string>>(new Set());

  // Function to fetch progress from database and set it as map state
  const getProgress = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/progress');
      if (!res.ok) {
        throw new Error(`Failed to fetch progress: ${res.statusText}`);
      }
      const data = await res.json();
      const map: ProgressMap = {};
      if (data.progress) {
        data.progress.forEach((p: { task_id: string; completed: boolean }) => {
          map[p.task_id] = p.completed;
        });
      }
      setProgressMap(map);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || 'An error occurred while fetching progress.', 'Fetch Failed');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch progress on load if no initial map was provided
  useEffect(() => {
    if (!initialProgressMap) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      getProgress();
    }
  }, [initialProgressMap, getProgress]);

  // Toggle function that implements optimistic state updates and rollback on error
  const toggleTask = useCallback(async (taskId: string) => {
    // Prevent double calls (rapid clicks)
    if (pendingToggles.current.has(taskId)) {
      return;
    }

    pendingToggles.current.add(taskId);
    const previousValue = !!progressMap[taskId];

    // Optimistic Update
    setProgressMap((prev) => ({
      ...prev,
      [taskId]: !previousValue,
    }));

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update task progress: ${res.statusText}`);
      }

      const result = await res.json();
      if (result.success && result.progress) {
        const completedState = result.progress.completed;
        // Enforce synchronization with the actual DB return status
        setProgressMap((prev) => ({
          ...prev,
          [taskId]: completedState,
        }));
        
        if (completedState) {
          toast.success('Checkpoint marked as completed!', 'Task Completed');
        } else {
          toast.info('Checkpoint marked as incomplete.', 'Task Reset');
        }
      } else {
        throw new Error('API did not return a valid progress record.');
      }
    } catch (err) {
      const error = err as Error;
      // Rollback optimistic update
      setProgressMap((prev) => ({
        ...prev,
        [taskId]: previousValue,
      }));
      toast.error(error.message || 'An error occurred during task toggle.', 'Update Failed');
    } finally {
      pendingToggles.current.delete(taskId);
    }
  }, [progressMap, toast]);

  return {
    progressMap,
    loading,
    getProgress,
    toggleTask,
  };
}
