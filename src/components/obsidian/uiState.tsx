"use client";
import React from "react";

type UIState = Record<string, unknown>;

type UIStateContextType = {
  state: UIState;
  setState: (key: string, value: unknown) => void;
  resetState: (prefix?: string) => void;
};

const UIStateContext = React.createContext<UIStateContextType | null>(null);

export function UIStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setStateMap] = React.useState<UIState>({});

  const setState = React.useCallback((key: string, value: unknown) => {
    setStateMap((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetState = React.useCallback((prefix?: string) => {
    if (!prefix) {
      setStateMap({});
      return;
    }
    setStateMap((prev) => {
      const next: UIState = {};
      for (const [k, v] of Object.entries(prev)) {
        if (!k.startsWith(prefix)) next[k] = v;
      }
      return next;
    });
  }, []);

  return (
    <UIStateContext.Provider value={{ state, setState, resetState }}>
      {children}
    </UIStateContext.Provider>
  );
}

export function useUIState() {
  const ctx = React.useContext(UIStateContext);
  if (!ctx) throw new Error("useUIState must be used within UIStateProvider");
  return ctx;
}

// Convenience hook to get only the reset utility
export function useResetUIState() {
  const { resetState } = useUIState();
  return resetState;
}
