import React, { useState } from "react";

export const GameLobby: React.FC = () => {
  const [teamName, setTeamName] = useState("");

  const handleStartGame = async () => {
    await fetch("/api/game/start", { method: "POST" });
  };

  const handleAddTeam = async () => {
    await fetch(`/api/game/add-team?teamName=${teamName}`, { method: "POST" });
    setTeamName(""); // Clear input after adding
  };

  return (
    <div>
      <h1>Game Lobby</h1>
      <button onClick={handleStartGame}>Start Game</button>
      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Enter team name"
      />
      <button onClick={handleAddTeam}>Add Team</button>
    </div>
  );
};
