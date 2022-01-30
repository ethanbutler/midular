import { renderHook } from "@testing-library/react-hooks";
import { useArrayOfSize } from "./useArrayOfSize";

test('should return an array of default length', () => {
  const {result} = renderHook(() => useArrayOfSize(16))
  expect(result.current.length).toBe(16)
})