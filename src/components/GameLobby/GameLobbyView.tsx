import React, { useEffect, useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import styles from "./GameLobbyView.module.css";
import { TeamSlot } from "./TeamSlot/TeamSlot";
import { disconnectSocket, initializeSocket, getSocket } from "../../config/socketConfig";
import apiClient from "../../config/axiosConfig";
import { Lobby } from "../../datatypes/Lobby";
import { PlayerDisplay } from "./PlayerDisplay/PlayerDisplay";

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

    // Fetch initial teams from REST API
    const fetchLobby = async () => {
      try {
        const response = await apiClient.get("/lobby");
        console.log("Initial lobby fetched:", response.data);
        setLobby(response.data)
      } catch (error) {
        console.error("Error fetching initial teams:", error);
      }
    };

    fetchLobby();

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
      disconnectSocket();
    };
  }, [player, navigate]);

  const handleLeave = () => {
    getSocket().emit("leave-lobby",
      player,
      (ack: string) => {
        console.log(ack);
        console.log("Leaving lobby");
        clearPlayer();
        navigate("/");
      });
  };

  const handleGameStart = () => {
    console.log("Starting game");
  }

  return (
    <>
      <button className={styles.leaveButton} onClick={handleLeave}>
        <div className={styles.door}>
          <div className={styles.doorFrame}></div>
          <div className={styles.doorPanel}></div>
        </div>
      </button>
      <div className={styles.lobbyContainer}>
        <div className={styles.gameLobbyContainer}>
          <div className="flex center column">
            <div className={styles.teamsContainer}>
              {lobby.teams.length === 0 ? (
                <p>No teams available</p>
              ) : (
                lobby.teams.map((team) => <TeamSlot key={team.id} team={team} />)
              )}
            </div>
            <div className={styles.playersContainer}>
              <h2>Unassigned Players</h2>
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
          <div className={styles.actionContainer}>
            <h1 id="hitster-tag">HITSTER</h1>
            <h1>Game Lobby</h1>
            <button>Start Game</button>
          </div>
        </div>
      </div>
    </>
  );
};
