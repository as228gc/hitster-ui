import React, { createContext, useContext, useState, ReactNode } from "react";
import { Team } from "../datatypes/Team";

interface TeamContextProps {
  teams: Team[]; // Store the list of teams
  setTeams: (teams: Team[]) => void;
  addTeam: (team: Team) => void;
  clearTeams: () => void;
}

const TeamContext = createContext<TeamContextProps | undefined>(undefined);

export const TeamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]); // Track the list of teams

  const addTeam = (team: Team) => {
    setTeams((prevTeams) => [...prevTeams, team]);
  };

  const clearTeams = () => {
    setTeams([]); // Clear the teams
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        setTeams,
        addTeam,
        clearTeams,
      }}
    >
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
