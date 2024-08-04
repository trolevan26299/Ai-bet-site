"use client";

type Props = {
  children: React.ReactNode;
};
export default function MainLayout({ children }: Props) {
  return (
    <div className="flex flex-col bg-[rgba(12,17,25,1)] h-full min-h-screen font-sans">
      <main className="flex-grow">{children}</main>
    </div>
  );
}
