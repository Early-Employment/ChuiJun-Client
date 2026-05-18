import type { Metadata } from "next";
import { QueryProvider } from "@/shared/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "취준",
  description: "한국 취준생을 위한 코딩 테스트 풀이 플랫폼",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
