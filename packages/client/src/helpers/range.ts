/** Returns a curried function that checks if a number is in a range. */
export const defineRange = (a: number, b: number) => {
  const min = Math.min(a, b);
  const max = Math.max(b, a);
  return {
    /** Returns true when the starting point of a dimension set is within range. */
    checkStart: (c: number) => c >= min && c < max,
    /** Returns true when the ending point of a dimension set is within range. */
    checkEnd: (c: number) => c > min && c <= max,
    /** Check true if a generic point is within range. */
    checkInclusive: (c: number) => c >= min && c <= max,
  };
};
