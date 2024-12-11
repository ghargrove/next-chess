
import { PieceId } from "./GamePiece";
import { GamePiece } from "./GamePiece";

interface DashboardProps {
  capturesPieces: PieceId[]
}

/** Presents game information */
export const Dashboard: React.FC = () => {
  
  // Group them

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Chess</h1>
      <div className="dashboard-captures">
        <div className="white-captures">
          <h2>White</h2>
        </div>

        <div className="black-captures">
          <h2>Black</h2>
        </div>
      </div>
    </div>
  );
};
