import React, { useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../../config/axiosConfig";

export const GameLobby: React.FC = () => {
  const [teamName, setTeamName] = useState("");
  const { player, clearPlayer } = usePlayer();
  const navigate = useNavigate()


  const handleStartGame = async () => {
    await fetch("/api/game/start", { method: "POST" });
  };

  const handleAddTeam = async () => {
    await fetch(`/api/game/add-team?teamName=${teamName}`, { method: "POST" });
    setTeamName(""); // Clear input after adding
  };

  const handleLeave = async () => {
    try {
      await apiClient.post("/lobby/players/remove", {
        id: player?.id
      }).then(() => {
        console.log("Player removed from lobby")
      })
      clearPlayer()
      navigate('/')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div>
      <h1>Game Lobby</h1>
      <button onClick={handleStartGame}>Start Game</button>
      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Enter team name"
      />
      <button onClick={handleAddTeam}>Add Team</button>
      <button onClick={handleLeave}>Leave lobby</button>
    </div>
  );
};
