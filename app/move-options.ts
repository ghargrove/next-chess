import { PieceId } from "./components/GamePiece";

const colorRegEx = /^(blk|wh)-.*$/
const pawnRegex = /^(blk|wh)-p([1-8])$/;

/** Calculate the spaces a piece can move to */
export function calculateGamePieceMoves(
  pieceId: PieceId,
  gameState: Record<PieceId, number>
): number[] {
  if (pawnRegex.test(pieceId)) {
    return movePawn(pieceId, gameState);
  }

  return [];
}

/** Determines which postitions a pawn can move to */
function movePawn(pieceId: PieceId, gameState: Record<PieceId, number>) {
  const currentPosition = gameState[pieceId]
  const pawnMatch = pawnRegex.exec(pieceId)

  // This should not happen. Make sure we handle this
  if (pawnMatch === null) {
    throw new Error('No pawn match found')
  }

  const [_, color] = pawnMatch

  const invertedPieces = new Map(Array.from(
    Object.entries(gameState) as [PieceId, number][]
  ).map<[number, PieceId]>(([k, v]) => [v, k]));

  const pieceMap = new Map(invertedPieces);

  if (color === "blk") {
    return [currentPosition + 8];
  }

  if (color === "wh") {
    const onePositionForward = currentPosition - 8
    const positions = [currentPosition - 8]

    // TODO: Deterine if their at a left boundary, right boundary, top boundary, bottom bondary

    // TODO: Determine if they're at the left boundary
    const pieceToLeft = invertedPieces.get(onePositionForward - 1)
    if (pieceToLeft) {
      const x = colorRegEx.exec(pieceToLeft)

      if (x !== null) {
        const [_, leftPieceColor] = x

        // If it's not the same color, we can move there
        if (leftPieceColor !== color) {
          positions.push(onePositionForward - 1)
        }
      }

      // Parse it. They can only capture the other players pieces
    }


    return positions.sort();
  }

  throw new Error("Invalid color provided");
}

function moveRook(currentPosition: number) {}
