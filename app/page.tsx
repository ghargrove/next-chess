"use client";

import Image from "next/image";
import React, { useMemo, useRef, useState } from "react";
import pawnBlack from "../public/images/pawn-black.svg";

type SquareType = "black-square" | "white-square";

const Checkerboard: React.FC<{
  clicks: Record<string, number>;
  onItemClick: (v: [number, number]) => void;
}> = ({ clicks, onItemClick }) => {

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

    return rows
  }, [])

  

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
              { rowIdx === 0 && colIdx === 1 && <Image alt="black pawn" priority src={pawnBlack} /> }
            </div>
          );
        });
      })}
    </div>
  );
};

export default function Home() {
  const totalCountRef = useRef(0);
  const [clickMatrix, setClickMatrix] = useState<Record<string, number>>({});

  const handleCellClick: (coords: [number, number]) => void = ([r, c]) => {
    setClickMatrix((currentClicks) => {
      const k = `${r}-${c}`;
      const nextValue =
        currentClicks[k] === undefined ? 1 : currentClicks[k] + 1;

      // Update the ref if the next value is higher than the current
      if (nextValue > totalCountRef.current) {
        totalCountRef.current = nextValue;
      }

      // Update the state
      return {
        ...currentClicks,
        [k]: nextValue,
      };
    });
  };

  return (
    <div className="layout">
      <div>{totalCountRef.current}</div>
      <Checkerboard clicks={clickMatrix} onItemClick={handleCellClick} />
    </div>
  );
}
