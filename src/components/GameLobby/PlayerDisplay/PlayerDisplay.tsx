import { Player } from "../../../datatypes/Player";
import styles from "./PlayerDisplay.module.css"

interface PlayerDisplayProps {
  player: Player;
}

export const PlayerDisplay: React.FC<PlayerDisplayProps> = ({ player }) => {
  return (
    <div className={styles.playerDisplay}>
      <span>{player.name}</span>
    </div>
  );
}