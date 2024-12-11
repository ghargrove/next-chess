import { expect, it } from "@jest/globals";

import { isOnLeftBoundary, isOnRightBoundary } from "./boundary-checks";

it("returns true if the position is along the left border", () => {
  [0, 8, 16, 24, 32, 40, 48, 56].forEach((v) => {
    expect(isOnLeftBoundary(v)).toBe(true);
  });
});

it("returns false if the position is not along the left border", () => {
  [4, 31, 60, 100, -1, 36].forEach((v) => {
    expect(isOnLeftBoundary(v)).toBe(false);
  });
});

it("returns true if the position is along the right border", () => {
  [7, 15, 23, 31, 39, 47, 55, 63].forEach((v) => {
    expect(isOnRightBoundary(v)).toBe(true);
  });
});

it("returns false if the position is not along the right border", () => {
  [4, 24, 60, 100, -1, 36].forEach((v) => {
    expect(isOnRightBoundary(v)).toBe(false);
  });
});
