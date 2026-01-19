import React from 'react'
import './PlayerStats.css'

function PlayerStats({ stats, points }) {
  const totalGames = stats.wins + stats.losses + stats.draws
  const winRate = totalGames > 0 ? ((stats.wins / totalGames) * 100).toFixed(1) : 0

  return (
    <div className="player-stats">
      <h3>Your Stats</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{points}</div>
          <div className="stat-label">Total Points</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{totalGames}</div>
          <div className="stat-label">Games Played</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.wins}</div>
          <div className="stat-label">Wins</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.losses}</div>
          <div className="stat-label">Losses</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.draws}</div>
          <div className="stat-label">Draws</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{winRate}%</div>
          <div className="stat-label">Win Rate</div>
        </div>
      </div>
    </div>
  )
}

export default PlayerStats
