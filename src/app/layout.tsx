/* eslint-disable @next/next/inline-script-id */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { MotionLazy } from "@/components/animate/motion-lazy";
import { TelegramProvider } from "@/context/telegram.provider";
import Script from "next/script";
import { GOOGLE_ANALYTICS_ID } from "@/config-global";

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
        <TelegramProvider>
          <Theme>
            <MotionLazy>{children}</MotionLazy>
          </Theme>
        </TelegramProvider>

        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
    (function(a,b,c,d,e,f,g,h,i){
        a[e] = a[e] || function() {
            (a[e].q=a[e].q||[]).push(arguments);
        };
        a[e].l=1*new Date();
        a[e].o=f;
        g=b.createElement(c);
        h=b.getElementsByTagName(c)[0];
        g.async=1;
        g.src=d;
        g.setAttribute("n", e);
        h.parentNode.insertBefore(g, h);
    })(window, document, "script", "https://widgets.sir.sportradar.com/12423423423/widgetloader", "SIR", {
        theme: false, // using custom theme
        language: "vi"
    });
    SIR("addWidget", ".sr-widget-1", "match.avgGoalsPerPeriod", {matchId:49012283});
`,
          }}
        ></Script>
      </body>
    </html>
  );
}
