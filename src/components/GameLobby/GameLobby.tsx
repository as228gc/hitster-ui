import React, { useEffect, useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import "./GameLobby.css";
import { TeamSlot } from "./TeamSlot/TeamSlot";
import { disconnectSocket, initializeSocket, getSocket } from "../../config/socketConfig";
import apiClient from "../../config/axiosConfig";
import { Lobby } from "../../datatypes/Lobby";

export const GameLobby: React.FC = () => {
  const [lobby, setLobby] = useState<Lobby>({
    id: 0,
    players: [],
    teams: [],
  });

  const { player, clearPlayer } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!player) {
      navigate("/");
      return;
    }

    // Fetch initial teams from REST API
    const fetchTeams = async () => {
      try {
        const response = await apiClient.get("/lobby/teams");
        console.log("Initial teams fetched:", response.data);
        setLobby({...lobby, teams: response.data})
      } catch (error) {
        console.error("Error fetching initial teams:", error);
      }
    };

    fetchTeams();

    // Initialize WebSocket connection
    const socket = initializeSocket();

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      // Notify server of the player joining the lobby
      socket.emit("join-lobby", {
        playerId: player.id,
        playerName: player.name
      }, (ack: string) => {
        console.log(ack);
      });
    });

    socket.on("lobby-updated", (updatedLobby: Lobby) => {
      console.log("Lobby updated via WebSocket:", updatedLobby);
      setLobby({
        id: updatedLobby.id,
        players: updatedLobby.players,
        teams: updatedLobby.teams
      });
    });

    // Cleanup WebSocket connection on component unmount
    return () => {
      socket.emit("leave-lobby", {
        id: player?.id,
        name: player?.name,
      }, (ack: string) => {
        console.log(ack);
      });
      disconnectSocket();
    };
  }, [player, navigate]);

  const handleLeave = () => {
    getSocket().emit("leave-lobby", {
      playerId: player?.id,
      playerName: player?.name
    }, (ack: string) => {
      console.log(ack);
      console.log("Leaving lobby");
      clearPlayer();
      navigate("/");
    });
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
              {lobby.teams.length === 0 ? (
                <p>No teams available</p>
              ) : (
                lobby.teams.map((team) => <TeamSlot key={team.id} team={team} />)
              )}
            </div>
          </div>
          <div className="action-container">
            <h1 id="hitster-tag">HITSTER</h1>
            <h1>Game Lobby</h1>
          </div>
        </div>
      </div>
    </>
  );
};
