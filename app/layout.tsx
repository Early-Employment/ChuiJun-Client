import type { Metadata } from "next";
import { DgOAuthProvider } from "@/shared/providers/oauth-provider";
import { QueryProvider } from "@/shared/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "취준",
  description: "한국 취준생을 위한 코딩 테스트 풀이 플랫폼",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>
        <DgOAuthProvider>
          <QueryProvider>{children}</QueryProvider>
        </DgOAuthProvider>
      </body>
    </html>
  );
}
