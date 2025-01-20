import './App.css'
import { TeamProvider } from './context/TeamContext'
import { PlayerProvider } from './context/PlayerContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import { GameLobby } from './components/GameLobby/GameLobby';

function App() {

  return (
    <>
      <TeamProvider>
        <PlayerProvider>
          <Router>
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path='/lobby' element={<GameLobby />} />
            </Routes>
          </Router>
        </PlayerProvider>
      </TeamProvider>
    </>
  )
}

export default App
