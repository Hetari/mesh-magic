import { describe, it, expect } from "vitest";
import { useHistory } from "../../app/composables/useHistory";

describe("useHistory", () => {
  describe("initialization", () => {
    it("should initialize with the provided initial value", () => {
      const { present } = useHistory({ count: 0 });
      
      expect(present.value).toEqual({ count: 0 });
    });

    it("should have empty past and future on initialization", () => {
      const { past, future } = useHistory({ count: 0 });
      
      expect(past.value).toEqual([]);
      expect(future.value).toEqual([]);
    });

    it("should indicate no undo/redo available initially", () => {
      const { canUndo, canRedo } = useHistory({ count: 0 });
      
      expect(canUndo.value).toBe(false);
      expect(canRedo.value).toBe(false);
    });
  });

  describe("push", () => {
    it("should add current state to past and update present", () => {
      const { present, past, push } = useHistory({ count: 0 });
      
      push({ count: 1 });
      
      expect(present.value).toEqual({ count: 1 });
      expect(past.value).toHaveLength(1);
      expect(past.value[0]).toEqual({ count: 0 });
    });

    it("should clear future when pushing new state", () => {
      const { push, undo, future } = useHistory({ count: 0 });
      
      push({ count: 1 });
      undo();
      push({ count: 2 });
      
      expect(future.value).toEqual([]);
    });

    it("should respect history limit", () => {
      const { past, push } = useHistory({ count: 0 }, { limit: 3 });
      
      push({ count: 1 });
      push({ count: 2 });
      push({ count: 3 });
      push({ count: 4 });
      
      expect(past.value).toHaveLength(3);
      expect(past.value[0]).toEqual({ count: 1 });
    });
  });

  describe("undo", () => {
    it("should restore previous state", () => {
      const { present, push, undo } = useHistory({ count: 0 });
      
      push({ count: 1 });
      push({ count: 2 });
      undo();
      
      expect(present.value).toEqual({ count: 1 });
    });

    it("should move current state to future", () => {
      const { future, push, undo } = useHistory({ count: 0 });
      
      push({ count: 1 });
      undo();
      
      expect(future.value).toHaveLength(1);
      expect(future.value[0]).toEqual({ count: 1 });
    });

    it("should update canUndo and canRedo", () => {
      const { canUndo, canRedo, push, undo } = useHistory({ count: 0 });
      
      push({ count: 1 });
      expect(canUndo.value).toBe(true);
      expect(canRedo.value).toBe(false);
      
      undo();
      expect(canUndo.value).toBe(false);
      expect(canRedo.value).toBe(true);
    });

    it("should do nothing when no history available", () => {
      const { present, undo } = useHistory({ count: 0 });
      
      undo();
      
      expect(present.value).toEqual({ count: 0 });
    });
  });

  describe("redo", () => {
    it("should restore next state", () => {
      const { present, push, undo, redo } = useHistory({ count: 0 });
      
      push({ count: 1 });
      push({ count: 2 });
      undo();
      redo();
      
      expect(present.value).toEqual({ count: 2 });
    });

    it("should move current state to past", () => {
      const { past, push, undo, redo } = useHistory({ count: 0 });
      
      push({ count: 1 });
      undo();
      redo();
      
      expect(past.value).toHaveLength(1);
      expect(past.value[0]).toEqual({ count: 0 });
    });

    it("should do nothing when no future available", () => {
      const { present, push, redo } = useHistory({ count: 0 });
      
      push({ count: 1 });
      redo();
      
      expect(present.value).toEqual({ count: 1 });
    });
  });

  describe("clear", () => {
    it("should clear all history", () => {
      const { past, future, push, undo, clear } = useHistory({ count: 0 });
      
      push({ count: 1 });
      push({ count: 2 });
      undo();
      clear();
      
      expect(past.value).toEqual([]);
      expect(future.value).toEqual([]);
    });
  });

  describe("reset", () => {
    it("should reset to initial value and clear history", () => {
      const { present, past, future, push, undo, reset } = useHistory({ count: 0 });
      
      push({ count: 1 });
      push({ count: 2 });
      undo();
      reset();
      
      expect(present.value).toEqual({ count: 0 });
      expect(past.value).toEqual([]);
      expect(future.value).toEqual([]);
    });
  });

  describe("deep cloning", () => {
    it("should deep clone values by default", () => {
      const { present, push } = useHistory({ nested: { count: 0 } });
      
      const original = present.value;
      push({ nested: { count: 1 } });
      
      expect(original).toEqual({ nested: { count: 0 } });
      expect(present.value).toEqual({ nested: { count: 1 } });
    });

    it("should not deep clone when deep option is false", () => {
      const obj = { nested: { count: 0 } };
      const { present, push } = useHistory(obj, { deep: false });
      
      push(obj);
      obj.nested.count = 1;
      
      expect(present.value.nested.count).toBe(1);
    });
  });
});
