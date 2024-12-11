"use client";

import { useMemo, useState } from "react";
import { initialState } from "../data";
import { GamePiece, PieceId } from "./GamePiece";

type SquareType = "black-square" | "white-square";


interface GameboardProps {
  /** Describes where on the board the pieces are positioned */
  piecePositions: Record<PieceId, number>
  /** Update the piece position */
  onPiecePositionChange: React.Dispatch<React.SetStateAction<Record<PieceId, number>>>
}

/** Presents a gameboard */
export const Gameboard: React.FC<GameboardProps> = (props) => {
  const { piecePositions, onPiecePositionChange } = props
  
  
  const invertedPieces = Array.from(
    Object.entries(piecePositions) as [PieceId, number][]
  ).map<[number, PieceId]>(([k, v]) => [v, k]);

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

  const handleDrag: React.DragEventHandler<HTMLDivElement> = (evt) => {
    evt.dataTransfer.dropEffect = "move";

    // Add the piece id to the event
    const { pieceId } = evt.currentTarget.dataset;
    if (pieceId !== undefined) {
      evt.dataTransfer.setData("text/plain", pieceId);
    }
  };

  const handleDragOver: (
    pos: number
  ) => React.DragEventHandler<HTMLDivElement> = (pos) => (evt) => {
    console.log("drag over -->", pos);

    evt.preventDefault();
  };

  // First pass we should just move items. Who cares about rules

  const handleDrop: (pos: number) => React.DragEventHandler<HTMLDivElement> =
    (pos) => (evt) => {
      const pieceId = evt.dataTransfer.getData("text/plain")

      onPiecePositionChange(currentGameState => ({
        ...currentGameState,
        [pieceId]: pos
      }))
    };

  return (
    <div className="checkerboard">
      {cellMatrix.map((row, rowIdx) => {
        return row.map((col, colIdx) => {
          // Calculate the position on the board for the current cell & see
          // if there is a piece at that point
          const boardPos = rowIdx * 8 + colIdx;
          const pieceId = pieceMap.get(boardPos);

          return (
            <div
              key={rowIdx + "-" + colIdx}
              className={`square ${col}`}
              onDragOver={handleDragOver(boardPos)}
              onDrop={handleDrop(boardPos)}
            >
              {pieceId !== undefined && (
                <div draggable data-piece-id={pieceId} onDragStart={handleDrag}>
                  <GamePiece pieceId={pieceId} />
                </div>
              )}
            </div>
          );
        });
      })}
    </div>
  );
};
