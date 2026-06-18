import type { GameTitle, TournamentFormat, TournamentStatus } from '../constants/enums';

export interface BracketRound {
  name: string;
  matches: Array<{
    id: string;
    teamA: string;
    teamB: string;
    scoreA: number;
    scoreB: number;
  }>;
}

export interface TournamentReview {
  id: string;
  tournamentId: string;
  teamId: string;
  reviewerId: string;
  score: number;
  comment: string;
  createdAt: string;
}

export interface Tournament {
  id: string;
  name: string;
  game: GameTitle;
  format: TournamentFormat;
  teamSize: number;
  maxTeams: number;
  startDate: string;
  endDate: string;
  prize: string;
  status: TournamentStatus;
  rules: string;
  teams: string[];
  bracket: {
    rounds: BracketRound[];
  };
}
