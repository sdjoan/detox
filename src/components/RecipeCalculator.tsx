"use client";

import { useMemo, useState } from "react";
import { Recipe } from "@/types/recipe";
import {
  ServingMode,
  formatAmount,
  getMultiplier,
  scaleIngredients,
} from "@/lib/scale";

export default function RecipeCalculator({ recipe }: { recipe: Recipe }) {
  const nativeMode: ServingMode = recipe.baseUnit === "cup" ? "cup" : "week";
  const [mode, setMode] = useState<ServingMode>(nativeMode);
  const [cupsPerWeek, setCupsPerWeek] = useState(recipe.cupsPerWeek);

  // 원래 단위와 같은 모드를 보고 있을 땐 배수가 항상 1이라 "주당 잔 수"를
  // 바꿔도 표에 반영되지 않는다 — 이럴 땐 입력을 비활성화해서 헷갈리지 않게 한다.
  const cupsPerWeekActive = mode !== nativeMode;

  const multiplier = getMultiplier(mode, { ...recipe, cupsPerWeek });
  const scaled = useMemo(
    () => scaleIngredients(recipe.ingredients, multiplier),
    [recipe.ingredients, multiplier]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-neutral-300 p-1">
          <button
            type="button"
            onClick={() => setMode("cup")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "cup"
                ? "bg-emerald-600 text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            1잔
          </button>
          <button
            type="button"
            onClick={() => setMode("week")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === "week"
                ? "bg-emerald-600 text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            1주일분{recipe.batchVolume ? ` (${recipe.batchVolume})` : ""}
          </button>
        </div>

        <label
          className={`flex items-center gap-2 text-sm ${
            cupsPerWeekActive ? "text-neutral-600" : "text-neutral-300"
          }`}
        >
          주당
          <input
            type="number"
            min={1}
            max={28}
            value={cupsPerWeek}
            disabled={!cupsPerWeekActive}
            onChange={(e) =>
              setCupsPerWeek(
                Math.min(28, Math.max(1, Number(e.target.value) || 1))
              )
            }
            className={`w-16 rounded-md border px-2 py-1 text-center ${
              cupsPerWeekActive
                ? "border-neutral-300"
                : "cursor-not-allowed border-neutral-200 bg-neutral-50 text-neutral-300"
            }`}
          />
          잔 마신다면
        </label>
      </div>

      <p className="text-xs text-neutral-400">
        {cupsPerWeekActive ? (
          recipe.baseUnit === "batch" ? (
            `※ 카드에 잔 수가 표기되어 있지 않아 하루 1잔 기준 기본값(${recipe.cupsPerWeek}잔)을 가정했어요. 실제 마시는 잔 수에 맞게 조정하세요.`
          ) : (
            `※ 1주일분은 위 잔 수 기준(기본 ${recipe.cupsPerWeek}잔)으로 이 레시피를 여러 번 만든 양이에요.`
          )
        ) : recipe.baseUnit === "batch" ? (
          "※ 지금 보는 1주일분은 카드에 적힌 배치 그대로예요. 위 숫자는 \"1잔\" 보기로 바꿀 때만 쓰여요."
        ) : (
          "※ 지금 보는 1잔은 카드에 적힌 분량 그대로예요. 위 숫자는 \"1주일분\" 보기로 바꿀 때만 쓰여요."
        )}
      </p>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500">
            <th className="py-2 font-medium">재료</th>
            <th className="py-2 text-right font-medium">용량</th>
            <th className="py-2 pl-4 text-left font-medium">비고</th>
          </tr>
        </thead>
        <tbody>
          {scaled.map((ing) => (
            <tr key={ing.name} className="border-b border-neutral-100">
              <td className="py-2 text-neutral-800">{ing.name}</td>
              <td className="whitespace-nowrap py-2 text-right text-neutral-800">
                {formatAmount(ing.amount)} {ing.unit}
              </td>
              <td className="py-2 pl-4 text-neutral-400">{ing.note ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {recipe.note && !recipe.isPlaceholder && (
        <p className="rounded-lg bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
          {recipe.note}
        </p>
      )}
    </div>
  );
}
