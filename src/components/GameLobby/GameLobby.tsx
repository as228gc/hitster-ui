import React, { useEffect, useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import "./GameLobby.css";
import { TeamSlot } from "./TeamSlot/TeamSlot";
import { disconnectSocket, initializeSocket, getSocket } from "../../config/socketConfig";
import { Player } from "../../datatypes/Player";
import apiClient from "../../config/axiosConfig";

interface Team {
  id: number;
  name: string;
  timeline: null | any;
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
      return;
    }

    // Fetch initial teams from REST API
    const fetchTeams = async () => {
      try {
        const response = await apiClient.get("/lobby/teams"); // Adjust the endpoint if needed
        console.log("Initial teams fetched:", response.data);
        setTeams(response.data);
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
      socket.emit("join-lobby", player, (ack: string) => {
        console.log(ack);
      });
    });

    // Handle real-time updates for teams
    socket.on("team-updated", (updatedTeams: Team[]) => {
      console.log("Team updated via WebSocket:", updatedTeams);
      setTeams(updatedTeams);
    });

    socket.on("lobby-updated", (updatedTeams: Team[]) => {
      console.log("Lobby updated via WebSocket:", updatedTeams);
      setTeams(updatedTeams);
    });

    // Cleanup WebSocket connection on component unmount
    return () => {
      socket.emit("leave-lobby", player?.id, (ack: string) => {
        console.log(ack);
      });
      disconnectSocket();
    };
  }, [player, navigate]);

  const handleLeave = () => {
    getSocket().emit("leave-lobby", player?.id, (ack: string) => {
      console.log(ack);
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
              {teams.length === 0 ? (
                <p>No teams available</p>
              ) : (
                teams.map((team) => <TeamSlot key={team.id} team={team} />)
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
