import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { MotionLazy } from "@/components/animate/motion-lazy";
import { TelegramProvider } from "@/context/telegram.provider";
import { Drawer } from "@/components/ui/drawer";

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
    <html
      lang="en"
      style={{
        minHeight: "calc(100% + 45px)",
      }}
    >
      <body className={inter.className}>
        <Drawer>
          <TelegramProvider>
            <Theme>
              <MotionLazy>{children}</MotionLazy>
            </Theme>
          </TelegramProvider>
        </Drawer>
      </body>
    </html>
  );
}
