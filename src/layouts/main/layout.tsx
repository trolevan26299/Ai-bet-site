"use client";

type Props = {
  children: React.ReactNode;
};
export default function MainLayout({ children }: Props) {
  return (
    <div className="flex flex-col bg-[#12202e] h-full min-h-screen font-sans">
      <main className="flex-grow">{children}</main>
    </div>
  );
}
