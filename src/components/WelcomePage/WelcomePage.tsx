import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../../context/PlayerContext";
import apiClient from "../../config/axiosConfig";
import bassSound from "../../assets/sounds/bass-impact.mp3";
import styles from "./WelcomePage.module.css";

interface Player {
  id: number;
  name: string;
}

const WelcomePage: React.FC = () => {
  const { player, setPlayer } = usePlayer();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (player) {
      navigate("/lobby");
    }
  }, [player, navigate]);

  const playClickSound = () => {
    const audio = new Audio(bassSound);
    audio.play();
  };

  const createPlayer = () => {
    if (playerName.trim()) {
      setIsAnimating(true);
      playClickSound();

      document.querySelector(`.${styles.overlay}`)?.classList.add(styles.overlayDark);

      setTimeout(() => {
        apiClient
          .post("/api/lobby/players/add", { name: playerName })
          .then((response) => {
            const newPlayer: Player = { id: response.data.id, name: response.data.name };
            setPlayer(newPlayer);
            navigate("/lobby");
          })
          .catch(() => {
            alert("Error creating player. Please try again.");
          });
      }, 1500);
    } else {
      alert("Please enter a valid name.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>welcome to</h1>
        <h1 className={styles.hitsterTag}>HITSTER</h1>
      </div>

      <div className={styles.form}>
        <input
          type="text"
          className={styles.nameInput}
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <button
          className={`${styles.submitNameButton} ${isAnimating ? styles.submitNameButtonAnimate : ""}`}
          onClick={createPlayer}
        >
          PLAY
        </button>
      </div>
      <div className={styles.nameTag}>
        <span className={styles.leadingLine}></span>
        <p className={styles.nameTagText}>Alex Söderberg</p>
        <span className={styles.trailingLine}></span>
      </div>
    </div>
  );
};

export default WelcomePage;
