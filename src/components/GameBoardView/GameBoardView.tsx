import React, { useEffect, useState } from "react";
import { usePlayer } from "../../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import { initializeSocket, disconnectSocket } from "../../config/socketConfig";
import apiClient from "../../config/axiosConfig";
import { Team } from "../../datatypes/Team";

export const GameBoardView: React.FC = () => {
  const { player } = usePlayer();
  const [team, setTeam] = useState<Team | null>(null);
  const [countdown, setCountdown] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!player) {
      navigate("/");
      return;
    }

    // Initialize WebSocket connection
    const socket = initializeSocket();

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    // Listen for team updates in real time
    socket.on("team-updated", (updatedTeam: Team) => {
      if (updatedTeam.id === team?.id) {
        console.log("Team updated via WebSocket:", updatedTeam);
        setTeam(updatedTeam);
      }
    });

    socket.on("game-state-updated", (updatedTeams: Team[]) => {
      console.log("Game state updated via WebSocket");
    });

    // Fetch team data based on the player's ID
    const fetchTeamForPlayer = async () => {
      try {
        const response = await apiClient.get<Team>(`/lobby/teams/player/${player.id}`);
        console.log("Team fetched for player:", response.data);
        setTeam(response.data);
      } catch (error) {
        console.error("Error fetching team for player:", error);
      }
    };

    fetchTeamForPlayer();

    // Cleanup WebSocket on unmount
    return () => {
      disconnectSocket();
    };
  }, [player, navigate, team?.id]);

  // Countdown logic
  useEffect(() => {
    if (countdown > 0 && !isPlaying) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isPlaying) {
      setIsPlaying(true);
    }
  }, [countdown, isPlaying]);

  if (!team) {
    return <div>Loading your team's data...</div>;
  }

  console.log("Team data:", team);
  console.log("Team timeline:", team.timeline);
  const currentSong = team.timeline[0]; // First song in the team's timeline

  const handleEndGame = async () => {
    try {
      await apiClient.post(`/game/end`);
      navigate("/lobby");
    } catch (error) {
      console.error("Error ending game:", error);
    }
  }

  return (
    <div className="game-board-view">
      <h1>Game Board</h1>
      <h2>Team: {team.name}</h2>

      {isPlaying ? (
        <div className="song-player">
          <h3>Now Playing: {currentSong.title}</h3>
          <audio controls autoPlay>
            <source src={currentSong.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      ) : (
        <div className="countdown">
          <h3>Starting in...</h3>
          <h1>{countdown}</h1>
        </div>
      )}

      <div className="timeline">
        <h3>Your Timeline</h3>
        <ul>
          {team.timeline.map((card, index) => (
            <li key={index}>
              {card.title} ({card.artist})
            </li>
          ))}
        </ul>
      </div>

      <button onClick={handleEndGame}>End Game</button>
    </div>
  );
};
