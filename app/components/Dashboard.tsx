import { PieceId } from "./GamePiece";
import { GamePiece } from "./GamePiece";

interface DashboardProps {
  capturedPieces: PieceId[];
}

/** Presents game information */
export const Dashboard: React.FC<DashboardProps> = (props) => {
  const { capturedPieces } = props;

  // Group out the captured pieces so they can be rendered together
  const [whitePieces, blackPieces] = capturedPieces.reduce<
    [PieceId[], PieceId[]]
  >(
    (m, pieceId) => {
      // Grab the white and black pieces id lists off the memo
      const [w, b] = m;

      if (/^wh/.test(pieceId)) {
        return [[...w, pieceId], b];
      }

      if (/^blk/.test(pieceId)) {
        return [w, [...b, pieceId]];
      }

      return m;
    },
    [[], []]
  );

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Chess</h1>
      <div className="dashboard-captures">
        <div className="white-captures">
          <h2>White</h2>
          <div className="piece-group">
            {blackPieces.map((pieceId) => (
              <GamePiece key={pieceId} pieceId={pieceId} />
            ))}
          </div>
        </div>

        <div className="black-captures">
          <h2>Black</h2>
          <div className="piece-group">
            {whitePieces.map((pieceId) => (
              <GamePiece key={pieceId} pieceId={pieceId} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
