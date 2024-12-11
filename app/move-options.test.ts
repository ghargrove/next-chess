import { expect, it } from "@jest/globals";

import { initialState } from "./data";
import { calculateGamePieceMoves } from "./move-options";

it("allows a black pawn to move forward", () => {
  expect(calculateGamePieceMoves("blk-p1", initialState)).toEqual([16]);
});

it("allows a black pawn to move forward an capture another piece to its left", () => {
  const state = {
    ...initialState,
    "wh-p4": 17,
  };

  expect(calculateGamePieceMoves("blk-p3", state)).toEqual([17, 18]);
});

it("allows a black pawn to move forward an capture another piece to its left", () => {
  const state = {
    ...initialState,
    "wh-p4": 19,
  };

  expect(calculateGamePieceMoves("blk-p3", state)).toEqual([18, 19]);
});

it("allows a white pawn to move forward", () => {
  expect(calculateGamePieceMoves("wh-p1", initialState)).toEqual([40]);
});

it("allows a white pawn to move forward an capture another piece to its left", () => {
  const state = {
    ...initialState,
    "blk-p5": 44,
  };

  expect(calculateGamePieceMoves("wh-p6", state)).toEqual([44, 45]);
});

it("allows a white pawn to move forward an capture another piece to its right", () => {
  const state = {
    ...initialState,
    "blk-p5": 46,
  };

  expect(calculateGamePieceMoves("wh-p6", state)).toEqual([45, 46]);
});
