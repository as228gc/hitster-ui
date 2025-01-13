import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../../context/PlayerContext";
import apiClient from "../../config/axiosConfig";
import "./WelcomePage.css";

const WelcomePage: React.FC = () => {
  const { player, setPlayer } = usePlayer();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [isAnimating, setIsAnimating] = useState(false); // To control the animation state

  // Redirect if a player already exists
  useEffect(() => {
    if (player) {
      navigate("/lobby");
    }
  }, [player, navigate]);

  const createPlayer = () => {
    if (playerName.trim()) {
      setIsAnimating(true); // Start the animation
      setTimeout(() => {
        apiClient
          .post("/lobby/players/add", { name: playerName })
          .then((response) => {
            console.log("Player created:", response.data);
            const newPlayer = { id: response.data.id, name: response.data.name };
            setPlayer(newPlayer); // Update context and localStorage
            navigate("/lobby"); // Navigate after animation ends
          })
          .catch((error) => {
            alert("Error creating player. Please try again.");
            console.error(error);
          });
      }, 1500); // Match the duration of the animation
    } else {
      alert("Please enter a valid name.");
    }
  };

  return (
    <div className="container">
      <div className="title-container">
        <h1 className="title">welcome to</h1>
        <h1 id="hitster-tag">HITSTER</h1>
      </div>

      <div className="form">
        <input
          type="text"
          id="name-input"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button
          id="submit-name-button"
          onClick={createPlayer}
          className={isAnimating ? "animate" : ""}
        >
          PLAY
        </button>
      </div>
      <div className="name-tag">
        <span id="leading-line"></span>
        <p>Alex Söderberg</p>
        <span id="trailing-line"></span>
      </div>
    </div>
  );
};

export default WelcomePage;
