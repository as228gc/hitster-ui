import React, { useState } from "react";
import "./SongCard.css";

interface SongCardProps {
  title: string;
  artist: string;
  releaseYear: number;
  songUrl: string;
}

export const SongCard: React.FC<SongCardProps> = ({
  title,
  artist,
  releaseYear,
  songUrl,
}) => {
  const [isRevealed, setIsRevealed] = useState(false); // Track if the card is revealed
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null); // Track the audio instance

  const handlePlaySong = () => {
    if (audio) {
      audio.pause(); // Stop any previously playing audio
      audio.currentTime = 0; // Reset to the beginning
    }

    const newAudio = new Audio(songUrl);
    newAudio.play();
    setAudio(newAudio);
  };

  const handleStopSong = () => {
    if (audio) {
      audio.pause(); // Stop the audio
      audio.currentTime = 0; // Reset playback
    }
  };

  const handleRevealCard = () => {
    handleStopSong(); // Stop the song before revealing the card
    setIsRevealed(true); // Reveal the card details
  };

  return (
    <div className="song-card">
      <div className={`card-content ${isRevealed ? "revealed" : "hidden"}`}>
        {isRevealed ? (
          <>
            <h2>{title}</h2>
            <p>{artist}</p>
            <p>{releaseYear}</p>
          </>
        ) : (
          <button onClick={handlePlaySong}>Play Song</button>
        )}
      </div>
      {!isRevealed && (
        <button onClick={handleRevealCard} className="reveal-card">
          Reveal Card
        </button>
      )}
    </div>
  );
};
