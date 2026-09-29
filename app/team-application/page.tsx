"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TeamApplicationRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/operations-teams");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--squid-ink-deep)] text-slate-300">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#AD5CFF] border-t-transparent" />
        <p className="text-sm font-medium tracking-wide">Redirecting to Operations Teams application...</p>
      </div>
    </div>
  );
}
