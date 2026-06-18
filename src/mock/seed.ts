import { matchDb } from '../db/match-db';
import { playerDb } from '../db/player-db';
import { reviewDb } from '../db/review-db';
import { teamDb } from '../db/team-db';
import { tournamentDb } from '../db/tournament-db';
import { withFriendlyError } from '../utils/storage';
import { mockMatches, mockPlayers, mockReviews, mockTeams, mockTournaments } from './mock-data';

const SEED_KEY = 'ggarena-seeded-v2';

export async function seedDatabase(): Promise<void> {
  await withFriendlyError(async () => {
    const seeded = localStorage.getItem(SEED_KEY);
    if (seeded) return;
    await Promise.all([
      teamDb.saveMany(mockTeams),
      tournamentDb.saveMany(mockTournaments),
      playerDb.saveMany(mockPlayers),
      matchDb.saveMany(mockMatches),
      reviewDb.saveMany(mockReviews),
    ]);
    localStorage.setItem(SEED_KEY, 'true');
  }, '初始化演示数据失败，请刷新页面重试。');
}
