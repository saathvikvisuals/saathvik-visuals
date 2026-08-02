"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackToStudioLink() {
  const router = useRouter();
  const pathname = usePathname();

  function handleClick() {
    if (pathname === "/") return;
    sessionStorage.setItem("sv-entrance-seen", "true");
    router.push("/");
  }

  return (
    <button
      className="inline-flex items-center gap-2 rounded-full border hairline bg-[var(--card)] px-4 py-2 text-sm font-black text-[var(--ink)]"
      onClick={handleClick}
      type="button"
    >
      <ArrowLeft size={16} />
      Back to studio
    </button>
  );
}
