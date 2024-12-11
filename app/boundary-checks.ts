
/** Determines if the `position` is along the left boundary of the board */
export function isOnLeftBoundary(position: number): boolean {
  return [0, 8, 16, 24, 32, 40, 48, 56].includes(position)
}