import { PieceId } from "./components/GamePiece";
import {
  isOnBottomBoundary,
  isOnLeftBoundary,
  isOnRightBoundary,
  isOnTopBoundary,
} from "./boundary-checks";
const colorRegEx = /^(blk|wh)-.*$/;
const pawnRegex = /^(blk|wh)-p([1-8])$/;
const rookRegex = /^(blk|wh)-r[1-2]$/;

/**
 * Inverts the key/value pairs from the active pieces hash and converts to a Map
 * to make it easy to check
 */
export function invertAndMapPieceState(
  activePieces: Partial<Record<PieceId, number>>
): Map<number, PieceId> {
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

  if (rookRegex.test(pieceId)) {
    return moveRook(pieceId, gameState).sort();
  }

  return [];
}

/** Determines which postitions a pawn can move to */
function movePawn(
  pieceId: PieceId,
  gameState: Partial<Record<PieceId, number>>
): number[] {
  const currentPosition = gameState[pieceId];

  if (currentPosition === undefined) {
    throw new Error("Piece trying to be moved is not active");
  }

  const pawnMatch = pawnRegex.exec(pieceId);

  // This should not happen. Make sure we handle this
  if (pawnMatch === null) {
    throw new Error("No pawn match found");
  }

  const [_, color] = pawnMatch;
  const invertedPieces = invertAndMapPieceState(gameState);

  if (color === "blk") {
    const onePositionForward = currentPosition + 8;

    // If there is a piece in the position directly in front of the pawn, then
    // do not allow them to move one position forward
    const positions = invertedPieces.has(onePositionForward)
      ? []
      : [onePositionForward];

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
    const positions = invertedPieces.has(onePositionForward)
      ? []
      : [currentPosition - 8];

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

function moveRook(
  pieceId: PieceId,
  gameState: Partial<Record<PieceId, number>>
): number[] {
  const positions: number[] = [];
  const currentPosition = gameState[pieceId];
  const invertedPieces = invertAndMapPieceState(gameState);

  if (currentPosition === undefined) {
    throw new Error("Piece trying to be moved is not active");
  }

  // Get the color from the rook
  const rookMatch = rookRegex.exec(pieceId);
  if (rookMatch === null) {
    throw new Error("No pawn match found");
  }

  const [_, color] = rookMatch;

  // Handle squares to the left
  if (!isOnLeftBoundary(currentPosition)) {
    let didBreakOnPiece = false
    let nextLeftPosition = currentPosition - 1;

    while (!isOnLeftBoundary(nextLeftPosition)) {
      const pieceAtNextPosition = invertedPieces.get(nextLeftPosition);
      if (pieceAtNextPosition !== undefined) {
        if (!piecesBelongToSameTeam(pieceId, pieceAtNextPosition)) {
          positions.push(nextLeftPosition);
        }

        didBreakOnPiece = true
        break;
      }

      positions.push(nextLeftPosition--);
    }

    // Once we're on the left boundary we're going to bail. Add the left boundary item here
    if (!didBreakOnPiece) {
      positions.push(nextLeftPosition--);
    }
  }

  // Handle squares to the right
  if (!isOnRightBoundary(currentPosition)) {
    let didBreakOnPiece = false;
    let nextRightPosition = currentPosition + 1;

    while (!isOnRightBoundary(nextRightPosition)) {
      const pieceAtNextPosition = invertedPieces.get(nextRightPosition);
      if (pieceAtNextPosition !== undefined) {
        if (!piecesBelongToSameTeam(pieceId, pieceAtNextPosition)) {
          positions.push(nextRightPosition);
        }

        didBreakOnPiece = true
        break;
      }

      positions.push(nextRightPosition++);
    }

    if (!didBreakOnPiece) {
      positions.push(nextRightPosition++);
    }
  }

  // Handle vertical up
  if (!isOnTopBoundary(currentPosition)) {
    let didBreakOnPiece = false;
    let nextTopPosition = currentPosition - 8;

    while (!isOnTopBoundary(nextTopPosition)) {
      // Determine if there is a piece at the next position and whether its
      // ours or not
      const pieceAtNextPosition = invertedPieces.get(nextTopPosition);
      if (pieceAtNextPosition !== undefined) {
        if (!piecesBelongToSameTeam(pieceId, pieceAtNextPosition)) {
          positions.push(nextTopPosition);
        }

        didBreakOnPiece = true;
        break;
      }

      positions.push(nextTopPosition);

      nextTopPosition -= 8;
    }

    if (!didBreakOnPiece) {
      positions.push(nextTopPosition - 8);
    }
  }

  // Handle vertican down
  if (!isOnBottomBoundary(currentPosition)) {
    let didBreakOnPiece = false
    let nextBottomPosition = currentPosition + 8;

    while (!isOnBottomBoundary(nextBottomPosition)) {
      const pieceAtNextPosition = invertedPieces.get(nextBottomPosition);
      if (pieceAtNextPosition !== undefined) {
        if (!piecesBelongToSameTeam(pieceId, pieceAtNextPosition)) {
          positions.push(nextBottomPosition);
        }
        
        didBreakOnPiece = true

        break;
      }

      positions.push(nextBottomPosition);
      nextBottomPosition += 8;
    }

    if (!didBreakOnPiece) {
      positions.push(nextBottomPosition + 8);
    }
  }

  return positions;
}

// Get a color from a piece id
function piecesBelongToSameTeam(pieceIdA: PieceId, pieceIdB: PieceId): boolean {
  const colorRegex = /^(blk|wh)/;
  const parsedPieceIdA = colorRegex.exec(pieceIdA);
  const parsedPieceIdB = colorRegex.exec(pieceIdB);

  if (parsedPieceIdA === null || parsedPieceIdB === null) {
    throw new Error("Invalid piece ids");
  }

  const [_, colorA] = parsedPieceIdA;
  const [__, colorB] = parsedPieceIdB;

  return colorA === colorB;
}
