import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
  }

  const handleHome = () => {
    navigate('/home')
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand" onClick={handleHome}>
          <h1>♔ Royal Gambit</h1>
        </div>
        <div className="navbar-right">
          {user && (
            <span className="navbar-username">Welcome, {user.username}!</span>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
