import React from "react";

export const UseLockBodyScroll = (lock: boolean) => {
  const originalStyle = window.getComputedStyle(document.body).overflow; // Get the current overflow style
  if (lock) {
    return (document.body.style.overflow = "hidden");
  } else {
    return () => {
      document.body.style.overflow = originalStyle; // Restore the original overflow style
    };
  }
};
