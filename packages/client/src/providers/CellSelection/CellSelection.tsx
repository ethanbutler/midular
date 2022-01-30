import React from "react";
import { convertCoordPairToDimensions } from "helpers/coords";
import { defineRange } from "helpers/range";

const CellSelectionContext = React.createContext<
  ReturnType<typeof useCellSelectionProvider>
>(null as any);

interface CellSelectionProviderProps {
  onRelease?: (dimensions: Dimensions) => void;
  detectCollision?: (dimensions: Dimensions) => boolean;
}

/**
 * Manages internal state for a CellSelectionProvider.
 * Do not use directly.
 *
 * TODO: Add touch support.
 */
export function useCellSelectionProvider({
  onRelease,
  detectCollision = () => false,
}: CellSelectionProviderProps) {
  const [start, setStart] = React.useState<null | Coords>(null);
  const [end, setEnd] = React.useState<null | Coords>(null);

  const isSelectionActive = Boolean(start);

  /** Updates the starting coordinates based on a new user action. */
  const begin = (coords: Coords) => {
    if (detectCollision(convertCoordPairToDimensions(coords, coords))) return;
    if (start) return release(coords);

    setStart(coords);
    setEnd(coords);
  };

  /** Updates the ending coordinates. */
  const move = (coords: Coords) => {
    if (!start) return;
    setEnd(coords);
  };

  /** Triggered when the user releases. */
  const release = (coords: Coords) => {
    if (!start) return;

    if (detectCollision(convertCoordPairToDimensions(start, coords))) return;

    if (onRelease) {
      // TODO: Figure out this off-by-one error.
      const result = convertCoordPairToDimensions(start!, end!);
      onRelease(result);
    }

    setStart(null);
    setEnd(null);
  };

  /** Returns true if a provided set of coordinates is the starting point. */
  const getIsCoordAtStart = (coords: Coords) =>
    start && coords.x === start.x && coords.y === start.y;

  /** Returns true if a provided set of coordinates is the ending point. */
  const getIsCoordAtEnd = (coords: Coords) =>
    end && coords.x === end.x && coords.y === end.y;

  /** Returns true if a provided set of coordinates is *either* the starting or ending point. */
  const getIsCoordActive = (coords: Coords) =>
    getIsCoordAtStart(coords) || getIsCoordAtEnd(coords);

  /** Returns true if a provided set of coordinates is within the range defined by the starting or endign points. */
  const getIsCoordsWithinActiveRange = (coords: Coords) => {
    if (!start || !end) return false;
    const xRange = defineRange(start.x, end.x);
    const yRange = defineRange(start.y, end.y);
    return xRange.checkInclusive(coords.x) && yRange.checkInclusive(coords.y);
  };

  /** True if the selected range overlaps with an existing device. */
  const isColliding = Boolean(
    start && end && detectCollision(convertCoordPairToDimensions(start, end))
  );

  return {
    start,
    end,
    begin,
    move,
    release,
    isColliding,
    isSelectionActive,
    getIsCoordAtStart,
    getIsCoordAtEnd,
    getIsCoordActive,
    getIsCoordsWithinActiveRange,
  };
}

/**
 * Manages cell selection state for a grid.
 */
export function CellSelectionProvider({
  children,
  ...props
}: CellSelectionProviderProps & { children: React.ReactNode }) {
  const ctx = useCellSelectionProvider(props);
  return (
    <CellSelectionContext.Provider value={ctx}>
      {children}
    </CellSelectionContext.Provider>
  );
}

/** Returns state information about the entire cell selection. */
export function useCellSelectionState() {
  const ctx = React.useContext(CellSelectionContext);

  if (!ctx) {
    throw new Error("BUG: Using `useCell` outside of a CellSelectionProvider.");
  }

  const { isColliding, isSelectionActive } = ctx;
  return { isColliding, isSelectionActive };
}

/** Returns state information about a cell, as well as props to be spread on the cell. */
// TODO: Touch events
export function useCell(coords: Coords) {
  const ctx = React.useContext(CellSelectionContext);
  if (!ctx) {
    throw new Error("BUG: Using `useCell` outside of a CellSelectionProvider.");
  }
  const onMouseDown = ctx.begin.bind(null, coords);
  const onMouseEnter = ctx.move.bind(null, coords);
  const onMouseUp = ctx.release.bind(null, coords);
  const isCoordAtStart = ctx.getIsCoordAtStart(coords);
  const isCoordAtEnd = ctx.getIsCoordAtEnd(coords);
  const isCoordActive = ctx.getIsCoordActive(coords);
  const isCoordWithinActiveRange = ctx.getIsCoordsWithinActiveRange(coords);

  return {
    isCoordAtStart,
    isCoordAtEnd,
    isCoordActive,
    isCoordWithinActiveRange,
    cellProps: {
      onMouseDown,
      onMouseEnter,
      onMouseUp,
    },
  };
}
