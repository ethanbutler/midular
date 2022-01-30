import { defineRange } from "./range"

const range = defineRange(2, 4)

test('should check inner ranges', () => {
  expect(range.checkStart(1)).toBe(false)
  expect(range.checkStart(2)).toBe(true)
  expect(range.checkStart(4)).toBe(false)
})

test('should check ending ranges', () => {
  expect(range.checkEnd(1)).toBe(false)
  expect(range.checkEnd(2)).toBe(false)
  expect(range.checkEnd(4)).toBe(true)
})

test('should check inclusive ranges ranges', () => {
  expect(range.checkInclusive(1)).toBe(false)
  expect(range.checkInclusive(2)).toBe(true)
  expect(range.checkInclusive(4)).toBe(true)
})