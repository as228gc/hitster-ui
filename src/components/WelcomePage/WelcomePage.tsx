import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../../context/PlayerContext";
import apiClient from "../../config/axiosConfig";
import "./WelcomePage.css";

const WelcomePage: React.FC = () => {
  const { player, setPlayer } = usePlayer();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");

  // Redirect if a player already exists
  useEffect(() => {
    if (player) {
      navigate("/lobby");
    }
  }, [player, navigate]);

  const createPlayer = () => {
    if (playerName.trim()) {
      apiClient
        .post("/lobby/players/add", { name: playerName })
        .then((response) => {
          console.log("Player created:", response.data);
          const newPlayer = { id: response.data.id, name: response.data.name };
          setPlayer(newPlayer); // Update context and localStorage
          navigate("/lobby");
        })
        .catch((error) => {
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
      <div className="form">
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button onClick={createPlayer}>Enter</button>
      </div>
    </div>
  );
};

export default WelcomePage;
