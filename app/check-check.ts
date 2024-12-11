import { PieceId } from "./components/GamePiece";
import { calculateGamePieceMoves } from "./move-options";

/** Given the state of the game. Determine if either king are in check */
export function areKingsInCheck(
  activePieces: Partial<Record<PieceId, number>>
): Array<"black" | "white" | "none"> {
  const inCheck: Array<"black" | "white" | "none"> = []
  
  // I'm casting these becase they are always there. If they weren't the game would be over
  const blackKingPosition = activePieces["blk-k"] as number;
  const whiteKingPosition = activePieces["wh-k"] as number;

  // 
  for (const gamePieceKey of Object.keys(activePieces).filter(pieceKey => pieceKey !== 'bl-k' && pieceKey !== 'wh-k')) {
    const availableMoves = calculateGamePieceMoves(gamePieceKey as PieceId, activePieces)

    if (availableMoves.includes(blackKingPosition)) {
      inCheck.push('black')
    }

    if (availableMoves.includes(whiteKingPosition)) {
      inCheck.push('white')
    }
  }
  
  return inCheck.length === 0 ? ['none'] : inCheck;
}
