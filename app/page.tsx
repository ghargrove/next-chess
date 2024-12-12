"use client";

import React, { useEffect, useReducer } from "react";

import { Dashboard, Gameboard } from "./components";
import { PieceId } from "./components/GamePiece";
import { initialState } from "./data";
import { reducer } from "./reducer";
import { pieceWeights } from "./piece-weights";

import {
  calculateGamePieceMoves,
  invertAndMapPieceState,
} from "./move-options";

/**
 * Describe a move for a given piece
 * 0 = piece to move
 * 1 = space to move to
 * 2 = piece that would be captured at that space (optional)
 * 3 = value of optional captured piece
 */
type MoveSet = [PieceId, number, PieceId | null, number];

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
    if (turn !== "black") {
      return;
    }

    const randomWait = Math.ceil(Math.random() * 3);

    setTimeout(() => {
      // Loop through all blk entries and generate paths
      // Determine if there is competitor piece at any of them
      // Capture a random piece or select a random move

      const pieceMap = invertAndMapPieceState(activePieces);
      const blackPieces = Object.keys(activePieces).filter((pieceId) =>
        /blk/.test(pieceId)
      );

      const d: Array<MoveSet> = [];

      for (const piece of blackPieces) {
        const possibleMoves = calculateGamePieceMoves(
          piece as PieceId,
          activePieces
        );
        // If the piece can't move then go to the next piece
        if (possibleMoves.length === 0) {
          continue;
        }

        // [black piece, space to move to, piece it would capture, the captured value]

        for (const move of possibleMoves) {
          const possibleCapturePiece = pieceMap.get(move);
          // If there is no piece, its worth nothing
          if (possibleCapturePiece === undefined) {
            d.push([piece as PieceId, move, null, 0]);
          } else {
            try {
              const [_, pieceSlug] = /^wh-([a-z]+)\d{0,2}$/.exec(
                possibleCapturePiece
              )!;
              const score =
                pieceWeights[pieceSlug as keyof typeof pieceWeights];

              d.push([piece as PieceId, move, possibleCapturePiece, score]);
            } catch (e) {
              console.log(
                "This shouldnt happen, but going to catch incase the destruct fails",
                e
              );

              d.push([piece as PieceId, move, null, 0]);
            }
          }
        }
      }

      // Group these into an array where < index == more value
      // Grab a random value from the 0 index and move there
      // [
      //   [
      //     ['blk-b2', 40, 'wh-p1', 1]
      //   ],
      //   [
      //     ['blk-p1', 24, null, 0],
      //     ['blk-p3', 26, null, 0]
      //   ]
      // ]
      // const movesSortedByWeight: Array<MoveSet[]> = []
      const moveSetMap: Map<number, MoveSet[]> = new Map();
      for (const moveSet of d) {
        // Get the array of moves corresponding w/ this score
        const scoreGroup = moveSetMap.get(moveSet[3]);

        // If The score group doesn't exist, then create one
        if (scoreGroup === undefined) {
          moveSetMap.set(moveSet[3], [moveSet]);
        } else {
          moveSetMap.set(moveSet[3], [...scoreGroup, moveSet]);
        }
      }

      const [bestMoves] = Array.from(moveSetMap.keys())
        .sort()
        .reverse()
        .map((score) => moveSetMap.get(score) as Array<MoveSet>);

      const randomIdx = Math.floor(Math.random() * (bestMoves.length + 1))

      console.log(bestMoves)
      console.log(randomIdx)
    }, randomWait * 1000);
  }, [activePieces, turn]);

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
