import './App.css'
import { TeamProvider } from './context/TeamContext'
import { PlayerProvider } from './context/PlayerContext';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import { GameLobby } from './components/GameLobby/GameLobby';
import { CreateTeamForm } from './components/CreateTeamForm/CreateTeamForm';

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
        <PlayerProvider>
          <Router>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path='/lobby' element={<GameLobby />} />
              <Route path='/lobby/create-team' element={<CreateTeamForm />}></Route>
            </Routes>
          </Router>
        </PlayerProvider>
      </TeamProvider>
    </>
  )
}

export default App
