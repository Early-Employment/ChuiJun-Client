import type { Metadata } from "next";
import { Black_Han_Sans } from "next/font/google";
import { QueryProvider } from "@/shared/providers/query-provider";
import "./globals.css";

const blackHanSans = Black_Han_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-black-han-sans",
});

export const metadata: Metadata = {
  title: "취준",
  description: "한국 취준생을 위한 코딩 테스트 풀이 플랫폼",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={blackHanSans.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
