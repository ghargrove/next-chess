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
const knightRegex = /^(blk|wh)-kn[1-2]$/;
const bishopRegex = /^(blk|wh)-b[1-2]$/;
const queenRegex = /^(blk|wh)-q$/;
const kingRegex = /^(blk|wh)-k$/;

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

  if (knightRegex.test(pieceId)) {
    return moveKnight(pieceId, gameState).sort();
  }

  if (bishopRegex.test(pieceId)) {
    return moveBishop(pieceId, gameState).sort();
  }

  if (queenRegex.test(pieceId)) {
    return [
      ...moveBishop(pieceId, gameState),
      ...moveRook(pieceId, gameState),
    ].sort();
  }

  if (kingRegex.test(pieceId)) {
    return moveKing(pieceId, gameState).sort();
  }

  return [];
}

// Determines which postitions a pawn can move to
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

// Determine which positions a knight can move to
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

  // Handle squares to the left
  if (!isOnLeftBoundary(currentPosition)) {
    let didBreakOnPiece = false;
    let nextLeftPosition = currentPosition - 1;

    while (!isOnLeftBoundary(nextLeftPosition)) {
      const pieceAtNextPosition = invertedPieces.get(nextLeftPosition);
      if (pieceAtNextPosition !== undefined) {
        if (!piecesBelongToSameTeam(pieceId, pieceAtNextPosition)) {
          positions.push(nextLeftPosition);
        }

        didBreakOnPiece = true;
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

        didBreakOnPiece = true;
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
    let didBreakOnPiece = false;
    let nextBottomPosition = currentPosition + 8;

    while (!isOnBottomBoundary(nextBottomPosition)) {
      const pieceAtNextPosition = invertedPieces.get(nextBottomPosition);
      if (pieceAtNextPosition !== undefined) {
        if (!piecesBelongToSameTeam(pieceId, pieceAtNextPosition)) {
          positions.push(nextBottomPosition);
        }

        didBreakOnPiece = true;

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

// Determine which positions a knight can move to
function moveKnight(
  pieceId: PieceId,
  gameState: Partial<Record<PieceId, number>>
): number[] {
  const positions: number[] = [];
  const currentPosition = gameState[pieceId];
  const invertedPieces = invertAndMapPieceState(gameState);

  if (currentPosition === undefined) {
    throw new Error("Piece trying to be moved is not active");
  }

  // Up one - Two left
  const upOneL = [
    currentPosition - 8 * 1,
    currentPosition - 8 * 1 - 1,
    currentPosition - 8 * 1 - 2,
  ];
  const upOneLBool = upOneL.map(
    (_i) => isOnTopBoundary(_i) || isOnLeftBoundary(_i)
  );

  if (upOneLBool.indexOf(true) <= -1 || upOneLBool.indexOf(true) >= 2) {
    const dest = upOneL[2];
    const pieceAtNextPosition = invertedPieces.get(dest);

    if (
      pieceAtNextPosition === undefined ||
      (pieceAtNextPosition !== undefined &&
        !piecesBelongToSameTeam(pieceId, pieceAtNextPosition))
    ) {
      positions.push(dest);
    }
  }

  // Up one - Two right
  const upOneR = [
    currentPosition - 8 * 1,
    currentPosition - 8 * 1 + 1,
    currentPosition - 8 * 1 + 2,
  ];
  const upOneRBool = upOneR.map(
    (_i) => isOnTopBoundary(_i) || isOnRightBoundary(_i)
  );
  if (upOneRBool.indexOf(true) <= -1 || upOneRBool.indexOf(true) >= 2) {
    const dest = upOneR[2];
    const pieceAtNextPosition = invertedPieces.get(dest);

    if (
      pieceAtNextPosition === undefined ||
      (pieceAtNextPosition !== undefined &&
        !piecesBelongToSameTeam(pieceId, pieceAtNextPosition))
    ) {
      positions.push(dest);
    }
  }

  // Down one - Two left
  const downOneL = [
    currentPosition + 8 * 1,
    currentPosition + 8 * 1 - 1,
    currentPosition + (8 * 1 - 2),
  ];
  const downOneLBool = downOneL.map(
    (_i) => isOnBottomBoundary(_i) || isOnLeftBoundary(_i)
  );
  if (downOneLBool.indexOf(true) <= -1 || downOneLBool.indexOf(true) >= 2) {
    const dest = downOneL[2];
    const pieceAtNextPosition = invertedPieces.get(dest);

    if (
      pieceAtNextPosition === undefined ||
      (pieceAtNextPosition !== undefined &&
        !piecesBelongToSameTeam(pieceId, pieceAtNextPosition))
    ) {
      positions.push(dest);
    }
  }

  // Down one - Two right
  const downOneR = [
    currentPosition + 8 * 1,
    currentPosition + 8 * 1 + 1,
    currentPosition + (8 * 1 + 2),
  ];
  const downOneRBool = downOneR.map(
    (_i) => isOnBottomBoundary(_i) || isOnRightBoundary(_i)
  );
  if (downOneRBool.indexOf(true) <= -1 || downOneRBool.indexOf(true) >= 2) {
    const dest = downOneR[2];
    const pieceAtNextPosition = invertedPieces.get(dest);

    if (
      pieceAtNextPosition === undefined ||
      (pieceAtNextPosition !== undefined &&
        !piecesBelongToSameTeam(pieceId, pieceAtNextPosition))
    ) {
      positions.push(dest);
    }
  }

  // Up two - One left
  const upTwoL = [
    currentPosition - 8 * 1,
    currentPosition - 8 * 2,
    currentPosition - (8 * 2 + 1),
  ];
  const upTwoLBool = upTwoL.map(
    (_i) => isOnTopBoundary(_i) || isOnLeftBoundary(_i)
  );
  if (upTwoLBool.indexOf(true) <= -1 || upTwoLBool.indexOf(true) >= 2) {
    const dest = upTwoL[2];
    const pieceAtNextPosition = invertedPieces.get(dest);

    if (
      pieceAtNextPosition === undefined ||
      (pieceAtNextPosition !== undefined &&
        !piecesBelongToSameTeam(pieceId, pieceAtNextPosition))
    ) {
      positions.push(dest);
    }
  }

  // Up two - One Right
  const upTwoR = [
    currentPosition - 8 * 1,
    currentPosition - 8 * 2,
    currentPosition - (8 * 2 - 1),
  ];
  const upTwoRBool = upTwoR.map(
    (_i) => isOnTopBoundary(_i) || isOnRightBoundary(_i)
  );
  if (upTwoRBool.indexOf(true) <= -1 || upTwoRBool.indexOf(true) >= 2) {
    const dest = upTwoR[2];
    const pieceAtNextPosition = invertedPieces.get(dest);

    if (
      pieceAtNextPosition === undefined ||
      (pieceAtNextPosition !== undefined &&
        !piecesBelongToSameTeam(pieceId, pieceAtNextPosition))
    ) {
      positions.push(dest);
    }
  }

  // Down two - One left
  const downTwoL = [
    currentPosition + 8 * 1,
    currentPosition + 8 * 2,
    currentPosition + (8 * 2 - 1),
  ];
  const downTwoLBool = downTwoL.map(
    (_i) => isOnBottomBoundary(_i) || isOnLeftBoundary(_i)
  );
  if (downTwoLBool.indexOf(true) <= -1 || downTwoLBool.indexOf(true) >= 2) {
    const dest = downTwoL[2];
    const pieceAtNextPosition = invertedPieces.get(dest);

    if (
      pieceAtNextPosition === undefined ||
      (pieceAtNextPosition !== undefined &&
        !piecesBelongToSameTeam(pieceId, pieceAtNextPosition))
    ) {
      positions.push(dest);
    }
  }

  // Down two - One right
  const downTwoR = [
    currentPosition + 8 * 1,
    currentPosition + 8 * 2,
    currentPosition + (8 * 2 + 1),
  ];
  const downTwoRBool = downTwoR.map(
    (_i) => isOnBottomBoundary(_i) || isOnRightBoundary(_i)
  );
  if (downTwoRBool.indexOf(true) <= -1 || downTwoRBool.indexOf(true) >= 2) {
    const dest = downTwoR[2];
    const pieceAtNextPosition = invertedPieces.get(dest);

    if (
      pieceAtNextPosition === undefined ||
      (pieceAtNextPosition !== undefined &&
        !piecesBelongToSameTeam(pieceId, pieceAtNextPosition))
    ) {
      positions.push(dest);
    }
  }

  return positions;
}

// Determine which positions a bishop
function moveBishop(
  pieceId: PieceId,
  gameState: Partial<Record<PieceId, number>>
): number[] {
  const positions: number[] = [];
  const currentPosition = gameState[pieceId];
  const invertedPieces = invertAndMapPieceState(gameState);

  if (currentPosition === undefined) {
    throw new Error("Piece trying to be moved is not active");
  }

  // Map the diagonal paths
  let leftTopPosition = currentPosition;
  let rightTopPosition = currentPosition;
  let leftBottomPosition = currentPosition;
  let rightBottomPosition = currentPosition;

  // top left
  let didBreak = false;
  while (!didBreak) {
    if (isOnLeftBoundary(leftTopPosition) || isOnTopBoundary(leftTopPosition)) {
      didBreak = true;
      break;
    }

    leftTopPosition = leftTopPosition - 8 * 1 - 1;
    const pieceAtNextPosition = invertedPieces.get(leftTopPosition);

    if (pieceAtNextPosition !== undefined) {
      if (piecesBelongToSameTeam(pieceAtNextPosition, pieceId)) {
        break;
      } else {
        positions.push(leftTopPosition);
        break;
      }
    }

    positions.push(leftTopPosition);
  }

  // top right
  didBreak = false;
  while (!didBreak) {
    if (
      isOnRightBoundary(rightTopPosition) ||
      isOnTopBoundary(rightTopPosition)
    ) {
      didBreak = true;
      break;
    }

    rightTopPosition = rightTopPosition - 8 * 1 + 1;
    const pieceAtNextPosition = invertedPieces.get(rightTopPosition);

    if (pieceAtNextPosition !== undefined) {
      if (piecesBelongToSameTeam(pieceAtNextPosition, pieceId)) {
        break;
      } else {
        positions.push(rightTopPosition);
        break;
      }
    }

    positions.push(rightTopPosition);
  }

  // bottom left
  didBreak = false;
  while (!didBreak) {
    if (
      isOnLeftBoundary(leftBottomPosition) ||
      isOnBottomBoundary(leftBottomPosition)
    ) {
      didBreak = true;
      break;
    }

    leftBottomPosition = leftBottomPosition + 8 * 1 - 1;
    const pieceAtNextPosition = invertedPieces.get(leftBottomPosition);

    if (pieceAtNextPosition !== undefined) {
      if (piecesBelongToSameTeam(pieceAtNextPosition, pieceId)) {
        break;
      } else {
        positions.push(leftBottomPosition);
        break;
      }
    }

    positions.push(leftBottomPosition);
  }

  // bottom right
  didBreak = false;
  while (!didBreak) {
    if (
      isOnRightBoundary(rightBottomPosition) ||
      isOnBottomBoundary(rightBottomPosition)
    ) {
      didBreak = true;
      break;
    }

    rightBottomPosition = rightBottomPosition + 8 * 1 + 1;
    const pieceAtNextPosition = invertedPieces.get(rightBottomPosition);

    if (pieceAtNextPosition !== undefined) {
      if (piecesBelongToSameTeam(pieceAtNextPosition, pieceId)) {
        break;
      } else {
        positions.push(rightBottomPosition);
        break;
      }
    }

    positions.push(rightBottomPosition);
  }

  return positions;
}

// Determine which positions a king can move to
function moveKing(
  pieceId: PieceId,
  gameState: Partial<Record<PieceId, number>>
): number[] {
  const currentPosition = gameState[pieceId];

  if (currentPosition === undefined) {
    throw new Error("Unknown position");
  }

  const queenMoves = [
    ...moveBishop(pieceId, gameState),
    ...moveRook(pieceId, gameState),
  ];

  const adjacentPositions = [
    currentPosition - 8,
    currentPosition - 8 + 1,
    currentPosition - 8 + -1,
    currentPosition + 8,
    currentPosition + 8 + 1,
    currentPosition + 8 - 1,
    currentPosition + 1,
    currentPosition - 1,
  ];

  // Filter all non-adjacent moves out of the queen path set
  return queenMoves.filter((pos) => adjacentPositions.includes(pos));
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
