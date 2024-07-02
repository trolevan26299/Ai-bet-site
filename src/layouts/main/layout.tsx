"use client";

type Props = {
  children: React.ReactNode;
};
export default function MainLayout({ children }: Props) {
  return (
    <div className="flex flex-col bg-backgroundColor-main h-full min-h-screen font-sans h-screen">
      <main className="flex-grow h-screen">{children}</main>
    </div>
  );
}
