import { expect, it } from "@jest/globals";

import {
  isOnBottomBoundary,
  isOnLeftBoundary,
  isOnRightBoundary,
  isOnTopBoundary,
} from "./boundary-checks";

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

it("returns true if the position is along the top border", () => {
  [0, 1, 2, 3, 4, 5, 6, 7].forEach((v) => {
    expect(isOnTopBoundary(v)).toBe(true);
  });
});

it("returns false if the position is not along the top border", () => {
  [31, 24, 60, 100, -1, 36].forEach((v) => {
    expect(isOnTopBoundary(v)).toBe(false);
  });
});

it("returns true if the position is along the bottom border", () => {
  [56, 57, 58, 59, 60, 61, 62, 63].forEach((v) => {
    expect(isOnBottomBoundary(v)).toBe(true);
  });
});

it("returns false if the position is not along the bottom border", () => {
  [31, 24, 4, 100, -1, 36].forEach((v) => {
    expect(isOnBottomBoundary(v)).toBe(false);
  });
});
