import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Thai_Looped, Geist_Mono } from "next/font/google";
import "./globals.css";

const plexThai = IBM_Plex_Sans_Thai_Looped({
  variable: "--font-plex-thai",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "แบบประเมิน LOs รายวิชาสหกิจศึกษา | COOP69",
  description:
    "ระบบสำหรับเรียกดูแบบประเมินผลลัพธ์การเรียนรู้ที่คาดหวัง (LOs) ของรายวิชาสหกิจศึกษา จัดกลุ่มตามสำนักวิชาและหลักสูตร",
};

// Viewport with cover mode so env(safe-area-inset-*) values are available
// for the sticky wizard footer and other edge-aware padding on mobile.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      data-theme="light"
      className={`${plexThai.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-page text-primary">
        <a href="#main-content" className="fixed left-4 top-4 z-[1000] -translate-y-24 rounded-lg bg-action px-4 py-2 text-sm font-medium text-inverse transition-transform focus-visible:translate-y-0">
          ข้ามไปยังเนื้อหาหลัก
        </a>
        {children}
      </body>
    </html>
  );
}
