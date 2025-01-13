import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../../context/PlayerContext";
import apiClient from "../../config/axiosConfig";
import bassSound from "../../assets/sounds/bass-impact.mp3";
import "./WelcomePage.css";

const WelcomePage: React.FC = () => {
  const { player, setPlayer } = usePlayer();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  // Redirect if a player already exists
  useEffect(() => {
    if (player) {
      navigate("/lobby");
    }
  }, [player, navigate]);

  // Play click sound
  const playClickSound = () => {
    const audio = new Audio(bassSound);
    audio.play();
  };

  const createPlayer = () => {
    if (playerName.trim()) {
      setIsAnimating(true); // Start the animation
      playClickSound(); // Play the sound

      // Add the dark overlay effect
      document.querySelector(".overlay")?.classList.add("dark");

      setTimeout(() => {
        apiClient
          .post("/lobby/players/add", { name: playerName })
          .then((response) => {
            console.log("Player created:", response.data);
            const newPlayer = { id: response.data.id, name: response.data.name };
            setPlayer(newPlayer);
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
      <div className="overlay"></div> {/* Dark overlay */}
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
