"use client";

import React, { useReducer, useState } from "react";
import { Dashboard, Gameboard } from "./components";
import { PieceId } from "./components/GamePiece";
import { initialState } from "./data";

/** Represents game state */
interface State {
  gameState: typeof initialState;
  turn: "black" | "white";
}

/** Represents actions performed during the game */
type Action =
  | {
      pieceId: PieceId;
      position: number;
      type: "UPDATE_PIECE_POSITION";
    }
  | {
      type: "RESET_GAME";
    };

// State reducer
function reducer(state: State, action: Action): State {
  if (action.type === 'UPDATE_PIECE_POSITION') {
    const { pieceId, position } = action
    return {
      ...state,
      gameState: {
        ...state.gameState,
        [pieceId]: position
      },
      // Toggle the turn
      turn: state.turn === 'black' ? 'white' : 'black'
    }
  }

  if (action.type === "RESET_GAME") {
    return {
      ...state,
      gameState: initialState,
      turn: "white",
    };
  }

  return state;
}

export default function Home() {
  const [{ gameState, turn }, dispatch] = useReducer(reducer, {
    gameState: initialState,
    turn: "white",
  });

  const handleResetClick: React.MouseEventHandler<HTMLButtonElement> = (
    evt
  ) => {
    evt.preventDefault();

    dispatch({ type: "RESET_GAME" });
  };

  const handlePiecePositionChange = (pieceId: PieceId, position: number) => {
    dispatch({
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
          piecePositions={gameState}
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
      <Dashboard />
    </div>
  );
}
