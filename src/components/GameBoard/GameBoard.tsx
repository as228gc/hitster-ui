import React, { useEffect, useState } from "react";
import { SongCard } from "../SongCard/SongCard";
import { TeamTimeline } from "../TeamTimeline/TeamTimeline";
import { Scoreboard } from "../ScoreBoard/ScoreBoard";

interface Song {
  title: string;
  artist: string;
  releaseYear: number;
  songUrl: string;
}

export const GameBoard: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]); // You can replace `any[]` with a proper Team type
  const [currentSong, setCurrentSong] = useState<Song | null>(null); // Specify the Song type

  const fetchTeams = async () => {
    const response = await fetch("/api/game/teams");
    const data = await response.json();
    setTeams(data);
  };

  const fetchNextSong = async () => {
    const response = await fetch("/api/game/next-song");
    const data = await response.json();
    setCurrentSong(data); // TypeScript knows `data` matches `Song`
  };

  useEffect(() => {
    fetchTeams();
  }, []);

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
      {teams.map((team) => (
        <TeamTimeline key={team.id} team={team} />
      ))}
      <button onClick={fetchNextSong}>Play Next Song</button>
    </div>
  );
};
