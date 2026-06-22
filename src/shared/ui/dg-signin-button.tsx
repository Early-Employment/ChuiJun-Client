"use client";

import { OAuthLoginButton } from "@themoment-team/datagsm-oauth-react";
import { DGIcon } from "@/shared/assets/DGIcon";

export function DgSigninButton() {
  return (
    <OAuthLoginButton className="flex h-10 w-fit cursor-pointer items-center gap-4 rounded-md bg-foreground px-3 text-foreground-inverse hover:opacity-90">
      <DGIcon className="shrink-0" />
      <span className="text-label font-medium">DataGSM으로 시작하기</span>
    </OAuthLoginButton>
  );
}
