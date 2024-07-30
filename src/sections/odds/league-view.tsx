import React from "react";
import { useRouter } from "next/navigation";

const LeagueView = () => {
  const router = useRouter();
  return (
    <div>
      <button onClick={() => router.push("/match/2132132131313")}>Đến màn hình chi tiết</button>
    </div>
  );
};

export default LeagueView;
