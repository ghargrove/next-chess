import { expect, it } from "@jest/globals";

import { movePawn } from './move-options'

it("allows a black pawn to move forward", () => {
  expect(movePawn('blk', 48)).toEqual([40]);
});

it("allows a white pawn to move forward", () => {
  expect(movePawn('wh', 8)).toEqual([16]);
});
