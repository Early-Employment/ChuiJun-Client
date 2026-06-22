"use client";

import { OAuthLoginButton } from "@themoment-team/datagsm-oauth-react";
import { DGIcon } from "@/shared/assets/DGIcon";

export function DgSigninButton() {
  return (
    <OAuthLoginButton className="bg-foreground text-foreground-inverse flex h-10 w-fit cursor-pointer items-center gap-4 rounded-md px-3 hover:opacity-90">
      <DGIcon className="shrink-0" />
      <span className="text-label font-medium">DataGSM으로 시작하기</span>
    </OAuthLoginButton>
  );
}
