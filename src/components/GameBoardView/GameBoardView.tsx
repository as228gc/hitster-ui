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
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (!player) {
      navigate("/");
      return;
    }

    const fetchTeams = async () => {
      try {
        const response = await apiClient.get("/api/game/state");
        console.log("Teams fetched:", response.data);
        setTeams(response.data);

        // Find the current player's team
        const playerTeam = response.data.find((team: Team) =>
          team.players.some((teamPlayer) => teamPlayer.id === player.id)
        );

        if (playerTeam) {
          setCurrentTeam(playerTeam);
        } else {
          console.warn("Player is not assigned to any team.");
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();

    // Cleanup WebSocket connection on unmount
    initializeSocket();
    return () => {
      disconnectSocket();
    };
  }, [player, navigate]);

  if (!currentTeam) {
    return <div>Loading your team's timeline...</div>;
  }

  const handleGameEnd = async () => {
    try {
      await apiClient.post("/api/game/end");
      navigate("/");
    } catch (error) {
      console.error("Error ending game:", error);
    }
  }

  return (
    <div className={styles.gameBoardView}>
      <h1>Game Board</h1>
      <h2>Team: {currentTeam.name}</h2>

      <TeamTimeline team={currentTeam} />
      


      <button onClick={handleGameEnd}>End game</button>
    </div>
  );
};
