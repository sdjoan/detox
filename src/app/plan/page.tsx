import Link from "next/link";
import { recipes } from "@/data/recipes";

const GITHUB_URL = "https://github.com/sdjoan/detox";

function sourceStats(source: "닥터라이블리" | "베르베르") {
  const list = recipes.filter((r) => r.source === source);
  const verified = list.filter((r) => !r.isPlaceholder).length;
  return { total: list.length, verified };
}

const features = [
  {
    icon: "🥗",
    title: "레시피 목록 · 상세",
    body: "닥터라이블리 · 베르베르 스무디를 출처별로 모아보고, 재료와 손질법을 한눈에 확인.",
  },
  {
    icon: "🧮",
    title: "1잔 · 1주일분 계산기",
    body: "재료 용량을 1잔 기준 또는 1주일분 기준으로 즉시 환산. 주당 잔 수도 직접 조정 가능.",
  },
  {
    icon: "📱",
    title: "반응형 UI",
    body: "모바일 우선으로 설계해 장 보러 가서도, 스무디 만들면서도 바로 확인 가능.",
  },
];

const roadmap = [
  "장보기 리스트 — 여러 레시피 재료를 한 번에 합산",
  "레시피 검색 · 필터 (재료, 목적별)",
  "즐겨찾기 · 나만의 레시피 저장",
  "영양정보 표기",
];

export default function PlanPage() {
  const livly = sourceStats("닥터라이블리");
  const berber = sourceStats("베르베르");

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-neutral-200 bg-gradient-to-b from-emerald-50 to-neutral-50">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
            기획서 · v0.1 MVP
          </span>
          <h1 className="mt-4 text-3xl font-bold text-neutral-900 sm:text-4xl">
            디톡스 스무디 웹앱
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-500">
            닥터라이블리 · 베르베르 디톡스 스무디 레시피를 한 곳에서 확인하고,
            1잔 또는 1주일분 기준으로 재료 용량을 자동 계산해주는 웹앱.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              레시피 보러가기 →
            </Link>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
            >
              GitHub에서 보기
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-16 px-6 py-16">
        {/* 핵심 기능 */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900">핵심 기능</h2>
          <p className="mt-1 text-sm text-neutral-500">MVP 범위</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-neutral-200 bg-white p-5"
              >
                <span className="text-2xl">{f.icon}</span>
                <h3 className="mt-3 text-sm font-semibold text-neutral-900">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm text-neutral-500">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 계산 로직 */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900">
            용량은 어떻게 계산되나요
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            출처별로 레시피 카드의 기본 단위가 달라서, 계산 방식을 두 가지로
            나눴어요.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                닥터라이블리
              </span>
              <p className="mt-3 text-sm text-neutral-600">
                재료 수량이 <strong>1회 배치(약 2L)</strong> 기준. 1주일분은
                그대로, <strong>1잔 = 배치 ÷ 주당 잔 수</strong>로 계산해요.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                베르베르
              </span>
              <p className="mt-3 text-sm text-neutral-600">
                재료 수량이 <strong>1잔</strong> 기준. 1잔은 그대로,{" "}
                <strong>1주일분 = 1잔 × 주당 잔 수</strong>로 계산해요.
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-neutral-400">
            주당 잔 수는 기본값 7잔(하루 1잔 기준)이며, 레시피 상세 화면에서
            직접 조정할 수 있어요.
          </p>
        </section>

        {/* 데이터 출처 현황 */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900">
            데이터 출처 현황
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-900">
                  닥터라이블리
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  검증 완료
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                레시피 카드 사진에서 재료·용량을 그대로 옮김
              </p>
              <p className="mt-3 text-2xl font-bold text-neutral-900">
                {livly.verified}
                <span className="text-sm font-normal text-neutral-400">
                  {" "}
                  / {livly.total}종
                </span>
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-900">
                  베르베르
                </span>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                  검증 필요
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                이미지 글자가 작아 일부 수치 오독 가능성 있음, 원본 대조 필요
              </p>
              <p className="mt-3 text-2xl font-bold text-neutral-900">
                {berber.verified}
                <span className="text-sm font-normal text-neutral-400">
                  {" "}
                  / {berber.total}종
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* 로드맵 */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900">다음 단계</h2>
          <p className="mt-1 text-sm text-neutral-500">MVP 범위 밖 · 로드맵</p>
          <ul className="mt-6 space-y-3">
            {roadmap.map((item, i) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-lg border border-dashed border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-600"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-semibold text-neutral-500">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 기술 스택 */}
        <section>
          <h2 className="text-xl font-bold text-neutral-900">기술 스택</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Next.js (App Router)", "TypeScript", "Tailwind CSS"].map(
              (tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
