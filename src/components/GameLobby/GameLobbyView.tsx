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
  const playerMock = {
    id: 1,
    name: "Alex"
  }

  const { player, clearPlayer } = usePlayer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!player) {
      navigate("/");
      return;
    }

    const fetchLobby = async () => {
      try {
        const response = await apiClient.get("/lobby");
        console.log("Initial lobby fetched:", response.data);
        setLobby(response.data);
      } catch (error) {
        console.error("Error fetching initial lobby:", error);
      }
    };

    fetchLobby();

    const socket = initializeSocket();

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      socket.emit(
        "join-lobby",
        { playerId: player.id, playerName: player.name },
        (ack: string) => {
          console.log(ack);
        }
      );
    });

    socket.on("lobby-updated", (updatedLobby: Lobby) => {
      console.log("Lobby updated via WebSocket:", updatedLobby);
      setLobby(updatedLobby);
    });

    socket.on("player-added", (players: Player[]) => {
      setLobby((prevLobby) => {
        return {
          ...prevLobby,
          players: players
        };
      });
    })

    socket.on("game-started", () => {
      console.log("Game started via WebSocket");
      navigate("/board");
    })

    return () => {
      disconnectSocket();
    };
  }, [player, navigate]);

  const handleLeave = () => {
    getSocket().emit(
      "leave-lobby",
      player,
      (ack: string) => {
        console.log(ack);
        clearPlayer();
        navigate("/");
      }
    );
  };

  const handleGameStart = async () => {
    try {
      getSocket().emit("game-start", (ack: string) => {
        console.log(ack);
      });
      navigate("/board")
    } catch (error) {
      console.error("Error starting game:", error);
    }
    console.log("Starting game");
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
    <>
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
    </>
  );
};
