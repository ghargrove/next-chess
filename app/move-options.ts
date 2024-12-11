
import { PieceId } from "./components/GamePiece";

const pawnRegex = /^(blk|wh)-p[1-8]$/

/** Calculate the spaces a piece can move to */
export function calculateGamePieceMoves(pieceId: PieceId, currentPosition: number): number[] {

  const pawnMatch = pawnRegex.exec(pieceId)
  if (pawnMatch !== null) {
    const [_, color] = pawnMatch
    return movePawn(color as 'blk' | 'wh', currentPosition);
  }

  return []
}


/** Determines which postitions a pawn can move to */
function movePawn(color: 'blk' | 'wh', currentPosition: number) {
  if (color === 'blk') {
    return [currentPosition - 8]
  }

  if (color === 'wh') {
    return [currentPosition + 8]
  }

  throw new Error('Invalid color provided');
}


