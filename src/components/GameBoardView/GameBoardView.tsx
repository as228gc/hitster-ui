import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initializeSocket, disconnectSocket } from "../../config/socketConfig";
import apiClient from "../../config/axiosConfig";
import { Team } from "../../datatypes/Team";
import { usePlayer } from "../../context/PlayerContext";
import styles from "./GameBoardView.module.css";
import { TeamTimeline } from "./TeamTimeline/TeamTimeline";

export const GameBoardView: React.FC = () => {
  const { player } = usePlayer();
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [currentRound, setCurrentRound] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!player) {
      navigate("/");
      return;
    }

    const fetchGameState = async () => {
      try {
        const response = await apiClient.get("/api/game/state");
        const { teams: fetchedTeams, currentRound, activeTeamId } = response.data;

        setTeams(fetchedTeams);
        setCurrentRound(currentRound);

        // Set the active team
        const active = fetchedTeams.find((team: Team) => team.id === activeTeamId);
        setActiveTeam(active || null);
      } catch (error) {
        console.error("Error fetching game state:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const setupSocket = async () => {
      const socket = await initializeSocket();

      socket.on("game-state-updated", (gameState) => {
        console.log("Game state updated via WebSocket:", gameState);

        const { teams: updatedTeams, currentRound, activeTeamId } = gameState;

        setTeams(updatedTeams);
        setCurrentRound(currentRound);

        // Set the active team
        const active = updatedTeams.find((team: Team) => team.id === activeTeamId);
        setActiveTeam(active || null);
      });
    };

    setupSocket();
    fetchGameState();

    return () => {
      disconnectSocket();
    };
  }, [player, navigate]);

  const handleGameEnd = async () => {
    try {
      await apiClient.post("/api/game/end");
      navigate("/");
    } catch (error) {
      console.error("Error ending game:", error);
    }
  };

  if (isLoading) {
    return <div>Loading game data...</div>;
  }

  if (!activeTeam) {
    return <div>Unable to find your team. Please try rejoining the game.</div>;
  }

  return (
    <div className={styles.gameBoardView}>
      <h1>Game Board</h1>
      <h2>Round: {currentRound}</h2>
      <h3>Active Team: {activeTeam.name}</h3>

      {/* Display Active Team Timeline */}
      <div className={styles.activeTeamSection}>
        <h3>Your Team's Timeline</h3>
        <TeamTimeline team={activeTeam} />
      </div>

      {/* Display Other Teams */}
      <div className={styles.otherTeamsSection}>
        <h3>Other Teams</h3>
        {teams
          .filter((team) => team.id !== activeTeam.id)
          .map((team) => (
            <div key={team.id} className={styles.teamSection}>
              <h4>{team.name}</h4>
              <TeamTimeline team={team} />
            </div>
          ))}
      </div>

      <button onClick={handleGameEnd}>End Game</button>
    </div>
  );
};
