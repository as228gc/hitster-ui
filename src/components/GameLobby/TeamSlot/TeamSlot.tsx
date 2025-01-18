import apiClient from "../../../config/axiosConfig";
import { usePlayer } from "../../../context/PlayerContext";
import { Team } from "../../../datatypes/Team";
import "./TeamSlot.css";

interface TeamSlotProps {
  team: Team;
  onUpdateTeams: (updatedTeams: Team[]) => void; // Callback to update all teams
}

export const TeamSlot: React.FC<TeamSlotProps> = ({ team, onUpdateTeams }) => {
  const { player } = usePlayer();

  const handleJoin = async () => {
    try {
      console.log(`Joining team: ${team.id} with player: ${player?.id}`);

      // Add player to the team
      await apiClient.post(`/lobby/teams/${team.id}/add-player`, { playerId: player?.id });

      // Fetch the latest state of all teams
      const response = await apiClient.get<Team[]>("/lobby/teams");
      console.log("Updated teams data:", response.data);

      // Notify parent component to update all teams
      onUpdateTeams(response.data);
    } catch (error) {
      console.error("Error joining team:", error);
    }
  };

  return (
    <div
      className={`team-slot ${team.players.length ? "filled-team" : "empty-team"}`}
      onClick={handleJoin}
    >
      <h2>{team.name}</h2>
      <ul>
        {team.players.map((player) =>
          team.teamleader?.id === player.id ? null : (
            <li key={player.id}>{player.name}</li>
          )
        )}
      </ul>
    </div>
  );
};
