import { PieceId } from "./components/GamePiece";
import {
  calculateGamePieceMoves,
  invertAndMapPieceState,
} from "./move-options";
import { pieceWeights } from "./piece-weights";
import { State } from "./reducer";

/**
 * Describe a move for a given piece
 * 0 = piece to move
 * 1 = space to move to
 * 2 = piece that would be captured at that space (optional)
 * 3 = value of optional captured piece
 */
type MoveSet = [PieceId, number, PieceId | null, number];

/**
 * Get the black players best next move based on the state
 * of the active pieces in play.
 *
 * This method isn't _super_ smart. It will just choose a random
 * move from a set of the impactful
 */
export function findNextBestMove(
  activePieces: State["activePieces"]
): [PieceId, number, PieceId | null] {
  const pieceMap = invertAndMapPieceState(activePieces);
  const blackPieces = Object.keys(activePieces).filter((pieceId) =>
    /blk/.test(pieceId)
  );

  const moveSets: Array<MoveSet> = [];

  for (const piece of blackPieces) {
    const possibleMoves = calculateGamePieceMoves(
      piece as PieceId,
      activePieces
    );
    // If the piece can't move then go to the next piece
    if (possibleMoves.length === 0) {
      continue;
    }

    // [black piece, space to move to, piece it would capture, the captured value]

    for (const move of possibleMoves) {
      const possibleCapturePiece = pieceMap.get(move);
      // If there is no piece, its worth nothing
      if (possibleCapturePiece === undefined) {
        moveSets.push([piece as PieceId, move, null, 0]);
      } else {
        try {
          const [_, pieceSlug] = /^wh-([a-z]+)\d{0,2}$/.exec(
            possibleCapturePiece
          )!;
          const score = pieceWeights[pieceSlug as keyof typeof pieceWeights];

          moveSets.push([piece as PieceId, move, possibleCapturePiece, score]);
        } catch (e) {
          console.log(
            "This shouldnt happen, but going to catch incase the destruct fails",
            e
          );

          moveSets.push([piece as PieceId, move, null, 0]);
        }
      }
    }
  }

  // Group these into an array where < index == more value
  // Grab a random value from the 0 index and move there
  // [
  //   [
  //     ['blk-b2', 40, 'wh-p1', 1]
  //   ],
  //   [
  //     ['blk-p1', 24, null, 0],
  //     ['blk-p3', 26, null, 0]
  //   ]
  // ]
  const moveSetMap: Map<number, MoveSet[]> = new Map();
  for (const moveSet of moveSets) {
    // Get the array of moves corresponding w/ this score
    const scoreGroup = moveSetMap.get(moveSet[3]);

    // If The score group doesn't exist, then create one
    if (scoreGroup === undefined) {
      moveSetMap.set(moveSet[3], [moveSet]);
    } else {
      moveSetMap.set(moveSet[3], [...scoreGroup, moveSet]);
    }
  }

  const [bestMoves] = Array.from(moveSetMap.keys())
    .sort()
    .reverse()
    .map((score) => moveSetMap.get(score) as Array<MoveSet>);

  const [pieceToMove, nextPosition, pieceToCapture] =
    bestMoves[Math.floor(Math.random() * bestMoves.length)];

  return [pieceToMove, nextPosition, pieceToCapture];
}
