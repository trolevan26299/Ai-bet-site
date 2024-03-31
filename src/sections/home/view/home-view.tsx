import OddsDetail from "@/components/app/odds-detail/odds-detail";
import ScreenInfoMatch from "@/components/app/screen-info-match/screen-info-match";
import MainLayout from "@/layouts/main/layout";

export default function HomeView() {
  return (
    <MainLayout>
      <ScreenInfoMatch />
      <OddsDetail />
    </MainLayout>
  );
}
