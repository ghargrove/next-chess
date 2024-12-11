import { expect, it } from "@jest/globals";

import { initialState } from "./data";
import { calculateGamePieceMoves } from './move-options'

// it("allows a black pawn to move forward", () => {
//   expect(calculateGamePieceMoves('blk-p1', initialState)).toEqual([16]);
// });



// it("allows a white pawn to move forward", () => {
//   expect(calculateGamePieceMoves('wh-p1', initialState)).toEqual([40]);
// });

it("allows a white pawn to move forward an capture another piece to its left", () => {
  const state = {
    ...initialState,
    'blk-p5': 44
  }

  expect(calculateGamePieceMoves('wh-p6', state)).toEqual([44, 45]);
});
