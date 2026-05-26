"use client";

import { OAuthLoginButton } from "@themoment-team/datagsm-oauth-react";
import { DGIcon } from "@/shared/assets/DGIcon";

export function DgSigninButton() {
  return (
    <OAuthLoginButton className="flex h-10 w-full cursor-pointer items-center gap-4 rounded-md bg-black px-3 text-white transition-colors duration-150 hover:bg-neutral-800">
      <DGIcon className="shrink-0" />
      <span className="text-label font-medium">DataGSM으로 시작하기</span>
    </OAuthLoginButton>
  );
}
