import React from "react";
import { SongCard } from "../SongCard/SongCard";

interface Song {
  title: string;
  artist: string;
  releaseYear: number;
  songUrl: string;
}

interface Team {
  id: string;
  name: string;
  timeline: Song[];
  score: number;
}

export const TeamTimeline: React.FC<{ team: Team }> = ({ team }) => {
  return (
    <div>
      <h2>{team.name}'s Timeline</h2>
      <div>
        {team.timeline.map((song, index) => (
          <SongCard
            key={index}
            title={song.title}
            artist={song.artist}
            releaseYear={song.releaseYear}
            songUrl={song.songUrl}
          />
        ))}
      </div>
    </div>
  );
};
