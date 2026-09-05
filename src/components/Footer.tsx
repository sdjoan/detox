import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 py-6">
      <div className="mx-auto max-w-3xl px-6 text-center text-xs text-neutral-400">
        <Link href="/plan" className="hover:text-neutral-600 hover:underline">
          이 프로젝트의 기획서 보기
        </Link>
      </div>
    </footer>
  );
}
