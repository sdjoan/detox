import { Ingredient, Recipe } from "@/types/recipe";

export type ServingMode = "cup" | "week";

// 소수점 정리: 정수면 그대로, 아니면 소수점 1자리까지
export function formatAmount(amount: number): string {
  const rounded = Math.round(amount * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function scaleIngredients(
  ingredients: Ingredient[],
  multiplier: number
): Ingredient[] {
  return ingredients.map((ing) => ({
    ...ing,
    amount: ing.amount * multiplier,
  }));
}

// 재료 수량은 recipe.baseUnit 기준으로 저장되어 있음.
// baseUnit "cup"(1잔 기준): cup 모드 배수 1, week 모드는 cupsPerWeek배
// baseUnit "batch"(1주일분 배치 기준): week 모드 배수 1, cup 모드는 1/cupsPerWeek배
export function getMultiplier(
  mode: ServingMode,
  recipe: Pick<Recipe, "baseUnit" | "cupsPerWeek">
): number {
  if (recipe.baseUnit === "cup") {
    return mode === "cup" ? 1 : recipe.cupsPerWeek;
  }
  return mode === "cup" ? 1 / recipe.cupsPerWeek : 1;
}

export interface AggregatedIngredient {
  name: string;
  unit: string;
  amount: number;
}

// "잎채소(로메인 등)"과 "잎채소(케일 등)"처럼 괄호 안 비고만 다른 같은 재료를
// 합산할 수 있도록 괄호 부분을 제거한 이름으로 정규화한다.
function normalizeIngredientName(name: string): string {
  return name.replace(/\([^)]*\)/g, "").trim() || name;
}

// 여러 레시피의 재료를 이름+단위 기준으로 합산한다 (장보기 리스트용).
export function aggregateIngredients(
  entries: { recipe: Recipe; mode: ServingMode; cupsPerWeek: number }[]
): AggregatedIngredient[] {
  const totals = new Map<string, AggregatedIngredient>();

  for (const { recipe, mode, cupsPerWeek } of entries) {
    const multiplier = getMultiplier(mode, { ...recipe, cupsPerWeek });
    for (const ing of scaleIngredients(recipe.ingredients, multiplier)) {
      const normalizedName = normalizeIngredientName(ing.name);
      const key = `${normalizedName}__${ing.unit}`;
      const existing = totals.get(key);
      if (existing) {
        existing.amount += ing.amount;
      } else {
        totals.set(key, {
          name: normalizedName,
          unit: ing.unit,
          amount: ing.amount,
        });
      }
    }
  }

  return Array.from(totals.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "ko")
  );
}
