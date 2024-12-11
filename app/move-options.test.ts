import { expect, it } from "@jest/globals";

import { calculateGamePieceMoves } from './move-options'

it("allows a black pawn to move forward", () => {
  expect(calculateGamePieceMoves('blk-p1', 48)).toEqual([40]);
});

it("allows a white pawn to move forward", () => {
  expect(calculateGamePieceMoves('wh-p1', 8)).toEqual([16]);
});
