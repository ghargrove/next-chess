"use client";

import Image from "next/image";
import pawnBlack from "../public/images/pawn-black.svg";
import { useMemo } from "react";

type SquareType = "black-square" | "white-square";

interface GameboardProps {
  clicks: Record<string, number>;
  onItemClick: (v: [number, number]) => void;
}

export const Gameboard: React.FC<GameboardProps> = (props) => {
  const { clicks, onItemClick } = props;

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
          const k = `${rowIdx}-${colIdx}`;

          return (
            <div
              key={rowIdx + "-" + colIdx}
              className={`square ${col}`}
              onClick={() => onItemClick([rowIdx, colIdx])}
            >
              {rowIdx === 0 && colIdx === 1 && (
                <Image alt="black pawn" priority src={pawnBlack} />
              )}
            </div>
          );
        });
      })}
    </div>
  );
};
