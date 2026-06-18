import { Link } from 'react-router-dom';
import { BracketChart } from '../components/common/BracketChart';
import { PlayerBadge } from '../components/common/PlayerBadge';
import { TeamCard } from '../components/common/TeamCard';
import { rankConfigs } from '../constants/rank-configs';
import { usePlayer } from '../hooks/usePlayer';
import { useTeam } from '../hooks/useTeam';
import { useTournamentStore } from '../stores/tournamentStore';
import { useReviewStore, getReviewsByPlayer } from '../stores/reviewStore';

export function Profile() {
  const { players, currentPlayerId, updateProfile } = usePlayer();
  const { teams } = useTeam();
  const tournaments = useTournamentStore((state) => state.tournaments);
  const reviews = useReviewStore((state) => state.reviews);
  const player = players.find((item) => item.id === currentPlayerId) || players[0];
  if (!player) return <div className="page">加载中</div>;
  const rank = rankConfigs[player.rank];
  const myTeams = teams.filter((team) => player.teams.includes(team.id));
  const relatedTournament = tournaments.find((tour) => tour.teams.some((teamId) => player.teams.includes(teamId)));
  const myReviews = getReviewsByPlayer(reviews, player.id);

  return (
    <div className="page detail-page">
      <section className="profile-grid">
        <div className="panel"><PlayerBadge player={player} size="lg" /><p>{player.bio}</p><button className="button" onClick={() => void updateProfile({ ...player, bio: `${player.bio} 已更新` })}>编辑资料</button></div>
        <div className="panel"><h2>段位成就</h2><div className="progress"><span style={{ width: `${Math.min(100, (player.score / rank.maxScore) * 100)}%` }} /></div><p>{rank.label} · {player.score}/{rank.maxScore}</p></div>
      </section>
      <section className="card-grid">{myTeams.map((team) => <TeamCard key={team.id} team={team} captain={player} compact />)}</section>
      {relatedTournament && <section className="panel"><h2>参赛记录</h2><BracketChart compact format={relatedTournament.format} rounds={relatedTournament.bracket.rounds} /></section>}
      {myReviews.length > 0 && (
        <section className="panel">
          <h2>我的赛事评价</h2>
          <div className="review-list">
            {myReviews.map((review) => {
              const tournament = tournaments.find((t) => t.id === review.tournamentId);
              return (
                <div className="review-item" key={review.id}>
                  <div className="review-item__header">
                    {tournament ? (
                      <Link className="review-item__tournament-link" to={`/tournaments/${tournament.id}`}>{tournament.name}</Link>
                    ) : (
                      <span className="review-item__author">未知赛事</span>
                    )}
                    <span className="review-item__score-badge">{review.score} 分</span>
                  </div>
                  {review.comment && <p className="review-item__comment">{review.comment}</p>}
                  <span className="review-item__date">{new Date(review.createdAt).toLocaleDateString('zh-CN')}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
