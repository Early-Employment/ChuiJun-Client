import { Skeleton } from "@/shared/ui/skeleton";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 py-12">
      <h1 className="text-display font-bold">취준</h1>
      <p className="text-body text-text-secondary">
        한국 취준생을 위한 코딩 테스트 풀이 플랫폼 — 초기 세팅 완료
      </p>
      <Skeleton className="h-4 w-48" />
    </main>
  );
}
