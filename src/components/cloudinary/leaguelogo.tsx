/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { Icon } from "@iconify/react";

const LeagueLogo = ({ leagueName }: { leagueName: string }) => {
  const [imgError, setImgError] = useState(false);

  const cld = new Cloudinary({
    cloud: {
      cloudName: "dpibv0xwr",
    },
  });

  const formatTeamName = leagueName.replace(/\s+/g, "_");
  const myImage = cld.image(`/league_logo_aib/${formatTeamName}`);

  const handleError = () => {
    setImgError(true);
  };

  if (imgError) {
    return (
      <Icon icon="arcticons:monster-super-league" style={{ color: "rgba(255,255,255,1)" }} width={20} height={20} />
    );
  }

  return <AdvancedImage alt="team home Logo" cldImg={myImage} width="20" height="20" onError={handleError} />;
};

export default LeagueLogo;
