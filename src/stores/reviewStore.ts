import { create } from 'zustand';
import { reviewDb } from '../db/review-db';
import type { TournamentReview } from '../types/tournament';
import { withFriendlyError } from '../utils/storage';

interface ReviewState {
  reviews: TournamentReview[];
  loading: boolean;
  loadReviews: () => Promise<void>;
  addReview: (review: TournamentReview) => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  loading: false,
  loadReviews: async () => {
    set({ loading: true });
    try {
      const reviews = await withFriendlyError(() => reviewDb.getAll());
      set({ reviews, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  addReview: async (review) => {
    const exists = get().reviews.some(
      (r) => r.tournamentId === review.tournamentId && r.reviewerId === review.reviewerId,
    );
    if (exists) return;
    const saved = await withFriendlyError(() => reviewDb.save(review));
    set((state) => ({ reviews: [...state.reviews, saved] }));
  },
}));

export function getAverageScore(reviews: TournamentReview[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.score, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

export function getReviewsByTournament(reviews: TournamentReview[], tournamentId: string): TournamentReview[] {
  return reviews.filter((r) => r.tournamentId === tournamentId);
}

export function getReviewsByPlayer(reviews: TournamentReview[], playerId: string): TournamentReview[] {
  return reviews.filter((r) => r.reviewerId === playerId);
}
