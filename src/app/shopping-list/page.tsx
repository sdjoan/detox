"use client";

import Link from "next/link";
import { useAppState } from "@/lib/appState";
import { getRecipeBySlug } from "@/data/recipes";
import {
  aggregateIngredients,
  formatAmount,
  ServingMode,
} from "@/lib/scale";

export default function ShoppingListPage() {
  const {
    shoppingList,
    removeFromShoppingList,
    updateShoppingListItem,
    clearShoppingList,
  } = useAppState();

  const entries = shoppingList
    .map((item) => {
      const recipe = getRecipeBySlug(item.slug);
      return recipe ? { ...item, recipe } : null;
    })
    .filter((e): e is NonNullable<typeof e> => e !== null);

  const aggregated = aggregateIngredients(
    entries.map(({ recipe, mode, cupsPerWeek }) => ({
      recipe,
      mode,
      cupsPerWeek,
    }))
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm font-medium text-emerald-700 hover:underline">
        ← 목록으로
      </Link>

      <header className="mt-4 mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">🛒 장보기 목록</h1>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={clearShoppingList}
            className="text-sm text-neutral-400 hover:text-neutral-600"
          >
            전체 비우기
          </button>
        )}
      </header>

      {entries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-10 text-center text-neutral-500">
          아직 담긴 레시피가 없어요. 레시피 카드의 &quot;🛒 장보기 목록에
          담기&quot; 버튼을 눌러보세요.
        </p>
      ) : (
        <>
          <section className="space-y-3">
            {entries.map(({ recipe, mode, cupsPerWeek }) => (
              <div
                key={recipe.slug}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/recipes/${recipe.slug}`}
                    className="font-medium text-neutral-900 hover:underline"
                  >
                    {recipe.name}
                  </Link>
                  <p className="text-xs text-neutral-400">{recipe.source}</p>
                </div>

                <div className="inline-flex rounded-lg border border-neutral-300 p-1">
                  {(["cup", "week"] as ServingMode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() =>
                        updateShoppingListItem(recipe.slug, { mode: m })
                      }
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        mode === m
                          ? "bg-emerald-600 text-white"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      {m === "cup" ? "1잔" : "1주일분"}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-1.5 text-xs text-neutral-500">
                  주당
                  <input
                    type="number"
                    min={1}
                    max={28}
                    value={cupsPerWeek}
                    onChange={(e) =>
                      updateShoppingListItem(recipe.slug, {
                        cupsPerWeek: Math.min(
                          28,
                          Math.max(1, Number(e.target.value) || 1)
                        ),
                      })
                    }
                    className="w-14 rounded-md border border-neutral-300 px-1.5 py-1 text-center"
                  />
                  잔
                </label>

                <button
                  type="button"
                  onClick={() => removeFromShoppingList(recipe.slug)}
                  aria-label="목록에서 제거"
                  className="ml-auto text-neutral-400 hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </section>

          <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-bold text-neutral-900">
              합산 재료 목록
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              선택한 레시피 {entries.length}개의 재료를 이름·단위 기준으로
              합쳤어요.
            </p>
            <table className="mt-4 w-full border-collapse text-sm">
              <tbody>
                {aggregated.map((ing) => (
                  <tr
                    key={`${ing.name}-${ing.unit}`}
                    className="border-b border-neutral-100"
                  >
                    <td className="py-2 text-neutral-800">{ing.name}</td>
                    <td className="py-2 text-right text-neutral-800">
                      {formatAmount(ing.amount)} {ing.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </main>
  );
}
