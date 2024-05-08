/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { Image } from "cloudinary-react";
import { Icon } from "@iconify/react";
import { NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME } from "@/config-global";

const TeamLogo = ({ teamName, typeError }) => {
  const [imgError, setImgError] = useState(false);

  const handleError = () => {
    setImgError(true);
  };

  if (imgError && typeError === "home") {
    return <Icon icon="ion:shirt" style={{ color: "#1669d4" }} width={48} height={48} />;
  }
  if (imgError && typeError === "away") {
    return <Icon icon="ion:shirt" style={{ color: "#d9dd0e" }} width={48} height={48} />;
  }

  return (
    <Image
      alt="team home Logo"
      cloudName={NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
      publicId={`team_logo_aib/${teamName}`}
      width="48"
      height="48"
      onError={handleError}
    />
  );
};

export default TeamLogo;
