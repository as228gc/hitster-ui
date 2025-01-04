import './App.css'
import { SongCard } from './components/SongCard/SongCard'

function App() {

  return (
    <>
      <SongCard
        title="Bohemian Rhapsody"
        artist="Queen"
        releaseYear={1975}
        songUrl="https://example.com/song.mp3"
      />

    </>
  )
}

export default App
