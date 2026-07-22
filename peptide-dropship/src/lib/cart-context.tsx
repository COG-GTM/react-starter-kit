"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import type { CartLine } from "./types";

const STORAGE_KEY = "peptide-cart-v1";

interface Snapshot {
  lines: CartLine[];
  ready: boolean;
}

// Module-level external store. Using useSyncExternalStore keeps cart state
// SSR-safe (server renders an empty cart) and hydrates from localStorage on
// the client without setting state inside a component effect.
let lines: CartLine[] = [];
let ready = false;
let snapshot: Snapshot = { lines, ready };
const serverSnapshot: Snapshot = { lines: [], ready: false };
const listeners = new Set<() => void>();

function refresh() {
  snapshot = { lines, ready };
  listeners.forEach((l) => l());
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // ignore write failures (e.g. storage disabled)
  }
}

function hydrate() {
  if (ready) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) lines = JSON.parse(raw) as CartLine[];
  } catch {
    lines = [];
  }
  ready = true;
  refresh();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  hydrate();
  return () => {
    listeners.delete(callback);
  };
}

function setLines(next: CartLine[]) {
  lines = next;
  persist();
  refresh();
}

function addItem(productId: string, quantity = 1) {
  const existing = lines.find((l) => l.productId === productId);
  if (existing) {
    setLines(
      lines.map((l) =>
        l.productId === productId
          ? { ...l, quantity: l.quantity + quantity }
          : l,
      ),
    );
  } else {
    setLines([...lines, { productId, quantity }]);
  }
}

function removeItem(productId: string) {
  setLines(lines.filter((l) => l.productId !== productId));
}

function setQuantity(productId: string, quantity: number) {
  setLines(
    quantity <= 0
      ? lines.filter((l) => l.productId !== productId)
      : lines.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
  );
}

function clear() {
  setLines([]);
}

interface CartValue extends Snapshot {
  count: number;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

// Kept as a passthrough so the root layout can wrap the app without changes.
export function CartProvider({ children }: { children: ReactNode }) {
  return children;
}

export function useCart(): CartValue {
  const snap = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => serverSnapshot,
  );
  return {
    lines: snap.lines,
    ready: snap.ready,
    count: snap.lines.reduce((sum, l) => sum + l.quantity, 0),
    addItem,
    removeItem,
    setQuantity,
    clear,
  };
}
