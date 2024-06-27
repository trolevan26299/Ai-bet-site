import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { MotionLazy } from "@/components/animate/motion-lazy";
import { TelegramProvider } from "@/context/telegram.provider";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIBE - AI Betting Engine",
  description: "AIBE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <GoogleAnalytics gaId="G-HCDLGP91K6" />
      <body className={inter.className}>
        <TelegramProvider>
          <Theme>
            <MotionLazy>{children}</MotionLazy>
          </Theme>
        </TelegramProvider>
      </body>
    </html>
  );
}
