"use client";

import { useState } from "react";

export function ErrorPageTestButton() {
  const [shouldThrowError, setShouldThrowError] = useState(false);

  if (process.env.NODE_ENV !== "development") return null;
  if (shouldThrowError) throw new Error("error-page-test");

  return (
    <button
      type="button"
      onClick={() => setShouldThrowError(true)}
      className="bg-accent text-neutral-0 fixed right-4 bottom-4 z-50 rounded-md px-4 py-3 text-sm font-semibold shadow-[0_12px_30px_rgba(24,197,199,0.28)]"
    >
      에러 페이지 테스트
    </button>
  );
}
