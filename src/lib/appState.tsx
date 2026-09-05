"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ServingMode } from "@/lib/scale";

const FAVORITES_KEY = "detox-favorites";
const SHOPPING_LIST_KEY = "detox-shopping-list";

export interface ShoppingListItem {
  slug: string;
  mode: ServingMode;
  cupsPerWeek: number;
}

interface AppState {
  favorites: string[];
  isFavorite: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;

  shoppingList: ShoppingListItem[];
  isInShoppingList: (slug: string) => boolean;
  addToShoppingList: (item: ShoppingListItem) => void;
  removeFromShoppingList: (slug: string) => void;
  updateShoppingListItem: (
    slug: string,
    patch: Partial<Pick<ShoppingListItem, "mode" | "cupsPerWeek">>
  ) => void;
  clearShoppingList: () => void;
}

const AppStateContext = createContext<AppState | null>(null);

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // localStorage는 서버에 없으므로 마운트 후에만 읽어서 하이드레이션 불일치를 피한다.
  useEffect(() => {
    setFavorites(readJSON(FAVORITES_KEY, [] as string[]));
    setShoppingList(readJSON(SHOPPING_LIST_KEY, [] as ShoppingListItem[]));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      SHOPPING_LIST_KEY,
      JSON.stringify(shoppingList)
    );
  }, [shoppingList, hydrated]);

  const isFavorite = useCallback(
    (slug: string) => favorites.includes(slug),
    [favorites]
  );

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const isInShoppingList = useCallback(
    (slug: string) => shoppingList.some((item) => item.slug === slug),
    [shoppingList]
  );

  const addToShoppingList = useCallback((item: ShoppingListItem) => {
    setShoppingList((prev) =>
      prev.some((i) => i.slug === item.slug) ? prev : [...prev, item]
    );
  }, []);

  const removeFromShoppingList = useCallback((slug: string) => {
    setShoppingList((prev) => prev.filter((item) => item.slug !== slug));
  }, []);

  const updateShoppingListItem = useCallback(
    (
      slug: string,
      patch: Partial<Pick<ShoppingListItem, "mode" | "cupsPerWeek">>
    ) => {
      setShoppingList((prev) =>
        prev.map((item) => (item.slug === slug ? { ...item, ...patch } : item))
      );
    },
    []
  );

  const clearShoppingList = useCallback(() => setShoppingList([]), []);

  return (
    <AppStateContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        shoppingList,
        isInShoppingList,
        addToShoppingList,
        removeFromShoppingList,
        updateShoppingListItem,
        clearShoppingList,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return ctx;
}
