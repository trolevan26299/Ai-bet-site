"use client";

import { useTelegram } from "@/context/telegram.provider";
import { HistoryView } from "@/sections/history/view";
import { useEffect } from "react";

// export const metadata = {
//   title: "Home",
// };
export default function History() {
  return <HistoryView />;
}
