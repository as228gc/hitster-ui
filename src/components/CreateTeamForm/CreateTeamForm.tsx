import { useState } from "react";
import apiClient from "../../config/axiosConfig";
import { usePlayer } from "../../context/PlayerContext";

export const CreateTeamForm: React.FC = () => {

  const { player } = usePlayer();
  const [teamName, setTeamName] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to create a team
    apiClient.post("/lobby/teams/add-team", { teamName: teamName, teamLeader: player}).then((response) => {
      console.log("Team created:", response.data);
    }).catch((error) => {
      console.error("Error creating team:", error);
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