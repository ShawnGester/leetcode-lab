import type { Metadata } from "next";
import { IBM_Plex_Mono, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const soraHeading = Sora({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "LeetCode Lab — Offline Practice",
  description:
    "Practice selected LeetCode problems offline with a browser code editor, custom tests, and solution reviews.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${soraHeading.variable} ${plexMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
