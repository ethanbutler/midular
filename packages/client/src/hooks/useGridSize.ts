import React from "react";

/**
 * Returns the size of the grid to be used
 * to layout devices.
 *
 * TODO: This should encapsulate some level of responsiveness.
 */
export const useGridSize = (size = 16) => {
  const [gridSize] = React.useState(size);

  /** The size of the grid. */
  return gridSize;
};
