/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { Icon } from "@iconify/react";

const TeamLogo = ({ teamName, typeError }: { teamName: string; typeError: string }) => {
  const [imgError, setImgError] = useState(false);

  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    },
  });

  const formatTeamName = teamName.replace(/\s+/g, "_");
  const myImage = cld.image(`/team_logo_aib/${formatTeamName}`);

  const handleError = () => {
    setImgError(true);
  };

  if (imgError && typeError === "home") {
    return <Icon icon="ion:shirt" style={{ color: "#1669d4" }} width={48} height={48} />;
  }
  if (imgError && typeError === "away") {
    return <Icon icon="ion:shirt" style={{ color: "#d9dd0e" }} width={48} height={48} />;
  }

  return <AdvancedImage alt="team home Logo" cldImg={myImage} width="48" height="48" onError={handleError} />;
};

export default TeamLogo;
