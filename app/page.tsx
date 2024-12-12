"use client";

import React, { useEffect, useReducer } from "react";
import { Dashboard, Gameboard } from "./components";
import { PieceId } from "./components/GamePiece";
import { blitzkriegState, blitzkriegStateReverse, initialState } from "./data";
import { areKingsInCheck } from "./check-check";

/** Represents game state */
interface State {
  activePieces: Partial<typeof initialState>;
  capturedPieces: PieceId[];
  inCheck: "black" | "white" | null;
  inCheckMate: boolean;
  turn: "black" | "white";
}

/** Represents actions performed during the game */
type Action =
  | {
      pieceCaptured?: PieceId;
      pieceId: PieceId;
      position: number;
      type: "UPDATE_PIECE_POSITION";
    }
  | {
      type: "RESET_GAME";
    };

// State reducer
function reducer(state: State, action: Action): State {
  if (action.type === "UPDATE_PIECE_POSITION") {
    const { pieceCaptured, pieceId, position } = action;

    // Duplicate the active pieces state so that we can remove any capture pieces
    const activePieceDup = { ...state.activePieces };
    if (pieceCaptured !== undefined) {
      delete activePieceDup[pieceCaptured];
    }

    const nextActivePieces = {
      ...activePieceDup,
      [pieceId]: position,
    };

    // Given the next state of the board, determine if the kings are in check
    const [kingColor, isCheckmate] = areKingsInCheck(nextActivePieces);
    let inCheck: "black" | "white" | null = null;
    if (kingColor === "black") {
      inCheck = "black";
    } else if (kingColor === "white") {
      inCheck = "white";
    }

    return {
      ...state,
      activePieces: nextActivePieces,
      capturedPieces: [
        ...state.capturedPieces,
        ...(pieceCaptured !== undefined ? [pieceCaptured] : []),
      ],
      inCheck,
      inCheckMate: isCheckmate,
      turn: state.turn === "black" ? "white" : "black",
    };
  }

  if (action.type === "RESET_GAME") {
    return {
      ...state,
      activePieces: initialState,
      capturedPieces: [],
      inCheck: null,
      inCheckMate: false,
      turn: "white",
    };
  }

  return state;
}

export default function Home() {
  const [
    { activePieces, capturedPieces, inCheck, inCheckMate, turn },
    dispatch,
  ] = useReducer(reducer, {
    activePieces: initialState,
    capturedPieces: [],
    inCheck: null,
    inCheckMate: false,
    turn: "white",
  });

  // If the `inCheckMate` state becomes true, the game is over. Show a native modal
  useEffect(() => {
    if (inCheckMate) {
      window.alert(`Checkmate ${inCheck}!`);

      dispatch({ type: "RESET_GAME" });
    }
  }, [dispatch, inCheck, inCheckMate]);

  // Reset the board when a user clicks this button
  const handleResetClick: React.MouseEventHandler<HTMLButtonElement> = (
    evt
  ) => {
    evt.preventDefault();

    dispatch({ type: "RESET_GAME" });
  };

  // Move the piece identifierd by `pieceId`
  const handlePiecePositionChange = (
    pieceId: PieceId,
    position: number,
    pieceCaptured?: PieceId
  ) => {
    dispatch({
      pieceCaptured,
      pieceId,
      position,
      type: "UPDATE_PIECE_POSITION",
    });
  };

  return (
    <div className="layout">
      <div>
        <Gameboard
          currentTurn={turn}
          piecePositions={activePieces}
          onPiecePositionChange={handlePiecePositionChange}
        />
        <div className="status-container">
          <div>
            <p className="turn-identifier-black">
              {turn[0].toUpperCase() + turn.substring(1)} turn
            </p>
          </div>
          <button
            className="reset-btn"
            onClick={handleResetClick}
            type="button"
          >
            Reset
          </button>
        </div>
      </div>
      <Dashboard capturedPieces={capturedPieces} inCheck={inCheck} />
    </div>
  );
}
