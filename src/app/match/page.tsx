"use client";

import { useTelegram } from "@/context/telegram.provider";
import { MatchView } from "@/sections/odds";
import { useEffect } from "react";

// export const metadata = {
//   title: "Home",
// };
export default function Home() {
  // const telegram = useTelegram();
  // useEffect(() => {
  //   if (telegram.webApp) {
  //     telegram.webApp.headerColor = "rgba(18,32,46,1)";
  //   }
  // }, []);
  return <MatchView />;
}
