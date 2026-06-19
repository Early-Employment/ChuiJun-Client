"use client";

import Link from "next/link";
import { LogoIcon } from "@/shared/assets/LogoIcon";

type FullPageErrorScreenProps = {
  description: string;
  resetLabel: string;
  title: string;
  onReset?: () => void;
};

export function FullPageErrorScreen({
  description,
  resetLabel,
  title,
  onReset,
}: FullPageErrorScreenProps) {
  return (
    <main className="from-primary-50 via-surface to-primary-100 relative min-h-screen overflow-hidden bg-linear-to-b">
      <div
        className="bg-primary-200/70 absolute top-[-120px] left-1/2 size-[320px] -translate-x-1/2 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="bg-primary-300/60 absolute right-[-80px] bottom-[-40px] size-[220px] rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1320px] items-center px-4 py-12 sm:px-6 xl:px-8">
        <section className="border-line bg-surface/90 mx-auto grid w-full max-w-[1040px] gap-10 rounded-[32px] border px-6 py-8 shadow-[0_24px_80px_rgba(24,197,199,0.14)] backdrop-blur md:px-10 md:py-10 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)] lg:items-center lg:px-12">
          <div className="relative flex justify-center lg:justify-start">
            <div className="bg-primary-100 border-primary-200 relative flex size-[260px] items-center justify-center rounded-full border md:size-[320px]">
              <div
                className="bg-primary-300/80 absolute inset-[18px] rounded-full blur-2xl"
                aria-hidden="true"
              />
              <div className="bg-surface relative flex size-[210px] items-center justify-center rounded-full shadow-[0_16px_40px_rgba(24,197,199,0.16)] md:size-[256px]">
                <LogoIcon className="h-auto w-[150px] md:w-[180px]" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <p className="text-accent-strong text-label font-semibold">Something went wrong</p>
            <h1 className="text-foreground mt-3 text-[36px] leading-tight font-extrabold md:text-[44px]">
              {title}
            </h1>
            <p className="text-muted mt-4 max-w-[34rem] text-base leading-7 font-medium md:text-lg">
              {description}
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={onReset}
                className="bg-accent text-neutral-0 rounded-md px-5 py-3 text-base font-semibold"
              >
                {resetLabel}
              </button>
              <Link
                href="/"
                className="border-line-strong text-foreground bg-surface rounded-md border px-5 py-3 text-center text-base font-semibold"
              >
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
