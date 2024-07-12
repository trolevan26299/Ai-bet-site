/* eslint-disable @next/next/next-script-for-ga */
import { MotionLazy } from "@/components/animate/motion-lazy";
import { GOOGLE_ANALYTICS_ID, GOOGLE_TAG_MANAGER_ID } from "@/config-global";
import { TelegramProvider } from "@/context/telegram.provider";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import "@telegram-apps/telegram-ui/dist/styles.css";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GOOGLE_TAG_MANAGER_ID}');`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
        strategy="afterInteractive"
        async
      ></Script>
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ANALYTICS_ID}');
        `}
      </Script>
      <body className={inter.className}>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GOOGLE_TAG_MANAGER_ID}" height="0" width="0" style="display: none; visibility: hidden;" />`,
          }}
        />
        <TelegramProvider>
          <Theme>
            <MotionLazy>{children}</MotionLazy>
          </Theme>
        </TelegramProvider>
      </body>
    </html>
  );
}
