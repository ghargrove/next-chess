
import { initialState } from "./data";
import { PieceId } from "./components/GamePiece";
import { areKingsInCheck } from "./check-check";

/** Represents game state */
export interface State {
  activePieces: Partial<typeof initialState>;
  capturedPieces: PieceId[];
  inCheck: "black" | "white" | null;
  inCheckMate: boolean;
  turn: "black" | "white";
}

/** Represents actions performed during the game */
type Action =
  | {
      pieceCaptured?: PieceId;
      pieceId: PieceId;
      position: number;
      type: "UPDATE_PIECE_POSITION";
    }
  | {
      type: "RESET_GAME";
    };

// State reducer
export function reducer(state: State, action: Action): State {
  if (action.type === "UPDATE_PIECE_POSITION") {
    const { pieceCaptured, pieceId, position } = action;

    // Duplicate the active pieces state so that we can remove any capture pieces
    const activePieceDup = { ...state.activePieces };
    if (pieceCaptured !== undefined) {
      delete activePieceDup[pieceCaptured];
    }

    const nextActivePieces = {
      ...activePieceDup,
      [pieceId]: position,
    };

    // Given the next state of the board, determine if the kings are in check
    const [kingColor, isCheckmate] = areKingsInCheck(nextActivePieces);
    let inCheck: "black" | "white" | null = null;
    if (kingColor === "black") {
      inCheck = "black";
    } else if (kingColor === "white") {
      inCheck = "white";
    }

    return {
      ...state,
      activePieces: nextActivePieces,
      capturedPieces: [
        ...state.capturedPieces,
        ...(pieceCaptured !== undefined ? [pieceCaptured] : []),
      ],
      inCheck,
      inCheckMate: isCheckmate,
      turn: state.turn === "black" ? "white" : "black",
    };
  }

  if (action.type === "RESET_GAME") {
    return {
      ...state,
      activePieces: initialState,
      capturedPieces: [],
      inCheck: null,
      inCheckMate: false,
      turn: "white",
    };
  }

  return state;
}
