import { Star } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { BracketChart } from '../components/common/BracketChart';
import { EmptyState } from '../components/common/EmptyState';
import { GameTag } from '../components/common/GameTag';
import { TeamCard } from '../components/common/TeamCard';
import { TournamentReviewForm } from '../components/common/TournamentReviewForm';
import { TournamentStatus } from '../constants/enums';
import { usePlayer } from '../hooks/usePlayer';
import { useTeam } from '../hooks/useTeam';
import { useTournament } from '../hooks/useTournament';
import { useMatchStore } from '../stores/matchStore';
import { usePlayerStore } from '../stores/playerStore';
import { useReviewStore, getAverageScore, getReviewsByTournament } from '../stores/reviewStore';
import { tournamentFormatLabels, tournamentStatusLabels } from '../utils/format';

export function TournamentDetail() {
  const { id } = useParams();
  const { tournaments, registerTeam } = useTournament();
  const { teams } = useTeam();
  const players = usePlayerStore((state) => state.players);
  const currentPlayerId = usePlayerStore((state) => state.currentPlayerId);
  const matches = useMatchStore((state) => state.matches);
  const reviews = useReviewStore((state) => state.reviews);
  const addReview = useReviewStore((state) => state.addReview);
  const tournament = tournaments.find((item) => item.id === id);
  if (!tournament) return <div className="page"><EmptyState title="赛事不存在" detail="请返回赛事大厅重新选择。" /></div>;
  const joinedTeams = teams.filter((team) => tournament.teams.includes(team.id));
  const tournamentMatches = matches.filter((match) => match.tournamentId === tournament.id);
  const tournamentReviews = getReviewsByTournament(reviews, tournament.id);
  const avgScore = getAverageScore(tournamentReviews);
  const latestReviews = [...tournamentReviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const isParticipant = players.some((p) => p.id === currentPlayerId);
  const playerTeam = isParticipant ? joinedTeams.find((team) => team.members.includes(currentPlayerId)) : undefined;
  const canReview = tournament.status === TournamentStatus.FINISHED && playerTeam && !tournamentReviews.some((r) => r.reviewerId === currentPlayerId);
  const alreadyReviewed = tournament.status === TournamentStatus.FINISHED && tournamentReviews.some((r) => r.reviewerId === currentPlayerId);

  return (
    <div className="page detail-page">
      <section className="detail-hero">
        <GameTag game={tournament.game} />
        <h1>{tournament.name}</h1>
        <p>{tournamentFormatLabels[tournament.format]} · {tournament.prize} · {tournamentStatusLabels[tournament.status]}</p>
        {tournament.status === TournamentStatus.REGISTRATION && <button className="button button--primary" onClick={() => void registerTeam(tournament.id, teams[0]?.id || '')}>报名 North Byte</button>}
        {canReview && (
          <TournamentReviewForm
            tournamentId={tournament.id}
            teamId={playerTeam.id}
            reviewerId={currentPlayerId}
            onSubmit={(review) => void addReview(review)}
          />
        )}
        {alreadyReviewed && <p className="review-submitted">你已评价过此赛事</p>}
      </section>
      <BracketChart format={tournament.format} rounds={tournament.bracket.rounds} />
      <section className="section-head"><h2>参赛队伍</h2></section>
      <div className="card-grid">{joinedTeams.map((team) => <TeamCard key={team.id} team={team} captain={players.find((player) => player.id === team.captainId)} compact />)}</div>
      <section className="timeline">
        <h2>对局结果</h2>
        {tournamentMatches.map((match) => <div className="timeline-item" key={match.id}>{match.teamA} vs {match.teamB}<strong>{match.score.a} : {match.score.b}</strong></div>)}
      </section>
      {tournament.status === TournamentStatus.FINISHED && (
        <section className="review-section">
          <div className="section-head">
            <h2>赛事评价</h2>
            {tournamentReviews.length > 0 && (
              <div className="review-summary">
                <Star size={20} fill="currentColor" className="review-summary__star" />
                <strong>{avgScore}</strong>
                <span>{tournamentReviews.length} 条评价</span>
              </div>
            )}
          </div>
          {latestReviews.length === 0 ? (
            <EmptyState title="暂无评价" detail="成为第一个评价此赛事的参赛者吧！" />
          ) : (
            <div className="review-list">
              {latestReviews.map((review) => {
                const reviewer = players.find((p) => p.id === review.reviewerId);
                const team = teams.find((t) => t.id === review.teamId);
                return (
                  <div className="review-item" key={review.id}>
                    <div className="review-item__header">
                      <span className="review-item__author">{reviewer?.username || '未知选手'}</span>
                      {team && <span className="review-item__team">{team.name}</span>}
                      <span className="review-item__score">
                        {[1, 2, 3, 4, 5].map((v) => (
                          <Star key={v} size={14} fill={v <= review.score ? 'currentColor' : 'none'} className={v <= review.score ? 'review-item__star--filled' : 'review-item__star--empty'} />
                        ))}
                      </span>
                    </div>
                    {review.comment && <p className="review-item__comment">{review.comment}</p>}
                    <span className="review-item__date">{new Date(review.createdAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
