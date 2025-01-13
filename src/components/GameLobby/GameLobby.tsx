import React, { useEffect, useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../../config/axiosConfig";
import { Player } from "../../datatypes/Player";
import { Team } from "../../datatypes/Team";
import "./GameLobby.css";

export const GameLobby: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const { player, clearPlayer } = usePlayer();
  const navigate = useNavigate()

  useEffect(() => {
    if (!player) {
      clearPlayer()
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
    console.log("Teams:", teams)
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
    <>
      <div className="game-lobby-container">
        <h1>Game Lobby</h1>
        <button onClick={handleStartGame}>Start Game</button>
        <button onClick={handleAddTeam}>Add Team</button>
        <button onClick={handleLeave}>Leave lobby</button>
      </div>
      {teams.length === 0 && <p>No teams available</p>}
      {teams.length > 0 ?
        <div className="teams-container">
          {teams.map((team) => (
            <div key={team.id} className="team">
              <h2>{team.name}</h2>
              <p>Leader: {team.leader ? team.leader.name : "No leader assigned"}</p>
              <ul>
                {team.players.map((member) => (
                  <li key={member.id}>{member.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        :
        <p>No teams available</p>
      }


    </>
  );
};
