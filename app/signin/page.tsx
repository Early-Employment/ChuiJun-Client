import { DgSigninButton } from "@/shared/ui/dg-signin-button";

export default function SigninPage() {
  return (
    <main className="bg-canvas flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-display text-foreground font-bold">취준</h1>
          <p className="text-body text-muted">한국 취준생을 위한 코딩 테스트 풀이 플랫폼</p>
        </div>
        <DgSigninButton />
      </div>
    </main>
  );
}
