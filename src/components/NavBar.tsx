"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "@/lib/appState";

const links = [
  { href: "/", label: "레시피" },
  { href: "/shopping-list", label: "장보기" },
  { href: "/plan", label: "기획서" },
];

export default function NavBar() {
  const pathname = usePathname();
  const { shoppingList } = useAppState();

  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-bold text-neutral-900">
          🥤 디톡스 스무디
        </Link>
        <nav className="flex gap-1">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-emerald-100 text-emerald-700"
                    : "text-neutral-500 hover:bg-neutral-100"
                }`}
              >
                {link.label}
                {link.href === "/shopping-list" && shoppingList.length > 0 && (
                  <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-semibold text-white">
                    {shoppingList.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
