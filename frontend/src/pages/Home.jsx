import React from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import GameModeSelector from '../components/GameModeSelector'
import PlayerStats from '../components/PlayerStats'
import ChessNews from '../components/ChessNews'
import './Home.css'

function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="home-container">
        <Navbar />
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        <div className="home-main">
          <GameModeSelector />
          <PlayerStats 
            stats={user?.stats || { wins: 0, losses: 0, draws: 0, gamesPlayed: 0 }} 
            points={user?.stats?.points || 0} 
          />
        </div>
        <div className="home-sidebar">
          <ChessNews />
        </div>
      </div>
    </div>
  )
}

export default Home
