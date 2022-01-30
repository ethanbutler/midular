import { renderHook } from "@testing-library/react-hooks";
import { useGridSize } from "./useGridSize";

test('should return an array of default length', () => {
  const {result} = renderHook(() => useGridSize())
  expect(result.current).toBe(16)
})