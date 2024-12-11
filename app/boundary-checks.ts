
/** Determines if the `position` is along the left boundary of the board */
export function isOnLeftBoundary(position: number): boolean {
  return [0, 8, 16, 24, 32, 40, 48, 56].includes(position)
}

/** Determines if the `position` is along the right boundary of the board */
export function isOnRightBoundary(position: number): boolean {
  return [7, 15, 23, 31, 39, 47, 55, 63].includes(position)
}

/** Determines if the `position` is along the top boundary of the board */
export function isOnTopBoundary(position: number): boolean {
  return [0, 1, 2, 3, 4, 5, 6, 7].includes(position)
}