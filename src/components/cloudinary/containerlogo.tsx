/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { Icon } from "@iconify/react";

const ContainerLogo = ({ containerName }: { containerName: string }) => {
  const [imgError, setImgError] = useState(false);

  const cld = new Cloudinary({
    cloud: {
      cloudName: "dpibv0xwr",
    },
  });

  const formatTeamName = containerName?.replace(/\s+/g, "_");
  const myImage = cld.image(`container_logo_aib/${formatTeamName}`);

  const handleError = () => {
    setImgError(true);
  };

  if (imgError) {
    return <Icon icon="uiw:global" style={{ color: "rgba(255,255,255,1)" }} width={20} height={20} />;
  }

  return <AdvancedImage alt="team home Logo" cldImg={myImage} width="20" height="20" onError={handleError} />;
};

export default ContainerLogo;
