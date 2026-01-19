import React from 'react'
import { useNavigate } from 'react-router-dom'
import './GameModeSelector.css'

function GameModeSelector() {
  const navigate = useNavigate()

  const handlePvP = () => {
    navigate('/game/pvp')
  }

  const handleVsComputer = (difficulty) => {
    navigate(`/game/vs-computer/${difficulty}`)
  }

  return (
    <div className="game-mode-selector">
      <h2>Choose Game Mode</h2>
      <div className="mode-cards">
        <div className="mode-card" onClick={handlePvP}>
          <div className="mode-icon">👥</div>
          <h3>Player vs Player</h3>
          <p>Play against a friend on the same device</p>
        </div>
        
        <div className="mode-card computer-mode">
          <div className="mode-icon">🤖</div>
          <h3>Play with Computer</h3>
          <p>Challenge the AI at different difficulty levels</p>
          <div className="difficulty-buttons">
            <button 
              className="difficulty-btn easy" 
              onClick={() => handleVsComputer('easy')}
            >
              Easy (10 pts)
            </button>
            <button 
              className="difficulty-btn medium" 
              onClick={() => handleVsComputer('medium')}
            >
              Medium (20 pts)
            </button>
            <button 
              className="difficulty-btn hard" 
              onClick={() => handleVsComputer('hard')}
            >
              Hard (30 pts)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameModeSelector
