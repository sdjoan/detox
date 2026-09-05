"use client";

import Link from "next/link";
import { Recipe } from "@/types/recipe";
import { useAppState } from "@/lib/appState";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { isFavorite, toggleFavorite, isInShoppingList, addToShoppingList, removeFromShoppingList } =
    useAppState();

  const favorite = isFavorite(recipe.slug);
  const inList = isInShoppingList(recipe.slug);

  return (
    <div className="relative block rounded-xl border border-neutral-200 p-5 transition-shadow hover:shadow-md">
      <button
        type="button"
        aria-label={favorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(recipe.slug);
        }}
        className="absolute right-4 top-4 text-lg"
      >
        {favorite ? "❤️" : "🤍"}
      </button>

      <Link href={`/recipes/${recipe.slug}`} className="block pr-8">
        <div className="flex items-center gap-2">
          <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            {recipe.source}
          </span>
          {recipe.isPlaceholder && (
            <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              검증 필요
            </span>
          )}
        </div>
        <h3 className="mt-3 text-lg font-semibold text-neutral-900">
          {recipe.name}
        </h3>
        <p className="mt-1 text-sm text-neutral-500">{recipe.description}</p>
        <p className="mt-3 text-sm font-medium text-emerald-700">
          재료 {recipe.ingredients.length}가지 보기 →
        </p>
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          if (inList) {
            removeFromShoppingList(recipe.slug);
          } else {
            addToShoppingList({
              slug: recipe.slug,
              mode: "week",
              cupsPerWeek: recipe.cupsPerWeek,
            });
          }
        }}
        className={`mt-4 w-full rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
          inList
            ? "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
            : "border-neutral-300 text-neutral-600 hover:bg-neutral-100"
        }`}
      >
        {inList ? "🛒 장보기 목록에 담김" : "🛒 장보기 목록에 담기"}
      </button>
    </div>
  );
}
