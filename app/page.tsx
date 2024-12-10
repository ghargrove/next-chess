
'use client'

import React, { useRef, useState } from 'react'

type T = 'black-square' | 'white-square'

const Checkerboard: React.FC <{ clicks: Record<string, number>, onItemClick: (v: [number, number]) => void }>= ({ clicks, onItemClick }) => {
  const rows  = []
  for (let i = 1; i <= 8; i++) {
    // Nested loop
    const column: Array<T> = [];
    for (let j = 1; j <= 8; j++) {
      column.push(j % 2 === 0 ? (i % 2 === 0 ? 'white-square' : 'black-square') : (i % 2 === 0 ? 'black-square' : 'white-square'))
    }

    rows.push(column)
  }

  return (
    <div className="checkerboard">
      {
        rows.map((row, rowIdx) => {
          return row.map((col, colIdx) => {
            const k = `${rowIdx}-${colIdx}`

            return <div key={rowIdx + '-' + colIdx} className={`square ${col}`} onClick={() => onItemClick([rowIdx, colIdx])} >{clicks[k] === undefined ? 0 : clicks[k]}</div>
          })
        })
      }
    
    </div>
  )
}

export default function Home() {
  const totalCountRef = useRef(0)
  const [clickMatrix, setClickMatrix] = useState<Record<string, number>>({})

  const handleCellClick: (coords: [number, number]) => void = ([r, c]) => {
    setClickMatrix((currentClicks) => {
      const k = `${r}-${c}`
      const nextValue = currentClicks[k] === undefined ? 1 : currentClicks[k] + 1

      // Update the ref if the next value is higher than the current
      if (nextValue > totalCountRef.current) {
        totalCountRef.current = nextValue
      }

      // Update the state
      return {
        ...currentClicks,
        [k]: nextValue
      }
    })
  }


  return (
    <div className="layout">
      <div>{totalCountRef.current}</div>
      <Checkerboard clicks={clickMatrix} onItemClick={handleCellClick} />
      
    </div>
  );
}
