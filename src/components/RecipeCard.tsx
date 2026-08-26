import Link from "next/link";
import { Recipe } from "@/types/recipe";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="block rounded-xl border border-neutral-200 p-5 transition-shadow hover:shadow-md"
    >
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
  );
}
