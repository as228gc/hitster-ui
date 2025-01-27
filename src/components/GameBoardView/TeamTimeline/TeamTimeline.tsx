import { useEffect, useState } from "react";
import { CardSlot } from "../CardSlot/CardSlot";
import styles from "./TeamTimeline.module.css";
import { Song } from "../../../datatypes/Song";
import { Team } from "../../../datatypes/Team";
import apiClient from "../../../config/axiosConfig";

interface TeamTimelineProps {
  team: Team | null
}

export const TeamTimeline: React.FC<TeamTimelineProps> = ({ team }) => {
  const [songs, setSongs] = useState<(Song | null)[]>([]);

  useEffect(() => {
    const fetchSongCards = async () => {
      try {
        const response = await apiClient.get(`/api/game/teams/${team?.id}/songcards`)
        response.data.forEach((songCard: Song | null) => setSongs([...songs, songCard]))
      } catch (error) {
        console.log("Error fetching songs" + error)
        for(let i = 0; i < 10; i++) {
          setSongs([...songs, null])
        }
      }
    }

    fetchSongCards()
  }, [songs, team?.id]);

  return (
    <div className={styles.timeline}>
      {songs.map((song, index) => (
        <CardSlot key={index} song={song} />
      ))}
    </div>
  );
};
