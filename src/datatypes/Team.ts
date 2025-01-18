import { Player } from './Player';
import { SongCard } from '../components/SongCard/SongCard';

export interface Team {
  id: number;
  name: string;
  players: Player[];
  teamleader: Player | null;
  timeline: typeof SongCard[];
}