import React, { useEffect, useState } from "react";
import { SongCard } from "../SongCard/SongCard";
import { TeamTimeline } from "./TeamTimeline/TeamTimeline";
import { Scoreboard } from "../ScoreBoard/ScoreBoard";
import { Team } from "../../datatypes/Team";
import { Song } from "../../datatypes/Song";
import apiClient from "../../config/axiosConfig";
import { usePlayer } from "../../context/PlayerContext";

export const GameBoardView: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [team, setTeam] = useState<Team | null>()
  const { player } = usePlayer()
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  const fetchNextSong = async () => {
    const response = await fetch("/api/game/next-song");
    const data = await response.json();
    setCurrentSong(data); // TypeScript knows `data` matches `Song`
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await apiClient.get("/lobby/teams");
        setTeams(response.data);
        teams.forEach((t) => {
          if (t.players.some(p => p.id === player?.id)) {
            setTeam(t)
          }
        })
      } catch (error) {
        console.log("Error: " + error)
      }
    };

    fetchTeams()
  }, [player?.id, teams]);

  return (
    <div>
      <h1>Game Board</h1>
      <Scoreboard teams={teams} />
      {currentSong && (
        <div>
          <h2>Current Song</h2>
          <SongCard
            title={currentSong.title}
            artist={currentSong.artist}
            releaseYear={currentSong.releaseYear}
            songUrl={currentSong.songUrl}
          />
        </div>
      )}
      <TeamTimeline key={team?.id} team={team || null} />
      <button onClick={fetchNextSong}>Play Next Song</button>
    </div>
  );
};
