import { PieceId } from "./components/GamePiece";
import { calculateGamePieceMoves } from "./move-options";

/**
 * Given the state of the game. Determine if either king are in check.
 *
 * The second boolean value will indcate if the check represents checkmate
 */
export function areKingsInCheck(
  activePieces: Partial<Record<PieceId, number>>
): ["black" | "white" | "none", boolean] {
  // I'm casting these becase they are always there. If they weren't the game would be over
  const blackKingPosition = activePieces["blk-k"] as number;
  const whiteKingPosition = activePieces["wh-k"] as number;

  // Determine if any of the existing game pieces can strike the king pieces
  for (const gamePieceKey of Object.keys(activePieces).filter(
    (pieceKey) => pieceKey !== "bl-k" && pieceKey !== "wh-k"
  )) {
    const availableMoves = calculateGamePieceMoves(
      gamePieceKey as PieceId,
      activePieces
    );

    if (availableMoves.includes(blackKingPosition)) {
      return [
        "black",
        calculateGamePieceMoves("blk-k", activePieces).length <= 1,
      ];
    }

    if (availableMoves.includes(whiteKingPosition)) {
      return [
        "white",
        calculateGamePieceMoves("wh-k", activePieces).length === 0,
      ];
    }
  }

  return ["none", false];
}
