import './App.css'
import { TeamProvider } from './context/TeamContext'
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SongCard } from './components/SongCard/SongCard';
import WelcomePage from "./components/WelcomePage/WelcomePage";
import ConfigureTeamsPage from "./components/ConfigureTeamsPage/ConfigureTeamsPage";

function App() {

  return (
    <>
      {/* <SongCard
        title="Bohemian Rhapsody"
        artist="Queen"
        releaseYear={1975}
        songUrl="https://example.com/song.mp3"
      /> */}

      <TeamProvider>
        <Router>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/configure-teams" element={<ConfigureTeamsPage />} />
          </Routes>
        </Router>
      </TeamProvider>
    </>
  )
}

export default App
