import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AK 강의 할 일",
  description: "AK(응용근신경학) 강의 준비를 강좌별로 관리하는 투두 리스트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
