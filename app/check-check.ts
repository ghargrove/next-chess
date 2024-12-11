import { PieceId } from "./components/GamePiece";
import { calculateGamePieceMoves, invertAndMapPieceState } from "./move-options";

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
      // What possible moves does the king have
      const kingsRemainingMoves = calculateGamePieceMoves(
        "blk-k",
        activePieces
      );
      
      // This is super long winded and inefficient, but works for now
      for (const remainingMove of kingsRemainingMoves) {
        const positionMap = invertAndMapPieceState(activePieces)
        // Simulate that move
        const keyToCheck = positionMap.get(remainingMove)
        const simGameBoard = { ...activePieces, "blk-k": remainingMove};
        if (keyToCheck !== undefined) {
          delete simGameBoard[keyToCheck]
        }

        // Search through the remaining pieces and see if the king has any moves left
        for (const gamePieceKey of Object.keys(simGameBoard).filter(
          (pieceKey) => pieceKey !== "bl-k" && pieceKey !== "wh-k"
        )) {
          const pieceMovesSet = new Set(calculateGamePieceMoves(gamePieceKey as PieceId, simGameBoard));
          const remainingMoveSet = new Set(kingsRemainingMoves);
          
          // Slice out shared moves
          for (const ent of pieceMovesSet.intersection(remainingMoveSet).values()) {
            kingsRemainingMoves.splice(kingsRemainingMoves.indexOf(ent), 1);
          }
        }
  
      }

      return ["black", kingsRemainingMoves.length === 0];
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
