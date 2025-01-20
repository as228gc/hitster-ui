import { getSocket } from "../../../config/socketConfig";
import { usePlayer } from "../../../context/PlayerContext";
import { Team } from "../../../datatypes/Team";
import "./TeamSlot.css";

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
      className={`team-slot ${team.players.length ? "filled-team" : "empty-team"}`}
      onClick={handleJoin}
    >
      <h2>{team.name}</h2>
      <ul>
        {team.players.map((player) =>
          team.teamleader?.id === player.id ? (
            <li key={player.id}>
              <strong>{player.name}</strong>
            </li>
          ) : (
            <li key={player.id}>{player.name}</li>
          )
        )}
      </ul>
    </div>
  );
};
