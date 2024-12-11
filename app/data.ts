import { PieceId } from "./components/GamePiece";

/** Represents the gameboards initial state */
export const initialState: Record<PieceId, number> = {
  "blk-p1": 8,
  "blk-p2": 9,
  "blk-p3": 10,
  "blk-p4": 11,
  "blk-p5": 12,
  "blk-p6": 13,
  "blk-p7": 14,
  "blk-p8": 15,
  "blk-r1": 0,
  "blk-r2": 7,
  "blk-kn1": 1,
  "blk-kn2": 6,
  "blk-b1": 2,
  "blk-b2": 5,
  "blk-q": 4,
  "blk-k": 3,
  "wh-p1": 48,
  "wh-p2": 49,
  "wh-p3": 50,
  "wh-p4": 51,
  "wh-p5": 52,
  "wh-p6": 53,
  "wh-p7": 54,
  "wh-p8": 55,
  "wh-r1": 56,
  "wh-r2": 63,
  "wh-kn1": 57,
  "wh-kn2": 62,
  "wh-b1": 58,
  "wh-b2": 61,
  "wh-q": 60,
  "wh-k": 59,
};

export const blitzkriegState: Record<PieceId, number> = {
  "blk-p1": 16,
  "blk-p2": 17,
  "blk-p3": 10,
  "blk-p4": 11,
  "blk-p5": 12,
  "blk-p6": 13,
  "blk-p7": 14,
  "blk-p8": 23,
  "blk-r1": 0,
  "blk-r2": 7,
  "blk-kn1": 1,
  "blk-kn2": 6,
  "blk-b1": 2,
  "blk-b2": 5,
  "blk-q": 4,
  "blk-k": 3,
  "wh-p1": 48,
  "wh-p2": 49,
  "wh-p3": 50,
  "wh-p4": 43,
  "wh-p5": 52,
  "wh-p6": 53,
  "wh-p7": 54,
  "wh-p8": 55,
  "wh-r1": 56,
  "wh-r2": 63,
  "wh-kn1": 57,
  "wh-kn2": 62,
  "wh-b1": 37,
  "wh-b2": 61,
  "wh-q": 42,
  "wh-k": 59,
};

export const blitzkriegStateReverse: Record<PieceId, number> = {
  "blk-p1": 8,
  "blk-p2": 9,
  "blk-p3": 10,
  "blk-p4": 19,
  "blk-p5": 12,
  "blk-p6": 13,
  "blk-p7": 14,
  "blk-p8": 15,
  "blk-r1": 0,
  "blk-r2": 7,
  "blk-kn1": 1,
  "blk-kn2": 6,
  "blk-b1": 29,
  "blk-b2": 5,
  "blk-q": 18,
  "blk-k": 3,
  "wh-p1": 40,
  "wh-p2": 49,
  "wh-p3": 50,
  "wh-p4": 51,
  "wh-p5": 52,
  "wh-p6": 53,
  "wh-p7": 54,
  "wh-p8": 47,
  "wh-r1": 56,
  "wh-r2": 63,
  "wh-kn1": 57,
  "wh-kn2": 62,
  "wh-b1": 58,
  "wh-b2": 61,
  "wh-q": 60,
  "wh-k": 59,
};
