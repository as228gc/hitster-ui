import React, { ReactElement, useState } from "react";

interface CardProps {
  title: string;
  artist: string;
  releaseYear: number;
  songUrl: string;
}

export const Card: React.FC<CardProps> = ({ title: string, artist: string, releaseYear: number, songUrl: string }): ReactElement => {
  const [isRevealed, setIsRevealed] = useState(false); // Track if the card details are shown
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null); // Store the audio instance

  const handlePlaySong = () => {
    if (audio) {
      audio.pause(); // Stop any previously playing audio
      audio.currentTime = 0; // Reset to the start
    }

    const newAudio = new Audio(songUrl); // Create a new audio instance
    newAudio.play();
    setAudio(newAudio);
  };

  const handleTurnCard = () => {
    if (audio) {
      audio.pause(); // Stop the audio when the card is turned
      audio.currentTime = 0; // Reset to the start
    }
    setIsRevealed(true); // Reveal card details
  };

  return (
    <div className="card">
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
        <button onClick={handleTurnCard} className="turn-card">
          Turn Card
        </button>
      )}
    </div>
  );
};
