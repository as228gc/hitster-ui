import { Player } from "./Player";
import { Team } from "./Team";

export interface Lobby {
  id: number;
  players: Player[];
  teams: Team[];
}