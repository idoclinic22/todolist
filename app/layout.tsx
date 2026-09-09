import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "할 일 · AK 강의",
  description:
    "AK(응용근신경학) 강의 준비를 강좌별로 관리하는 투두 리스트. 입력한 내용은 브라우저에 자동 저장됩니다.",
  applicationName: "AK 강의 할 일",
  authors: [{ name: "nonst" }],
  openGraph: {
    title: "할 일 · AK 강의",
    description: "AK 강의 준비를 강좌별로 관리하는 투두 리스트",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
