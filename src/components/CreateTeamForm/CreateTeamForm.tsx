import { useState } from "react";
import apiClient from "../../config/axiosConfig";
import { usePlayer } from "../../context/PlayerContext";

export const CreateTeamForm: React.FC = () => {

  const { player } = usePlayer();
  const [teamName, setTeamName] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating team:", teamName)
    console.log("Player:", player?.id)
    // Add logic to create a team
    apiClient.post("/lobby/teams/add", {
      teamName: teamName,
      leaderId: player?.id?.toString(), // Ensure leaderId is a string
    })
    .then((response) => {
      console.log("Team created:", response.data);
    })
    .catch((error) => {
      console.error("Error creating team:", error.response?.data || error.message);
    });    
  }
  
  return (
    <div>
      <h1>Create a Team</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input 
          type="text"
          placeholder="Enter team name"
          onChange={(e) => setTeamName(e.target.value)} />
        <button type="submit">Create Team</button>
      </form>
    </div>
  )
}