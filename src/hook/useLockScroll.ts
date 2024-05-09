import React from "react";

export const UseLockBodyScroll = (lock: boolean) => {
  React.useEffect(() => {
    if (lock) {
      document.body.classList.add("body-lock");
    } else {
      document.body.classList.remove("body-lock");
    }
  }, [lock]);
};
