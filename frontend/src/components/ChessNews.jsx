import React, { useState, useEffect } from 'react'
import { combinedChessAPI } from '../services/combinedChessAPI'
import './ChessNews.css'

// Mock chess news data as final fallback
const mockChessNews = [
  {
    id: 1,
    title: "World Chess Championship 2024 Begins",
    excerpt: "The highly anticipated World Chess Championship has begun with exciting matches between top grandmasters.",
    date: "2024-01-15",
    source: "Chess.com",
    type: "tournament",
    apiSource: "mock"
  },
  {
    id: 2,
    title: "Magnus Carlsen Wins Norway Chess Tournament",
    excerpt: "Former world champion Magnus Carlsen secured victory in the prestigious Norway Chess tournament.",
    date: "2024-01-12",
    source: "Chess24",
    type: "tournament",
    apiSource: "mock"
  },
  {
    id: 3,
    title: "New Chess AI Breakthrough Announced",
    excerpt: "Researchers have developed a new chess AI that can explain its moves in human-readable terms.",
    date: "2024-01-10",
    source: "ChessBase",
    type: "news",
    apiSource: "mock"
  },
  {
    id: 4,
    title: "Youth Chess Championship Results",
    excerpt: "Young talents from around the world competed in the annual Youth Chess Championship.",
    date: "2024-01-08",
    source: "FIDE",
    type: "tournament",
    apiSource: "mock"
  },
  {
    id: 5,
    title: "Chess Olympiad Preparations Underway",
    excerpt: "Teams are preparing for the upcoming Chess Olympiad with intensive training sessions.",
    date: "2024-01-05",
    source: "Chess.com",
    type: "news",
    apiSource: "mock"
  }
]

function ChessNews() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [apiStatus, setApiStatus] = useState({ lichess: false, chesscom: false })
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Try to fetch from combined API (Lichess + Chess.com)
      try {
        const result = await combinedChessAPI.getAllChessNews()
        
        if (result.news && result.news.length > 0) {
          setNews(result.news)
          setApiStatus(result.sources)
          setLastUpdated(new Date())
          return
        }
      } catch (apiError) {
        console.warn('Combined API failed, falling back to mock data:', apiError)
      }
      
      // Final fallback to mock data
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate loading
      setNews(mockChessNews)
      setApiStatus({ lichess: false, chesscom: false })
      setLastUpdated(new Date())
      
    } catch (err) {
      console.error('Error fetching news:', err)
      setError('Failed to load chess news')
      setNews(mockChessNews) // Final fallback
      setApiStatus({ lichess: false, chesscom: false })
    } finally {
      setLoading(false)
    }
  }

  const refreshNews = () => {
    fetchNews()
  }

  const getNewsTypeIcon = (type) => {
    switch (type) {
      case 'tournament': return '🏆'
      case 'leaderboard': return '👑'
      case 'achievement': return '🎯'
      case 'streaming': return '📺'
      case 'puzzle': return '🧩'
      case 'tip': return '💡'
      case 'news': return '📰'
      default: return '♞'
    }
  }

  const getNewsTypeColor = (type) => {
    switch (type) {
      case 'tournament': return 'rgba(255, 193, 7, 0.8)'
      case 'leaderboard': return 'rgba(167, 54, 80, 0.8)'
      case 'achievement': return 'rgba(40, 167, 69, 0.8)'
      case 'streaming': return 'rgba(138, 43, 226, 0.8)'
      case 'puzzle': return 'rgba(255, 87, 34, 0.8)'
      case 'tip': return 'rgba(0, 188, 212, 0.8)'
      case 'news': return 'rgba(23, 162, 184, 0.8)'
      default: return 'rgba(108, 117, 125, 0.8)'
    }
  }

  const getApiSourceIcon = (apiSource) => {
    switch (apiSource) {
      case 'lichess': return '♛'
      case 'chesscom': return '♔'
      case 'general': return '📚'
      case 'mock': return '📝'
      default: return '♞'
    }
  }

  const getApiSourceColor = (apiSource) => {
    switch (apiSource) {
      case 'lichess': return '#759900'
      case 'chesscom': return '#7fa650'
      case 'general': return '#6c757d'
      case 'mock': return '#dc3545'
      default: return '#6c757d'
    }
  }

  const getDataSourceStatus = () => {
    const activeSources = []
    if (apiStatus.lichess) activeSources.push('Lichess')
    if (apiStatus.chesscom) activeSources.push('Chess.com')
    
    if (activeSources.length === 0) {
      return { text: '📝 Demo', color: '#dc3545' }
    } else if (activeSources.length === 1) {
      return { text: `🔴 ${activeSources[0]}`, color: '#28a745' }
    } else {
      return { text: '🔴 Live', color: '#28a745' }
    }
  }

  if (loading) {
    return (
      <div className="chess-news">
        <div className="news-header">
          <h3>♞ Chess News</h3>
        </div>
        <div className="news-loading">
          <div className="loading-spinner"></div>
          <p>Loading latest chess news...</p>
          <small>Connecting to Lichess & Chess.com...</small>
        </div>
      </div>
    )
  }

  const dataSource = getDataSourceStatus()

  return (
    <div className="chess-news">
      <div className="news-header">
        <h3>♞ Chess News</h3>
        <div className="news-controls">
          <span 
            className="data-source" 
            style={{ borderColor: dataSource.color }}
            title={`Data from: ${apiStatus.lichess ? 'Lichess ' : ''}${apiStatus.chesscom ? 'Chess.com ' : ''}${!apiStatus.lichess && !apiStatus.chesscom ? 'Demo data' : ''}`}
          >
            {dataSource.text}
          </span>
          <button onClick={refreshNews} className="refresh-btn" title="Refresh news">
            ↻
          </button>
        </div>
      </div>
      
      {error && (
        <div className="news-error">
          <p>{error}</p>
          <button onClick={refreshNews} className="retry-btn">Try Again</button>
        </div>
      )}
      
      <div className="news-list">
        {news.length === 0 ? (
          <div className="no-news">No news available at the moment.</div>
        ) : (
          news.map((item) => (
            <div key={item.id} className="news-item" data-type={item.type}>
              <div className="news-content">
                <div className="news-title-row">
                  <span 
                    className="news-type-icon"
                    style={{ color: getNewsTypeColor(item.type) }}
                  >
                    {getNewsTypeIcon(item.type)}
                  </span>
                  <h4>{item.title}</h4>
                  <span 
                    className="api-source-icon"
                    style={{ color: getApiSourceColor(item.apiSource) }}
                    title={`Source: ${item.apiSource}`}
                  >
                    {getApiSourceIcon(item.apiSource)}
                  </span>
                </div>
                {item.excerpt && <p>{item.excerpt}</p>}
                <div className="news-meta">
                  <span className="news-date">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                  {item.source && (
                    <span className="news-source">• {item.source}</span>
                  )}
                  {item.url && (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="news-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {lastUpdated && (
        <div className="news-footer">
          <small>
            Last updated: {lastUpdated.toLocaleTimeString()} • 
            {(apiStatus.lichess || apiStatus.chesscom) ? ' Live data' : ' Demo data'}
          </small>
        </div>
      )}
    </div>
  )
}

export default ChessNews
