import React, { useState } from "react";
import "./WelcomePage.css";
import apiClient from "../../config/axiosConfig";

const WelcomePage: React.FC = () => {
  const [playerName, setPlayerName] = useState("");
  const [playerCreated, setPlayerCreated] = useState(false);

  const createPlayer = () => {
    if (playerName.trim()) {
      apiClient
        .post("/lobby/players/add", { name: playerName })
        .then(() => {
          setPlayerCreated(true); // Mark player as created
        })
        .catch((error: Error) => {
          alert("Error creating player. Please try again.");
          console.error(error);
        });
    } else {
      alert("Please enter a valid name.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Welcome to Hitster!</h1>

      {!playerCreated ? (
        <div className="form">
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button onClick={createPlayer}>Enter</button>
        </div>
      ) : (
        <div className="actions">
          <button className="button create" onClick={() => alert("Create Team Clicked!")}>
            Create Team
          </button>
          <button className="button join" onClick={() => alert("Join Team Clicked!")}>
            Join Team
          </button>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
