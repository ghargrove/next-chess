import { expect, it } from "@jest/globals";

import { reducer, State } from "./reducer";
import { blitzkriegState, initialState } from "./data";
import { PieceId } from "./components/GamePiece";

it("presents a default state", () => {
  const activePieces: Partial<typeof initialState> = {
    ...blitzkriegState,
    "wh-q": 10,
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
