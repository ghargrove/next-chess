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

it("does not allow a black pawn to move forward an capture their own piece to its left", () => {
  const state = {
    ...initialState,
    "blk-p2": 17,
  };

  expect(calculateGamePieceMoves("blk-p3", state)).toEqual([18]);
});

it("allows a black pawn to move forward an capture another piece to its left", () => {
  const state = {
    ...initialState,
    "wh-p4": 19,
  };

  expect(calculateGamePieceMoves("blk-p3", state)).toEqual([18, 19]);
});

it("does not allow a black pawn to move forward an capture their own piece to its right", () => {
  const state = {
    ...initialState,
    "blk-p4": 19,
  };

  expect(calculateGamePieceMoves("blk-p3", state)).toEqual([18]);
});

//
it("does not allow a black pawn to move forward an capture a pieceoff the left side of the board", () => {
  const state = {
    ...initialState,
    "blk-p1": 16,
    'wh-p8': 23,
  };

  expect(calculateGamePieceMoves("blk-p1", state)).toEqual([24]);
});

it("does not allow a black pawn to move forward an capture a pieceoff the right side of the board", () => {
  const state = {
    ...initialState,
    'blk-p8': 23,
    'wh-p1': 32,
  };

  expect(calculateGamePieceMoves("blk-p8", state)).toEqual([31]);
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

it("does not allow a white pawn to move forward an capture their own piece to its left", () => {
  const state = {
    ...initialState,
    "wh-p5": 44,
  };

  expect(calculateGamePieceMoves("wh-p6", state)).toEqual([45]);
});

it("allows a white pawn to move forward an capture another piece to its right", () => {
  const state = {
    ...initialState,
    "blk-p5": 46,
  };

  expect(calculateGamePieceMoves("wh-p6", state)).toEqual([45, 46]);
});

it("does not allow a white pawn to move forward an capture their own piece to its right", () => {
  const state = {
    ...initialState,
    "wh-p7": 46,
  };

  expect(calculateGamePieceMoves("wh-p6", state)).toEqual([45]);
});

it("does not allow a white pawn to move forward an capture a pieceoff the left side of the board", () => {
  const state = {
    ...initialState,
    "wh-p1": 40,
    'blk-p8': 31
  };

  expect(calculateGamePieceMoves("wh-p1", state)).toEqual([32]);
});

it("does not allow a white pawn to move forward an capture a pieceoff the right side of the board", () => {
  const state = {
    ...initialState,
    "wh-p8": 47,
    'blk-p1': 40
  };

  expect(calculateGamePieceMoves("wh-p8", state)).toEqual([39]);
});
