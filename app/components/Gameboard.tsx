"use client";

import Image from "next/image";
import { GamePiece, PieceId } from "./GamePiece";
import pawnBlack from "../../public/images/pawn-black.svg";
// import rookBlack from '../public/images/rook-black.svg';
// import knightBlack from '../public/images/knight-black.svg';
// import bishopBlack from '../public/images/bishop-black.svg';
// import queenBlack from '../public/images/queen-black.svg';
// import kingBlack from '../public/images/king-black.svg';

import { useMemo } from "react";

type SquareType = "black-square" | "white-square";

interface GameboardProps {
  clicks: Record<string, number>;
  onItemClick: (v: [number, number]) => void;
}

// How are we going to represent the game state?
// - A piece has an id b-p1, b-p2, b-p3 - b-p8, b-r1, b-r2, blk-kn1, wh-kn2, b-1, b-2, q-1, k-1
// - each board cell has an index 0 - 63, -1 (out)
// - how can we easily show game pieces removed from the game?

export const Gameboard: React.FC<GameboardProps> = (props) => {
  const { clicks, onItemClick } = props;

  // Initial game state
  // TODO: Move
  const gameState: Record<PieceId, number> = {
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

  // How best can we map the points in the `gameState` to the points in the board?

  const invertedPieces = Array.from(Object.entries(gameState) as [PieceId, number][]).map<
    [number, PieceId]
  >(([k, v]) => [v, k]);

  const pieceMap = new Map(invertedPieces);

  const cellMatrix = useMemo(() => {
    const rows: SquareType[][] = [];
    for (let i = 1; i <= 8; i++) {
      // Nested loop
      const column: SquareType[] = [];
      for (let j = 1; j <= 8; j++) {
        column.push(
          j % 2 === 0
            ? i % 2 === 0
              ? "white-square"
              : "black-square"
            : i % 2 === 0
            ? "black-square"
            : "white-square"
        );
      }

      rows.push(column);
    }

    return rows;
  }, []);

  return (
    <div className="checkerboard">
      {cellMatrix.map((row, rowIdx) => {
        return row.map((col, colIdx) => {
          // Calculate the position on the board for the current cell & see
          // if there is a piece at that point
          const boardPos = (rowIdx * 8) + colIdx
          const pieceId = pieceMap.get(boardPos);


          return (
            <div
              key={rowIdx + "-" + colIdx}
              className={`square ${col}`}
              onClick={() => onItemClick([rowIdx, colIdx])}
            >
              {pieceId !== undefined && <GamePiece pieceId={pieceId} />}
            </div>
          );
        });
      })}
    </div>
  );
};
