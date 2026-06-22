import { LogoIcon } from "@/shared/assets/LogoIcon";
import { DgSigninButton } from "@/shared/ui/dg-signin-button";

export default function SigninPage() {
  return (
    <main className="bg-canvas flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <LogoIcon className="text-accent size-20" />
          <div className="space-y-2 text-center">
            <h1 className="text-display text-foreground font-bold">취준</h1>
            <p className="text-body text-muted">GSM을 위한 코딩 테스트 플랫폼</p>
          </div>
        </div>
        <DgSigninButton />
      </div>
    </main>
  );
}
