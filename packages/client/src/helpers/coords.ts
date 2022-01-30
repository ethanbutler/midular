/** Given a start and end point, convert to dimensions. */
export const convertCoordPairToDimensions = (start: Coords, end: Coords) => ({
  x: Math.min(start.x, end.x),
  y: Math.min(start.y, end.y),
  h: Math.abs(end.y - start.y) + 1,
  w: Math.abs(end.x - start.x) + 1,
});

/** Given dimensions, convert to a tuple of Coords. */
export const convertDimensionsToCoordPair = ({x,y,w,h}: Dimensions) => [
  { x, y },
  { x: x+w, y: y+h}
]

/** Given dimensions, convert to a bounding box. */
export const convertDimensionsToBound = (dimensions: Dimensions): BoundingBox => {
  const [start, end] = convertDimensionsToCoordPair(dimensions)
  return {
    t: start.y,
    r: end.x,
    b: end.y,
    l: start.x,
  }
}

/** Given two bounding boxes, determine if they overlap. */
export const checkForOverlap = (a: BoundingBox, b: BoundingBox) => {
  if(a.r <= b.l) return false
  if(a.l >= b.r) return false
  if(a.b <= b.t) return false
  if(a.t >= b.b) return false
  return true
}