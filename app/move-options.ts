import { PieceId } from "./components/GamePiece";
import { isOnLeftBoundary, isOnRightBoundary } from "./boundary-checks";

const colorRegEx = /^(blk|wh)-.*$/;
const pawnRegex = /^(blk|wh)-p([1-8])$/;

/**
 * Inverts the key/value pairs from the active pieces hash and converts to a Map
 * to make it easy to check
 */
export function invertAndMapPieceState(activePieces: Partial<Record<PieceId, number>>): Map<number, PieceId> {
  return new Map(
    Array.from(Object.entries(activePieces) as [PieceId, number][]).map<
      [number, PieceId]
    >(([k, v]) => [v, k])
  );
}

/** Calculate the spaces a piece can move to */
export function calculateGamePieceMoves(
  pieceId: PieceId,
  gameState: Partial<Record<PieceId, number>>
): number[] {
  if (pawnRegex.test(pieceId)) {
    return movePawn(pieceId, gameState).sort();
  }

  return [];
}

/** Determines which postitions a pawn can move to */
function movePawn(pieceId: PieceId, gameState: Partial<Record<PieceId, number>>): number[] {
  const currentPosition = gameState[pieceId];

  if (currentPosition === undefined) {
    throw new Error('Piece trying to be moved is not active')
  }

  const pawnMatch = pawnRegex.exec(pieceId);

  // This should not happen. Make sure we handle this
  if (pawnMatch === null) {
    throw new Error("No pawn match found");
  }

  const [_, color] = pawnMatch;
  const invertedPieces = invertAndMapPieceState(gameState)

  if (color === "blk") {
    const onePositionForward = currentPosition + 8;
    
    // If there is a piece in the position directly in front of the pawn, then
    // do not allow them to move one position forward
    const positions = invertedPieces.has(onePositionForward) ? [] : [onePositionForward];

    // Don't try to capture to the left if we're on the left boundary
    if (!isOnLeftBoundary(currentPosition)) {
      const pieceToLeft = invertedPieces.get(onePositionForward - 1);
      if (pieceToLeft) {
        const x = colorRegEx.exec(pieceToLeft);

        if (x !== null) {
          const [_, leftPieceColor] = x;

          // If it's not the same color, we can move there
          if (leftPieceColor !== color) {
            positions.push(onePositionForward - 1);
          }
        }
      }
    }

    if (!isOnRightBoundary(currentPosition)) {
      const pieceToRight = invertedPieces.get(onePositionForward + 1);
      if (pieceToRight) {
        const x = colorRegEx.exec(pieceToRight);
  
        if (x !== null) {
          const [_, rightPieceColor] = x;
  
          // If it's not the same color, we can move there
          if (rightPieceColor !== color) {
            positions.push(onePositionForward + 1);
          }
        }
      }
  
    }
    
    return positions;
  }

  if (color === "wh") {
    const onePositionForward = currentPosition - 8;

    // If there is a piece in the position directly in front of the pawn, then
    // do not allow them to move one position forward
    const positions = invertedPieces.has(onePositionForward) ? [] : [currentPosition - 8];

    if (!isOnLeftBoundary(currentPosition)) {
      const pieceToLeft = invertedPieces.get(onePositionForward - 1);
      if (pieceToLeft) {
        const x = colorRegEx.exec(pieceToLeft);
  
        if (x !== null) {
          const [_, leftPieceColor] = x;
  
          // If it's not the same color, we can move there
          if (leftPieceColor !== color) {
            positions.push(onePositionForward - 1);
          }
        }
      }
    }
    

    if (!isOnRightBoundary(currentPosition)) {
      const pieceToRight = invertedPieces.get(onePositionForward + 1);
      if (pieceToRight) {
        const x = colorRegEx.exec(pieceToRight);
  
        if (x !== null) {
          const [_, rightPieceColor] = x;
  
          // If it's not the same color, we can move there
          if (rightPieceColor !== color) {
            positions.push(onePositionForward + 1);
          }
        }
      }
    }
    

    return positions;
  }

  throw new Error("Invalid color provided");
}

function moveRook(currentPosition: number) {}
