"use client";

import { useMemo, useState } from "react";
import { GamePiece, PieceId } from "./GamePiece";
import { calculateGamePieceMoves } from "../move-options";

type SquareType = "black-square" | "white-square";

interface GameboardProps {
  /** Determines if it's the black or white players turn  */
  currentTurn: "black" | "white";
  /** Display position information */
  debug?: boolean;
  /** Describes where on the board the pieces are positioned */
  piecePositions: Partial<Record<PieceId, number>>;
  /** Update the piece to the `position` */
  onPiecePositionChange: (pieceId: PieceId, position: number, captures?: PieceId) => void;
}

/** Presents a gameboard */
export const Gameboard: React.FC<GameboardProps> = (props) => {
  const {
    currentTurn,
    debug = false,
    piecePositions,
    onPiecePositionChange,
  } = props;

  // Tracks which cells are legal moves during a drag operation
  const [legalMoves, setLegalMoves] = useState<number[]>([])

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

      setLegalMoves(calculateGamePieceMoves(pieceId as PieceId, piecePositions))
    }    
  };

  const handleDragOver: (
    pos: number
  ) => React.DragEventHandler<HTMLDivElement> = (pos) => (evt) => {
    // console.log("drag over -->", pos);

    evt.preventDefault();
  };

  const handleDrop: (pos: number) => React.DragEventHandler<HTMLDivElement> =
    (pos) => (evt) => {
      // I'm type casting here because I know what I set
      const pieceId = evt.dataTransfer.getData("text/plain") as PieceId;
      const legalMoves = calculateGamePieceMoves(pieceId, piecePositions);

      // Make sure the piece being move aligns w/ the current turn
      const pieceBelongsToTurn =
        (currentTurn === "black" && /^blk/.test(pieceId)) ||
        (currentTurn === "white" && /^wh/.test(pieceId));

      // If the piece was dropped on a legal space then update the game board
      if (legalMoves.includes(pos) && pieceBelongsToTurn) {
        const pieceCaptured = pieceMap.get(pos)
        
        onPiecePositionChange(pieceId, pos, pieceCaptured);
      }
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
              className={`square ${col} ${legalMoves.includes(boardPos) ? 'highlight-square' : ''}`}
              onDragOver={handleDragOver(boardPos)}
              onDrop={handleDrop(boardPos)}
            >
              {debug && boardPos}
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
