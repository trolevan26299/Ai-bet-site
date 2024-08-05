"use client";

import { createContext, useContext } from "react";

interface RequestIdContextType {
  requestId: string | undefined;
  updateRequestId: (requestId: string) => void;
}

export const RequestIdContext = createContext<RequestIdContextType>({
  requestId: undefined,
  updateRequestId: () => {},
});

export const useGetRequestId = () => {
  const context = useContext(RequestIdContext);
  if (!context) {
    throw new Error("useGetRequestId must be used within an ImageProvider");
  }
  return context;
};
