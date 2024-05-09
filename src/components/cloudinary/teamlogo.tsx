/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { Icon } from "@iconify/react";

const TeamLogo = (teamName: string, typeError: string) => {
  const [imgError, setImgError] = useState(false);

  const cld = new Cloudinary({
    cloud: {
      cloudName: "dpibv0xwr",
    },
  });

  const myImage = cld.image("team_logo_aib");

  const handleError = () => {
    setImgError(true);
  };

  const formatTeamName = teamName.replace(/\s+/g, "_");

  if (imgError && typeError === "home") {
    return <Icon icon="ion:shirt" style={{ color: "#1669d4" }} width={48} height={48} />;
  }
  if (imgError && typeError === "away") {
    return <Icon icon="ion:shirt" style={{ color: "#d9dd0e" }} width={48} height={48} />;
  }

  return (
    <AdvancedImage
      alt="team home Logo"
      cldImg={myImage}
      publicId={formatTeamName}
      width="48"
      height="48"
      onError={handleError}
    />
  );
};

export default TeamLogo;
