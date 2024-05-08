/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Image } from "cloudinary-react";

const TeamLogo = ({ teamName }) => {
  return <Image cloudName="dwvxkqm99" publicId={`team_logos/${teamName}`} width="100" height="100" />;
};

export default TeamLogo;
