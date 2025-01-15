import React, { useEffect, useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../../config/axiosConfig";
import "./GameLobby.css";
import { TeamSlot } from "./TeamSlot/TeamSlot";

interface Player {
  id: number;
  name: string;
}

interface Team {
  id: number;
  name: string;
  timeline: null | any; // Replace `any` with the correct type if needed
  players: Player[];
  teamleader: Player | null;
}

export const GameLobby: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const { player, clearPlayer } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!player) {
      navigate("/");
    }

    const fetchTeams = async () => {
      try {
        const response = await apiClient.get("/lobby/teams");
        console.log("Teams from backend:", response.data);
        setTeams(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, [player, navigate]);

  const updateTeam = (updatedTeam: Team) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === updatedTeam.id ? updatedTeam : team
      )
    );
  };

  const handleStartGame = async () => {
    try {
      await apiClient.post("/api/game/start");
      console.log("Game started");
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  const handleLeave = async () => {
    try {
      await apiClient.post("/lobby/players/remove", { id: player?.id });
      console.log("Player removed from lobby");
      clearPlayer();
      navigate("/");
    } catch (error) {
      console.error("Error leaving lobby:", error);
    }
  };

  return (
    <>
      <button className="leave-button" onClick={handleLeave}>
        <div className="door">
          <div className="door-frame"></div>
          <div className="door-panel"></div>
        </div>
      </button>
      <div className="lobby-container">
        <div className="game-lobby-container">
          <div className="flex center column">
            <div className="teams-container">
              {teams.length === 0 ? (
                <p>No teams available</p>
              ) : (
                teams.map((team) => (
                  <TeamSlot key={team.id} team={team} onUpdate={updateTeam} />
                ))
              )}
            </div>
          </div>
          <div className="action-container">
            <h1 id="hitster-tag">HITSTER</h1>
            <h1>Game Lobby</h1>
            <button className="start-game-button" onClick={handleStartGame}>
              Start Game
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
