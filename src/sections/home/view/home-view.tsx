import OddsDetail from "@/components/odds-detail/odds-detail";
import MainLayout from "@/layouts/main/layout";
import { useScroll } from "framer-motion";

export default function HomeView() {
  return (
    <MainLayout>
      <OddsDetail />
    </MainLayout>
  );
}
