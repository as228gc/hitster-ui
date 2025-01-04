import React from "react";

export const Scoreboard: React.FC<{ teams: any[] }> = ({ teams }) => {
  return (
    <div>
      <h2>Scoreboard</h2>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            {team.name}: {team.score} points
          </li>
        ))}
      </ul>
    </div>
  );
};
