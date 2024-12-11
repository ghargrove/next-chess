"use client";

import React, { useReducer, useState } from "react";
import { Dashboard, Gameboard } from "./components";
import { PieceId } from "./components/GamePiece";
import { initialState } from "./data";

/** Represents game state */
interface State {
  activePieces: Partial<typeof initialState>;
  capturedPieces: PieceId[];
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

    return {
      ...state,
      activePieces: {
        ...activePieceDup,
        [pieceId]: position,
      },
      capturedPieces: [
        ...state.capturedPieces,
        ...(pieceCaptured !== undefined ? [pieceCaptured] : []),
      ],
      // Toggle the turn
      turn: state.turn === "black" ? "white" : "black",
    };
  }

  if (action.type === "RESET_GAME") {
    return {
      ...state,
      activePieces: initialState,
      turn: "white",
    };
  }

  return state;
}

export default function Home() {
  const [{ activePieces, capturedPieces, turn }, dispatch] = useReducer(
    reducer,
    {
      activePieces: {
        ...initialState,
        'wh-r2': 28,
        'blk-r1': 34
      },
      capturedPieces: [],
      turn: "white",
    }
  );

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
          debug
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
      <Dashboard capturedPieces={capturedPieces} />
    </div>
  );
}
