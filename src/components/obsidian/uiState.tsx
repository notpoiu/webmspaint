"use client";
import React from "react";

type UIState = Record<string, unknown>;

type UIStateContextType = {
	state: UIState;
	setState: (key: string, value: unknown) => void;
	resetState: (prefix?: string) => void;
	subscribe: (key: string, callback: () => void) => () => void;
};

const UIStateContext = React.createContext<UIStateContextType | null>(null);

/**
 * React context provider that manages a simple per-key UI state map with subscription support.
 *
 * Provides a UIStateContext to descendants exposing:
 * - state: the current key→value map,
 * - setState(key, value): set a single key's value and notify subscribers for that key,
 * - resetState(prefix?): clear all state (no prefix) or remove keys starting with `prefix` and notify affected subscribers,
 * - subscribe(key, callback): register a per-key listener (returns an unsubscribe function).
 *
 * The provider keeps listener sets per key and ensures subscribers for a key are invoked whenever that key's value is updated or cleared by resetState.
 *
 * @returns A JSX element wrapping children with the UI state context provider.
 */
export function UIStateProvider({ children }: { children: React.ReactNode }) {
	const [state, setStateMap] = React.useState<UIState>({});
	const stateRef = React.useRef<UIState>({});
	React.useEffect(() => {
		stateRef.current = state;
	}, [state]);

	const listenersRef = React.useRef<Map<string, Set<() => void>>>(new Map());
	const notify = React.useCallback((key: string) => {
		const set = listenersRef.current.get(key);
		if (!set) return;
		for (const cb of Array.from(set)) {
			try { cb(); } catch {}
		}
	}, []);

	const setState = React.useCallback((key: string, value: unknown) => {
		setStateMap((prev) => ({ ...prev, [key]: value }));
		notify(key);
	}, [notify]);

	const resetState = React.useCallback((prefix?: string) => {
		if (!prefix) {
			setStateMap({});
			// notify all keys
			for (const key of listenersRef.current.keys()) notify(key);
			return;
		}
		setStateMap((prev) => {
			const next: UIState = {};
			for (const [k, v] of Object.entries(prev)) {
				if (!k.startsWith(prefix)) next[k] = v;
			}
			return next;
		});
		// notify keys under the prefix
		for (const key of listenersRef.current.keys()) {
			if (key.startsWith(prefix)) notify(key);
		}
	}, [notify]);

	const subscribe = React.useCallback((key: string, callback: () => void) => {
		let set = listenersRef.current.get(key);
		if (!set) {
			set = new Set();
			listenersRef.current.set(key, set);
		}
		set.add(callback);
		return () => {
			set?.delete(callback);
			if (set && set.size === 0) listenersRef.current.delete(key);
		};
	}, []);

	return (
		<UIStateContext.Provider value={{ state, setState, resetState, subscribe }}>
			{children}
		</UIStateContext.Provider>
	);
}

/**
 * Returns the current UI state context (state + APIs) from the nearest UIStateProvider.
 *
 * Throws if called outside of a UIStateProvider.
 *
 * @returns The UIStateContextType containing `state`, `setState`, `resetState`, and `subscribe`.
 * @throws Error if there is no surrounding UIStateProvider.
 */
export function useUIState() {
	const ctx = React.useContext(UIStateContext);
	if (!ctx) throw new Error("useUIState must be used within UIStateProvider");
	return ctx;
}

/**
 * Returns the UI state reset function from the current UIState provider.
 *
 * The returned function, when called with no arguments, clears all UI state.
 * When called with a `prefix` string, it removes all keys that start with that prefix.
 *
 * @returns A function `resetState(prefix?: string): void` that resets UI state as described.
 */
export function useResetUIState() {
	const { resetState } = useUIState();
	return resetState;
}

/**
 * Read and write a single typed UI state value by key.
 *
 * Returns a tuple [value, set] where `value` is the current value stored for `key`
 * (or `initialValue` when no value exists), and `set` updates the value in the
 * shared UI state store. If `key` is `undefined`, `value` will always be
 * `initialValue` and `set` is a no-op.
 *
 * @param key - The key identifying the value in the UI state store. Use `undefined`
 *   to opt out of shared storage and treat the hook as read-only with `initialValue`.
 * @param initialValue - Fallback value returned when no value exists for `key`.
 * @returns A tuple `[value, set]` where `value` is `T | undefined` and `set` updates the value.
 * @throws If called outside of a UIStateProvider.
 */
export function useUIValue<T = unknown>(key: string | undefined, initialValue?: T): [T | undefined, (value: T) => void] {
	const ctx = React.useContext(UIStateContext);
	if (!ctx) throw new Error("useUIValue must be used within UIStateProvider");

	const { state, setState, subscribe } = ctx;

	const getSnapshot = React.useCallback(() => {
		if (!key) return initialValue as T | undefined;
		return (state[key] as T | undefined) ?? (initialValue as T | undefined);
	}, [state, key, initialValue]);

	const getServerSnapshot = React.useCallback(() => initialValue as T | undefined, [initialValue]);

	const subscribeKey = React.useCallback((onStoreChange: () => void) => {
		if (!key) return () => {};
		return subscribe(key, onStoreChange);
	}, [subscribe, key]);

	const value = React.useSyncExternalStore(
		subscribeKey,
		getSnapshot as unknown as () => T | undefined,
		getServerSnapshot as unknown as () => T | undefined
	);

	const set = React.useCallback((v: T) => {
		if (!key) return;
		setState(key, v);
	}, [setState, key]);

	return [value, set];
}