import { ref, computed } from "vue";
import { deepClone } from "~/utils/clone";

/**
 * Configuration options for the history composable.
 */
export type HistoryOptions = {
  /** Maximum number of history entries to keep. */
  limit?: number;
  /** Whether to clone values deeply. */
  deep?: boolean;
};

/**
 * A generic history composable for undo/redo functionality.
 * @param initialValue - The initial value to track.
 * @param options - Configuration options.
 */
export function useHistory<T>(
  initialValue: T,
  options: HistoryOptions = {},
) {
  const { limit = 30, deep = true } = options;

  // Store a snapshot of the original initial value for reset
  const storedInitial = deep ? deepClone(initialValue) : initialValue;

  // History stacks
  const past = ref<T[]>([]);
  const present = ref<T>(deep ? deepClone(initialValue) : initialValue);
  const future = ref<T[]>([]);

  /**
   * Clones a value based on the deep option.
   */
  function clone(value: T): T {
    return deep ? deepClone(value) : value;
  }

  /**
   * Checks if undo is available.
   */
  const canUndo = computed(() => past.value.length > 0);

  /**
   * Checks if redo is available.
   */
  const canRedo = computed(() => future.value.length > 0);

  /**
   * Pushes the current state to history.
   * @param newValue - The new value to set as present.
   */
  function push(newValue: T) {
    // Save current present to past
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    past.value.push(clone(present.value) as any);

    // Limit history size
    if (past.value.length > limit) {
      past.value.shift();
    }

    // Clear future when a new change is made
    future.value = [];

    // Update present
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    present.value = clone(newValue) as any;
  }

  /**
   * Undoes the last change.
   */
  function undo() {
    if (!canUndo.value) return;

    // Move current present to future
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    future.value.unshift(clone(present.value) as any);

    // Restore previous state from past
    const previousState = past.value.pop();
    if (previousState) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      present.value = previousState as any;
    }
  }

  /**
   * Redoes the last undone change.
   */
  function redo() {
    if (!canRedo.value) return;

    // Move current present to past
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    past.value.push(clone(present.value) as any);

    // Restore next state from future
    const nextState = future.value.shift();
    if (nextState) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      present.value = nextState as any;
    }
  }

  /**
   * Clears all history.
   */
  function clear() {
    past.value = [];
    future.value = [];
  }

  /**
   * Resets to initial value and clears history.
   */
  function reset() {
    present.value = clone(storedInitial);
    clear();
  }

  return {
    present,
    past,
    future,
    canUndo,
    canRedo,
    push,
    undo,
    redo,
    clear,
    reset,
  };
}
