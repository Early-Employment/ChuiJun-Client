"use client";

import { OAuthProvider } from "@themoment-team/datagsm-oauth-react";
import type { ReactNode } from "react";

export function DgOAuthProvider({ children }: { children: ReactNode }) {
  return (
    <OAuthProvider
      clientId={process.env.NEXT_PUBLIC_DATAGSM_CLIENT_ID!}
      redirectUri={process.env.NEXT_PUBLIC_DATAGSM_REDIRECT_URI!}
      authMode="PKCE"
    >
      {children}
    </OAuthProvider>
  );
}
