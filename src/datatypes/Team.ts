import { Player } from './Player';
import { Song } from './Song';

export interface Team {
  id: number;
  name: string;
  players: Player[];
  teamleader: Player | null;
  timeline: Song[] | null;
}