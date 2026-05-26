import { useSyncExternalStore } from 'react';
import type { Accessory } from '@/types/accessory';
import type { CartItem } from '@/types/cart';

const STORAGE_KEY = 'shoppingCart';

function readFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

let items: CartItem[] = readFromStorage();
const listeners = new Set<() => void>();

function emit() {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return items;
}

function add(accessory: Accessory) {
  const existing = items.find((item) => item.accessory.id === accessory.id);
  if (existing) {
    items = items.map((item) =>
      item.accessory.id === accessory.id
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    );
  } else {
    items = [...items, { accessory, quantity: 1 }];
  }
  emit();
}

function remove(id: string) {
  items = items.filter((item) => item.accessory.id !== id);
  emit();
}

function clear() {
  items = [];
  emit();
}

export function useShoppingCart() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { items: snapshot, add, remove, clear };
}
