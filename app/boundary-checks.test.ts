import { expect, it } from "@jest/globals";

import { isOnLeftBoundary } from "./boundary-checks";

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
