import React from "react";
import { Team } from "../../../datatypes/Team";
import "./TeamMembers.css";

interface TeamMembersProps {
  teams: Team[];
}

const TeamMembers: React.FC<TeamMembersProps> = ({ teams }) => {
  return (
    <div>
      {teams.length === 0 && <p>No teams available</p>}
      {teams.length > 0 && (
        <div className="teams-container">
          {teams.map((team) => (
            <div key={team.id} className="team">
              <h2>{team.name}</h2>
              <p>Leader: {team.teamleader ? team.teamleader.name : "No leader assigned"}</p>
              <ul>
                {team.players && team.players.length > 0 ? (
                  team.players.map((player) => (
                    team.teamleader?.id === player.id ? (
                      null
                    ) : (
                      <li key={player.id}>{player.name}</li>
                    )
                  ))
                ) : (
                  <li>No players in this team</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
