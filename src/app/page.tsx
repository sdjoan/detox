import RecipeCard from "@/components/RecipeCard";
import { recipes } from "@/data/recipes";

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-neutral-900">
          디톡스 스무디
        </h1>
        <p className="mt-2 text-neutral-500">
          닥터라이블리 · 베르베르 레시피를 재료/용량과 함께 확인하고, 1잔 또는
          1주일분 용량을 바로 계산해보세요.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} />
        ))}
      </div>
    </main>
  );
}
