import React, { useEffect, useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../../config/axiosConfig";
import "./GameLobby.css";
import TeamMembers from "./TeamMembers/TeamMembers";
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
  teamleader: Player;
}

export const GameLobby: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const { player, clearPlayer } = usePlayer();
  const navigate = useNavigate();
  // create a fixed array of 8 teams

  useEffect(() => {
    if (!player) {
      navigate("/");
    }

    const fetchTeams = async () => {
      try {
        const response = await apiClient.get("/lobby/teams");
        console.log("Teams from backend:", response.data);
        setTeams(response.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchTeams();
  }, [player, navigate]);

  const handleStartGame = async () => {
    await fetch("/api/game/start", { method: "POST" });
  };

  const handleAddTeam = async () => {
    navigate("/lobby/create-team");
  };

  const handleLeave = async () => {
    try {
      await apiClient
        .post("/lobby/players/remove", {
          id: player?.id,
        })
        .then(() => {
          console.log("Player removed from lobby");
        });
      clearPlayer();
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="lobby-container">
      <div className="game-lobby-container">
        <div className="teams-container">
          <TeamSlot></TeamSlot>
          <TeamSlot></TeamSlot>
          <TeamSlot></TeamSlot>
          <TeamSlot></TeamSlot>
          <TeamSlot></TeamSlot>
          <TeamSlot></TeamSlot>
          <TeamSlot></TeamSlot>
          <TeamSlot></TeamSlot>
          <button onClick={handleLeave}>Leave lobby</button>
        </div>
        <div className="action-container">
          <h1>Game Lobby</h1>
          <button onClick={handleStartGame}>Start Game</button>
          <button onClick={handleAddTeam}>Add Team</button>
          
          <button></button>
        </div>
        {/* <TeamMembers teams={teams} /> */}
      </div>
    </div>
  );
};
