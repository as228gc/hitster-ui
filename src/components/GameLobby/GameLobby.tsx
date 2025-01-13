import React, { useEffect, useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../../config/axiosConfig";
import "./GameLobby.css";

interface Team {
  id: string
  name: string
  leader: Player
  members: Player[]
}

interface Player {
  id: string;
  name: string;
}

export const GameLobby: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const { player, clearPlayer } = usePlayer();
  const navigate = useNavigate()

  useEffect(() => {
    if (!player) {
      navigate('/')
    }

    const fetchTeams = async () => {
      try {
        const response = await apiClient.get("/lobby/teams");
        console.log("Teams:", response.data);
        setTeams(response.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchTeams();
  }, [player, navigate])


  const handleStartGame = async () => {
    await fetch("/api/game/start", { method: "POST" });
  };

  const handleAddTeam = async () => {
    navigate('/lobby/create-team')
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
    <div className="game-lobby-container">
      <h1>Game Lobby</h1>
      <button onClick={handleStartGame}>Start Game</button>
      <button onClick={handleAddTeam}>Add Team</button>
      <button onClick={handleLeave}>Leave lobby</button>
    </div>
  );
};
