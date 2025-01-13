import React from "react";
import { Team } from "../../../datatypes/Team";

interface TeamMembersProps {
  teams: Team[];
}

const TeamMembers: React.FC<TeamMembersProps> = ({ teams }) => {
  return (
    <div className="teams-container">
      {teams.map((team) => (
        <div key={team.id} className="team">
          <h2>{team.name}</h2>
          <p>Leader: {team.leader.name}</p>
          <ul>
            {team.players.map((member) => (
              <li key={member.id}>{member.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TeamMembers;
