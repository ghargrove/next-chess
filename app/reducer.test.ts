import { expect, it } from "@jest/globals";

import { reducer, State } from "./reducer";
import { blitzkriegState, initialState } from "./data";
import { PieceId } from "./components/GamePiece";

it("presents a default state", () => {
  const activePieces: Partial<typeof initialState> = {
    ...blitzkriegState,
    "wh-q": 13,
  };

  delete activePieces["blk-p3"];

  const currentState: State = {
    activePieces,
    capturedPieces: ["blk-p3"],
    inCheck: "black",
    inCheckMate: true,
    turn: "black",
  };

  const nextState = reducer(currentState, {
    type: "RESET_GAME",
  });

  expect(nextState.turn).toBe("white");
  expect(nextState.inCheck).toBeNull();
  expect(nextState.inCheckMate).toBe(false);
  expect(nextState.capturedPieces.length).toBe(0);

  for (const piece of Object.keys(nextState.activePieces)) {
    expect(nextState.activePieces[piece as PieceId]).toBe(
      initialState[piece as PieceId]
    );
  }
});

it('allows a piece to be captured', () => {
  const currentState: State = {
    activePieces: blitzkriegState,
    capturedPieces: [],
    inCheck: null,
    inCheckMate: false,
    turn: 'white'
  }

  const nextState = reducer(currentState, {
    type: 'UPDATE_PIECE_POSITION',
    pieceId: 'wh-q',
    position: 13,
    pieceCaptured: 'blk-p6'
  })

  expect(nextState.inCheck).toBe('black')
  expect(nextState.inCheckMate).toBe(true)
  expect(nextState.capturedPieces).toContain('blk-p6')
  expect(nextState.activePieces['wh-q']).toBe(13)
})
