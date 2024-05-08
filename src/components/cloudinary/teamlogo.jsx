/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { Image } from "cloudinary-react";
import { Icon } from "@iconify/react";

const TeamLogo = ({ teamName }) => {
  const [imgError, setImgError] = useState(false);

  const handleError = () => {
    setImgError(true);
  };

  if (imgError) {
    return <Icon icon="ion:shirt" style={{ color: "#1669d4" }} width={48} height={48} />;
  }

  return (
    <Image
      alt="team home Logo"
      cloudName="dwvxkqm99"
      publicId={`team_logos/${teamName}`}
      width="48"
      height="48"
      onError={handleError}
    />
  );
};

export default TeamLogo;
