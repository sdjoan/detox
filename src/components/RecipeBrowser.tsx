"use client";

import { useMemo, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import { useAppState } from "@/lib/appState";
import { Recipe, RecipeSource } from "@/types/recipe";

type SourceFilter = "전체" | RecipeSource;

const SOURCE_FILTERS: SourceFilter[] = ["전체", "닥터라이블리", "베르베르"];

export default function RecipeBrowser({ recipes }: { recipes: Recipe[] }) {
  const { isFavorite } = useAppState();
  const [query, setQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("전체");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      if (sourceFilter !== "전체" && recipe.source !== sourceFilter) {
        return false;
      }
      if (favoritesOnly && !isFavorite(recipe.slug)) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        recipe.name,
        recipe.description,
        ...recipe.ingredients.map((ing) => ing.name),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [recipes, query, sourceFilter, favoritesOnly, isFavorite]);

  return (
    <div>
      <div className="mb-6 space-y-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="레시피 이름이나 재료로 검색 (예: 아보카도)"
          className="w-full rounded-lg border border-neutral-300 px-4 py-2 text-sm"
        />

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border border-neutral-300 p-1">
            {SOURCE_FILTERS.map((source) => (
              <button
                key={source}
                type="button"
                onClick={() => setSourceFilter(source)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  sourceFilter === source
                    ? "bg-emerald-600 text-white"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {source}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setFavoritesOnly((prev) => !prev)}
            className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
              favoritesOnly
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : "border-neutral-300 text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {favoritesOnly ? "❤️ 즐겨찾기만 보는 중" : "🤍 즐겨찾기만 보기"}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-10 text-center text-neutral-500">
          조건에 맞는 레시피가 없어요.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}
