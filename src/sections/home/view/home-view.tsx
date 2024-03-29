import OddsDetail from "@/components/odds-detail/odds-detail";
import ScreenInfoMatch from "@/components/screen-info-match/screen-info-match";
import MainLayout from "@/layouts/main/layout";
import { useScroll } from "framer-motion";

export default function HomeView() {
  return (
    <MainLayout>
      <ScreenInfoMatch />
      <OddsDetail />
    </MainLayout>
  );
}
