import React from "react";

/**
 * Models the count for a measure of music. Returns the active beat
 * and callbacks to increment or reset the measure.
 */
export function useCount(beats: number) {
  const [count, setCount] = React.useState(0);
  const increment = () => setCount((c) => (c + 1 >= beats ? 0 : c + 1));
  const reset = () => setCount(0);
  return [count, { increment, reset }] as const;
}
