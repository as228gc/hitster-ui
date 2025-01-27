import React, { useEffect, useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import styles from "./GameLobbyView.module.css";
import { TeamSlot } from "./TeamSlot/TeamSlot";
import { disconnectSocket, initializeSocket, getSocket } from "../../config/socketConfig";
import apiClient from "../../config/axiosConfig";
import { Lobby } from "../../datatypes/Lobby";
import { PlayerDisplay } from "./PlayerDisplay/PlayerDisplay";
import { Team } from "../../datatypes/Team";
import { LeaveButton } from "../buttons/LeaveButton/LeaveButton";
import { Player } from "../../datatypes/Player";

export const GameLobbyView: React.FC = () => {
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

    const fetchLobby = async () => {
      try {
        const response = await apiClient.get("/api/lobby");
        console.log("Initial lobby fetched:", response.data);
        setLobby(response.data);
      } catch (error) {
        console.error("Error fetching initial lobby:", error);
      }
    };

    const setupSocket = async () => {
      try {
        const socket = await initializeSocket();
        socket.on("connect", () => {
          console.log("Connected to WebSocket server:", socket.id);
          socket.emit("join-lobby", { playerId: player.id, playerName: player.name }, (ack: string) =>
            console.log(ack)
          );
        });

        socket.on("game-started", () => {
          console.log("Game started via WebSocket");
          navigate("/board");
        });

        socket.on("lobby-updated", (updatedLobby: Lobby) => {
          console.log("Lobby updated via WebSocket:", updatedLobby);
          setLobby(updatedLobby);
        });
      } catch (error) {
        console.error("Error setting up WebSocket:", error);
      }
    };


    fetchLobby();
    setupSocket();

    return () => {
      console.log("Disconnecting from WebSocket server");
      disconnectSocket();
    };
  }, [player, navigate]);


  const handleLeave = async () => {
    try {
      const socket = await initializeSocket();
      if (socket.connected) {
        socket.emit(
          "leave-lobby",
          player,
          (ack: string) => {
            console.log(ack);
            clearPlayer();
            navigate("/");
          }
        );
      }
    } catch (error) {
      console.error("Error leaving lobby:", error);
    }
  };

  const handleGameStart = async () => {
    try {
      const response = await apiClient.post("/api/game/start", {}, { withCredentials: true });
      console.log("Game started successfully:", response.data);
      navigate("/board");
    } catch (error: any) {
      console.error("Failed to start game:", error.response?.data || error.message);
      alert(error.response?.data || "An error occurred. Please try again.");
    }
  };


  const handleSpotifyLogin = () => {
    // Save the current player in session storage (if needed)
    // sessionStorage.setItem("player", JSON.stringify(player));

    // Redirect to Spotify login
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/spotify/login`;
  };

  const getVisibleTeams = () => {
    const visibleTeams: Team[] = [];

    // Always add Team 1 and Team 2
    lobby.teams.slice(0, 2).forEach((team) => visibleTeams.push(team));

    // Dynamically add teams starting from Team 3
    for (let i = 2; i < lobby.teams.length; i++) {
      const previousTeamsPopulated = visibleTeams.every((team) => team.players.length > 0);
      if (previousTeamsPopulated || lobby.teams[i].players.length > 0) {
        visibleTeams.push(lobby.teams[i]);
      } else {
        break; // Stop showing teams once the condition is not met
      }
    }

    return visibleTeams;
  };

  return (
    <div className={styles.lobbyContainer}>
      <div className={styles.topBar}>
        <LeaveButton onLeave={handleLeave} />
      </div>
      <div className={styles.gameLobbyContainer}>
        <div className="flex center column">
          <div className={styles.teamsContainer}>
            {lobby.teams.length === 0 ? (
              <p>No teams available</p>
            ) : (
              <div className={styles.teamsGrid}>
                {getVisibleTeams().map((team) => (
                  <TeamSlot key={team.id} team={team} />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={styles.actionContainer}>
          <h1 id="hitster-tag">HITSTER</h1>
          <h1>Game Lobby</h1>
          <button onClick={handleGameStart}>Start Game</button>
          <button onClick={handleSpotifyLogin}>Login to Spotify</button>
        </div>
      </div>
      <div>
        <ul className={styles.playerList}>
          {lobby.players
            .filter(
              (player) =>
                !lobby.teams.some((team) =>
                  team.players.some((teamPlayer) => teamPlayer.id === player.id)
                )
            )
            .map((unassignedPlayer) => (
              <li className={styles.playerItem} key={unassignedPlayer.id}>
                <PlayerDisplay player={unassignedPlayer} />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
