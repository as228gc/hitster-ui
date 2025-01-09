import React, { createContext, useContext, useState, ReactNode } from "react";

interface TeamContextProps {
  isConfigured: boolean;
  setIsConfigured: (configured: boolean) => void;
}

const TeamContext = createContext<TeamContextProps | undefined>(undefined);

export const TeamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConfigured, setIsConfigured] = useState(false); // Global state

  return (
    <TeamContext.Provider value={{ isConfigured, setIsConfigured }}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeamContext = (): TeamContextProps => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useTeamContext must be used within a TeamProvider");
  }
  return context;
};
