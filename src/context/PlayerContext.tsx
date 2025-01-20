import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Player } from "../datatypes/Player";

interface PlayerContextProps {
  player: Player | null;
  setPlayer: (player: Player) => void;
  clearPlayer: () => void; // Optional, to log out or clear player data
}

const PlayerContext = createContext<PlayerContextProps | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [player, setPlayerState] = useState<Player | null>(() => {
    const storedPlayer = localStorage.getItem("player");
    if (storedPlayer) {
      try {
        return JSON.parse(storedPlayer);
      } catch {
        console.error("Invalid player data in localStorage");
        localStorage.removeItem("player");
      }
    }
    return null; // Default value
  });

  const setPlayer = (player: Player) => {
    setPlayerState(player);
    localStorage.setItem("player", JSON.stringify(player));
  };

  const clearPlayer = () => {
    setPlayerState(null);
    localStorage.removeItem("player");
  };

  useEffect(() => {
    const storedPlayer = localStorage.getItem("player");
    if (storedPlayer) {
      try {
        setPlayerState(JSON.parse(storedPlayer));
      } catch (error) {
        console.error("Error parsing player data from localStorage:", error);
        localStorage.removeItem("player");
      }
    }
  }, []);

  return (
    <PlayerContext.Provider value={{ player, setPlayer, clearPlayer }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextProps => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
