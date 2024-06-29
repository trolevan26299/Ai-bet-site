import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { MotionLazy } from "@/components/animate/motion-lazy";
import { TelegramProvider } from "@/context/telegram.provider";
import Script from "next/script";

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
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-CV4B26T521" strategy="afterInteractive" async></Script>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-RJB4BGPJKW');
        `}
      </Script>
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
