"use client";

import React, { useEffect, useReducer } from "react";

import { Dashboard, Gameboard } from "./components";
import { PieceId } from "./components/GamePiece";
import { initialState } from "./data";
import { reducer } from "./reducer";

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

  useEffect(() => {
    if (turn === 'black') {
      const randomWait = Math.ceil(Math.random() * 3)

      setTimeout(() => {
        // Loop through all blk entries and generate paths
        // Determine if there is competitor piece at any of them
        // Capture a random piece or select a random move

        


      }, randomWait * 1000)
    }

  }, [turn])

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
            className="reset-btn text-white"
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
