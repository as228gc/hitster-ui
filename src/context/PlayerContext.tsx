import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Player } from "../datatypes/Player";

interface PlayerContextProps {
  player: Player | null;
  setPlayer: (player: Player) => void;
  clearPlayer: () => void; // Optional, to log out or clear player data
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [player, setPlayerState] = useState<Player | null>(null);

  // Function to update player state and store it in localStorage
  const setPlayer = (player: Player) => {
    setPlayerState(player);
    localStorage.setItem("player", JSON.stringify(player));
  };

  // Function to clear player data (e.g., on logout)
  const clearPlayer = () => {
    setPlayerState(null);
    localStorage.removeItem("player");
  };

  // Initialize player from localStorage on mount
  useEffect(() => {
    const storedPlayer = localStorage.getItem("player");
    if (storedPlayer) {
      setPlayerState(JSON.parse(storedPlayer));
    }
  }, []);

  return (
    <PlayerContext.Provider value={{ player, setPlayer, clearPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePlayer = (): PlayerContextProps => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
