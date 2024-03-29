"use client";

import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};
export default function MainLayout({ children }: Props) {
  const pathname = usePathname();

  const isHome = pathname === "/";
  return (
    <div className="flex flex-col h-screen bg-slate-800 h-full min-h-screen">
      <main className={`flex-grow ${!isHome ? "pt-8 md:pt-10" : "p-2"}`}>{children}</main>
    </div>
  );
}
