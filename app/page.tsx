"use client";

import React, { useCallback, useEffect, useReducer } from "react";

import { Dashboard, Gameboard } from "./components";
import { PieceId } from "./components/GamePiece";
import { initialState, blitzkriegState, blitzkriegStateReverse } from "./data";
import { findNextBestMove } from "./move-generator";
import { reducer } from "./reducer";

export default function Home() {
  const [
    { activePieces, capturedPieces, inCheck, inCheckMate, turn },
    dispatch,
  ] = useReducer(reducer, {
    activePieces: blitzkriegStateReverse,
    capturedPieces: [],
    inCheck: null,
    inCheckMate: false,
    turn: "white",
  });

  // Move the piece identifierd by `pieceId`
  const handlePiecePositionChange = useCallback(
    (pieceId: PieceId, position: number, pieceCaptured?: PieceId) => {
      dispatch({
        pieceCaptured,
        pieceId,
        position,
        type: "UPDATE_PIECE_POSITION",
      });
    },
    [dispatch]
  );

  // If the `inCheckMate` state becomes true, the game is over. Show a native modal
  useEffect(() => {
    if (inCheckMate) {
      window.alert(`Checkmate ${inCheck}!`);

      dispatch({ type: "RESET_GAME" });
    }
  }, [dispatch, inCheck, inCheckMate]);

  // Once it's the black players turn, this effect will
  // move their piece after a short timeout
  useEffect(() => {
    if (turn !== "black") {
      return;
    }

    const randomWait = Math.ceil(Math.random() * 3);

    setTimeout(() => {
      const [pieceToMove, nextPosition, pieceToCapture] = findNextBestMove(activePieces)

      handlePiecePositionChange(pieceToMove, nextPosition, pieceToCapture ?? undefined)
    }, randomWait * 1000);
  }, [activePieces, handlePiecePositionChange, turn]);

  // Reset the board when a user clicks this button
  const handleResetClick: React.MouseEventHandler<HTMLButtonElement> = (
    evt
  ) => {
    evt.preventDefault();

    dispatch({ type: "RESET_GAME" });
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
