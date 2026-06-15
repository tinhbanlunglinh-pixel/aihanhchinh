import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Văn Bản 30 - Soạn thảo văn bản hành chính chuẩn Nghị định 30",
  description: "Trình tạo văn bản hành chính bằng AI chuẩn Nghị định 30/2020/NĐ-CP và Hướng dẫn 36-HD/VPTW của Văn phòng Trung ương Đảng.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
