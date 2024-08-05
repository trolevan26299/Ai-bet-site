"use client";

import { ReactNode, useMemo, useState } from "react";
import { RequestIdContext } from "../context/requestId.context";

interface RequestIdProps {
  children: ReactNode;
}

export function RequestIdProvider({ children }: RequestIdProps) {
  const [requestId, setRequestId] = useState<string>();

  const updateRequestId = (requestId: string) => {
    setRequestId(requestId);
  };

  const contextValue = useMemo(
    () => ({
      requestId,
      updateRequestId,
    }),
    [requestId]
  );

  return <RequestIdContext.Provider value={contextValue}>{children}</RequestIdContext.Provider>;
}
