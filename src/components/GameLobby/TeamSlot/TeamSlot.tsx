import { getSocket } from "../../../config/socketConfig";
import { usePlayer } from "../../../context/PlayerContext";
import { Team } from "../../../datatypes/Team";
import { PlayerDisplay } from "../PlayerDisplay/PlayerDisplay";
import styles from "./TeamSlot.module.css";

interface TeamSlotProps {
  team: Team;
}

export const TeamSlot: React.FC<TeamSlotProps> = ({ team }) => {
  const { player } = usePlayer();
  const socket = getSocket();

  const handleJoin = () => {
    console.log(`Joining team: ${team.id} with player: ${player?.id}`);
    socket.emit(
      "join-team",
      {
        playerId: player?.id,
        teamId: team.id
      },
      (ack: string) => {
        console.log(ack);
      }
    );
  };

  return (
    <div
      className={`${styles.teamSlot} ${team.players.length ?
        styles.filledTeam :
        styles.emptyTeam
        }`}
      onClick={handleJoin}
    >
      <h2>{team.name}</h2>
      <ul>
        {team.players.map((player) => (
          <li key={player.id}>
            {team.teamleader?.id === player.id ? (
              <strong>{player.name}</strong>
            ) : (
              player.name
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
