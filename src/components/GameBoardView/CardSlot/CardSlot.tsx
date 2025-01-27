import React from "react";
import { Song } from "../../../datatypes/Song";
import styles from "./CardSlot.module.css";

interface CardSlotProps {
  song: Song | null;
}

export const CardSlot: React.FC<CardSlotProps> = ({ song }) => {
  return (
    <div
      className={`${styles.cardSlot} ${song ? styles.filledSlot : styles.emptySlot}`}
    >
      {song ? (
        <>
          <h4 className={styles.songTitle}>{song.title}</h4>
          <p className={styles.songArtist}>{song.artist}</p>
          <p className={styles.songReleaseYear}>{song.releaseYear}</p>
        </>
      ) : (
        <p className={styles.placeholder}>Empty Slot</p>
      )}
    </div>
  );
};
