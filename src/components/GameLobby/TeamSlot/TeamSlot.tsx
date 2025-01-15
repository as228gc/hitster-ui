import apiClient from "../../../config/axiosConfig";
import { usePlayer } from "../../../context/PlayerContext";
import { Team } from "../../../datatypes/Team";
import "./TeamSlot.css";

interface TeamSlotProps {
  team: Team;
  onUpdate: (updatedTeam: Team) => void; // Callback to update the parent state
}

export const TeamSlot: React.FC<TeamSlotProps> = ({ team, onUpdate }) => {
  const { player } = usePlayer();

  const handleJoin = async () => {
    try {
      console.log(`Joining team: ${team.id} with player: ${player?.id}`);

      // Post request to add player to the team
      await apiClient.post(`/lobby/teams/${team.id}/add-player`, { playerId: player?.id });

      // Fetch updated team data
      const response = await apiClient.get<Team>(`/lobby/teams/${team.id}`);
      console.log("Updated team:", response.data);

      // Notify parent component of the update
      onUpdate(response.data);
    } catch (error) {
      console.error("Error joining team:", error);
    }
  };

  return (
    <div
      className={`team-slot ${team.players.length ? "filled-team" : "empty-team"}`}
      onClick={handleJoin}
    >
      {team.players.length ? (
        <>
          <h2>{team.name}</h2>
          <ul>
            {team.players.map((player) =>
              team.teamleader?.id === player.id ? null : (
                <li key={player.id}>{player.name}</li>
              )
            )}
          </ul>
        </>
      ) : (
        <p>Empty</p>
      )}
    </div>
  );
};
