"use client";

import { OAuthProvider } from "@themoment-team/datagsm-oauth-react";
import type { ReactNode } from "react";

export function DgOAuthProvider({ children }: { children: ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_DATAGSM_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_DATAGSM_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error("Datagsm OAuth 환경 변수가 설정되지 않았습니다.");
  }

  return (
    <OAuthProvider
      clientId={clientId}
      redirectUri={redirectUri}
      authMode="PKCE"
    >
      {children}
    </OAuthProvider>
  );
}
