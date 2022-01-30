import React from "react";

/** Returns a memoized array of a given length. */
export const useArrayOfSize = (length: number) =>
  React.useMemo(() => {
    return Array.from({ length }).map((_, i) => i);
  }, [length]);
