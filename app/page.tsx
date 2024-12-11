"use client";

import React, { useRef, useState } from "react";
import { Gameboard } from "./components/Gameboard";


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
      <Gameboard clicks={clickMatrix} onItemClick={handleCellClick} />
    </div>
  );
}
