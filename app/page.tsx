"use client";

import React, { useState } from "react";
import { Dashboard, Gameboard } from "./components";
import { initialState } from "./data";

export default function Home() {
  const [pieceState, setPieceState] = useState(initialState)

  const handleResetClick: React.MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault()

    setPieceState(initialState)
  }

  return (
    <div className="layout">
      <div>
        <Gameboard piecePositions={pieceState} onPiecePositionChange={setPieceState} />
        <div className="status-container">
          <div>
            <p>black turn</p>
          </div>
          <button className="reset-btn" onClick={handleResetClick} type="button">Reset</button>
        </div>
      </div>
      <Dashboard />
    </div>
  );
}
