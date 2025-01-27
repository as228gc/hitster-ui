import React, { useEffect, useState } from "react";
import { CardSlot } from "../CardSlot/CardSlot";
import { Song } from "../../../datatypes/Song";
import { Team } from "../../../datatypes/Team";
import apiClient from "../../../config/axiosConfig";
import styles from "./TeamTimeline.module.css"

interface TeamTimelineProps {
  team: Team | null;
}

export const TeamTimeline: React.FC<TeamTimelineProps> = ({ team }) => {
  const [songs, setSongs] = useState<(Song | null)[]>([]); // Array that can hold Song or null

  useEffect(() => {
    const fetchSongCards = async () => {
      if (!team?.id) {
        setSongs(Array(10).fill(null)); // Populate 10 empty slots if no team is available
        return;
      }

      try {
        const response = await apiClient.get<Song[]>(`/api/game/teams/${team.id}/timeline`);
        console.log("Songs fetched:", response.data);
        const fetchedSongs: (Song | null)[] = response.data;

        // Ensure we always have exactly 10 slots
        while (fetchedSongs.length < 10) {
          fetchedSongs.push(null); // Add null for empty slots
        }

        setSongs(fetchedSongs);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setSongs(Array(10).fill(null)); // Populate 10 empty slots in case of error
      }
    };

    fetchSongCards();
  }, [team?.id]);

  return (
    <div className={styles.timeline}>
      {songs.map((song, index) => (
        <CardSlot key={index} song={song} />
      ))}
    </div>
  );
};
