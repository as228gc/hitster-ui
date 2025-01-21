import { Player } from "../../../datatypes/Player";
import "./PlayerDisplay.css";

interface PlayerDisplayProps {
  player: Player;
}

export const PlayerDisplay: React.FC<PlayerDisplayProps> = ({ player }) => {
  return (
    <div className="player-display">
      <span>{player.name}</span>
    </div>
  );
}