import { Star } from 'lucide-react';
import { useState } from 'react';
import type { TournamentReview } from '../../types/tournament';

interface TournamentReviewFormProps {
  tournamentId: string;
  teamId: string;
  reviewerId: string;
  onSubmit: (review: TournamentReview) => void;
}

export function TournamentReviewForm({ tournamentId, teamId, reviewerId, onSubmit }: TournamentReviewFormProps) {
  const [score, setScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
  const [comment, setComment] = useState('');
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button className="button button--primary" onClick={() => setOpen(true)}>
        <Star size={16} /> 评价赛事
      </button>
    );
  }

  return (
    <div className="review-form panel">
      <h3>赛事评价</h3>
      <div className="review-form__stars">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            className={`review-form__star ${(hoverScore || score) >= value ? 'is-active' : ''}`}
            onClick={() => setScore(value)}
            onMouseEnter={() => setHoverScore(value)}
            onMouseLeave={() => setHoverScore(0)}
            type="button"
          >
            <Star size={28} fill={(hoverScore || score) >= value ? 'currentColor' : 'none'} />
          </button>
        ))}
        <span className="review-form__score-label">{(hoverScore || score) > 0 ? `${hoverScore || score} 分` : '请打分'}</span>
      </div>
      <textarea
        placeholder="写下你的短评（选填）"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        maxLength={200}
      />
      <div className="review-form__actions">
        <button
          className="button button--primary"
          disabled={score === 0}
          onClick={() => {
            onSubmit({
              id: `rev-${Date.now()}`,
              tournamentId,
              teamId,
              reviewerId,
              score,
              comment,
              createdAt: new Date().toISOString(),
            });
            setOpen(false);
            setScore(0);
            setComment('');
          }}
          type="button"
        >
          提交评价
        </button>
        <button className="button" onClick={() => setOpen(false)} type="button">取消</button>
      </div>
    </div>
  );
}
