import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { ref } from "vue";

// Mock useState to use regular ref in tests
const stateMap = new Map<string, unknown>();

mockNuxtImport("useState", () => {
  return <T>(key: string, init?: () => T) => {
    if (!stateMap.has(key)) {
      stateMap.set(key, ref(init ? init() : undefined));
    }
    return stateMap.get(key);
  };
});

// Mock VueUse composables
vi.mock("@vueuse/core", () => ({
  useMagicKeys: vi.fn(() => ({
    ctrl: ref(false),
    meta: ref(false),
    shift: ref(false),
    alt: ref(false),
    r: ref(false),
    a: ref(false),
    d: ref(false),
  })),
  whenever: vi.fn(),
  onKeyStroke: vi.fn(),
}));

describe("useKeyboardShortcuts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stateMap.clear();
  });

  const getComposable = async () => {
    const module = await import("../../app/composables/useKeyboardShortcuts");
    return module.useKeyboardShortcuts;
  };

  describe("showHelpDialog", () => {
    it("should initialize with false", async () => {
      const useKeyboardShortcuts = await getComposable();
      const { showHelpDialog } = useKeyboardShortcuts();

      expect(showHelpDialog.value).toBe(false);
    });
  });

  describe("openHelpDialog", () => {
    it("should set showHelpDialog to true", async () => {
      const useKeyboardShortcuts = await getComposable();
      const { showHelpDialog, openHelpDialog } = useKeyboardShortcuts();

      openHelpDialog();

      expect(showHelpDialog.value).toBe(true);
    });
  });

  describe("closeHelpDialog", () => {
    it("should set showHelpDialog to false", async () => {
      const useKeyboardShortcuts = await getComposable();
      const { showHelpDialog, openHelpDialog, closeHelpDialog } =
        useKeyboardShortcuts();

      openHelpDialog();
      expect(showHelpDialog.value).toBe(true);

      closeHelpDialog();
      expect(showHelpDialog.value).toBe(false);
    });
  });

  describe("toggleHelpDialog", () => {
    it("should toggle showHelpDialog state", async () => {
      const useKeyboardShortcuts = await getComposable();
      const { showHelpDialog, toggleHelpDialog } = useKeyboardShortcuts();

      expect(showHelpDialog.value).toBe(false);

      toggleHelpDialog();
      expect(showHelpDialog.value).toBe(true);

      toggleHelpDialog();
      expect(showHelpDialog.value).toBe(false);
    });
  });

  describe("isMac", () => {
    it("should detect platform correctly", async () => {
      const useKeyboardShortcuts = await getComposable();
      const { isMac } = useKeyboardShortcuts();

      expect(typeof isMac).toBe("boolean");
    });
  });

  describe("registerKeyStroke", () => {
    it("should register a key stroke handler", async () => {
      const { onKeyStroke } = await import("@vueuse/core");
      const useKeyboardShortcuts = await getComposable();
      const { registerKeyStroke } = useKeyboardShortcuts();

      const mockAction = vi.fn();
      registerKeyStroke("r", mockAction);

      expect(onKeyStroke).toHaveBeenCalledWith("r", expect.any(Function));
    });
  });

  describe("registerShortcut", () => {
    it("should register a keyboard shortcut", async () => {
      const { whenever } = await import("@vueuse/core");
      const useKeyboardShortcuts = await getComposable();
      const { registerShortcut } = useKeyboardShortcuts();

      const mockAction = vi.fn();
      const shortcut = {
        id: "test-shortcut",
        name: "Test Shortcut",
        description: "A test shortcut",
        keys: "Ctrl+R",
        category: "general" as const,
        action: mockAction,
      };

      registerShortcut(shortcut);

      expect(whenever).toHaveBeenCalled();
    });
  });
});
