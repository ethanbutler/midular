import {
  convertCoordPairToDimensions,
  convertDimensionsToCoordPair,
} from "./coords";

const DIMENSIONS = { x: 0, y: 0, h: 2, w: 2 }
const PAIR = [
  { x: 0, y: 0 },
  { x: 2, y: 2 },
] as const

describe("convertCoordPairToDimensions", () => {
  it("converts to dimensions", () => {
    const result = convertCoordPairToDimensions(...PAIR);
    expect(result).toEqual({...DIMENSIONS, h: 3, w: 3});
  });
});

describe("convertCoordPairToDimensions", () => {
  it("converts to coord pairs", () => {
    const result = convertDimensionsToCoordPair(DIMENSIONS);
    expect(result).toEqual(PAIR);
  });
});