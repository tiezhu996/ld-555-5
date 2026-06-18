import type { TournamentReview } from '../types/tournament';
import { deleteRecord, getAllRecords, putManyRecords, putRecord } from './index';

export const reviewDb = {
  getAll: () => getAllRecords<TournamentReview>('reviews'),
  save: (review: TournamentReview) => putRecord('reviews', review),
  saveMany: (reviews: TournamentReview[]) => putManyRecords('reviews', reviews),
  remove: (id: string) => deleteRecord('reviews', id),
};
