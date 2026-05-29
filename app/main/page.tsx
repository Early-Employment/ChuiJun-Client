import { Skeleton } from "@/shared/ui/skeleton";

export default function MainPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl flex-col items-center justify-center gap-6 px-6 py-12">
      <h1 className="text-display font-bold">메인</h1>
      <p className="text-body text-muted">공통 헤더가 적용되는 메인 페이지입니다.</p>
      <Skeleton className="h-4 w-48" />
    </main>
  );
}
