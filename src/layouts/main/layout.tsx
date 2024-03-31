"use client";

import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};
export default function MainLayout({ children }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col  bg-slate-800 h-full min-h-screen">
      <main className="flex-grow p-2">{children}</main>
    </div>
  );
}
