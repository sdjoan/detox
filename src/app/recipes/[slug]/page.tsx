import Link from "next/link";
import { notFound } from "next/navigation";
import RecipeCalculator from "@/components/RecipeCalculator";
import ShareButton from "@/components/ShareButton";
import { getRecipeBySlug, recipes } from "@/data/recipes";

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/"
        className="text-sm font-medium text-emerald-700 hover:underline"
      >
        ← 목록으로
      </Link>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            {recipe.source}
          </span>
          <ShareButton title={recipe.name} text={recipe.description} />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-neutral-900">
          {recipe.name}
        </h1>
        <p className="mt-2 text-neutral-500">{recipe.description}</p>

        {recipe.isPlaceholder && (
          <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            ⚠️ {recipe.note ?? "아직 검증되지 않은 값이 표시되고 있습니다."}
          </p>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6">
        <RecipeCalculator recipe={recipe} />
      </div>
    </main>
  );
}
