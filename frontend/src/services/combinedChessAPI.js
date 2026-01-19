// Combined Chess API service that aggregates data from multiple sources
import { lichessAPI } from './lichessAPI'
import { chesscomAPI } from './chesscomAPI'

class CombinedChessAPI {
  constructor() {
    this.sources = {
      lichess: lichessAPI,
      chesscom: chesscomAPI
    }
  }

  // Get news from all sources
  async getAllChessNews() {
    const allNews = []
    const errors = []

    // Try to get news from Lichess
    try {
      const lichessNews = await this.sources.lichess.getChessNews()
      allNews.push(...lichessNews.map(item => ({ ...item, apiSource: 'lichess' })))
    } catch (error) {
      console.warn('Failed to fetch Lichess news:', error)
      errors.push({ source: 'lichess', error: error.message })
    }

    // Try to get news from Chess.com
    try {
      const chesscomNews = await this.sources.chesscom.getChessNews()
      allNews.push(...chesscomNews.map(item => ({ ...item, apiSource: 'chesscom' })))
    } catch (error) {
      console.warn('Failed to fetch Chess.com news:', error)
      errors.push({ source: 'chesscom', error: error.message })
    }

    // Add some general chess news if we have limited data
    if (allNews.length < 5) {
      const generalNews = this.getGeneralChessNews()
      allNews.push(...generalNews)
    }

    // Remove duplicates based on title similarity
    const uniqueNews = this.removeDuplicateNews(allNews)

    // Sort by date (newest first) and limit to reasonable number
    const sortedNews = uniqueNews
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 15)

    return {
      news: sortedNews,
      sources: {
        lichess: !errors.find(e => e.source === 'lichess'),
        chesscom: !errors.find(e => e.source === 'chesscom')
      },
      errors
    }
  }

  // Remove duplicate news items based on title similarity
  removeDuplicateNews(newsArray) {
    const seen = new Set()
    return newsArray.filter(item => {
      const normalizedTitle = item.title.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (seen.has(normalizedTitle)) {
        return false
      }
      seen.add(normalizedTitle)
      return true
    })
  }

  // Get general chess news/tips
  getGeneralChessNews() {
    const today = new Date()
    const yesterday = new Date(today.getTime() - 86400000)
    const twoDaysAgo = new Date(today.getTime() - 172800000)
    const threeDaysAgo = new Date(today.getTime() - 259200000)

    return [
      {
        id: 'general-tip-1',
        title: 'Master the Art of Pawn Structure',
        excerpt: 'Understanding pawn structure is crucial for positional play. Learn about pawn chains, isolated pawns, and passed pawns to improve your middlegame.',
        date: yesterday.toISOString(),
        source: 'Chess Strategy',
        type: 'tip',
        apiSource: 'general'
      },
      {
        id: 'general-tip-2',
        title: 'Time Management in Chess',
        excerpt: 'Effective time management can make the difference between winning and losing. Learn when to think long and when to play quickly.',
        date: twoDaysAgo.toISOString(),
        source: 'Chess Strategy',
        type: 'tip',
        apiSource: 'general'
      },
      {
        id: 'general-news-1',
        title: 'Chess Popularity Continues to Grow',
        excerpt: 'Online chess platforms report record numbers of new players joining daily, with chess education programs expanding worldwide.',
        date: threeDaysAgo.toISOString(),
        source: 'Chess Community',
        type: 'news',
        apiSource: 'general'
      },
      {
        id: 'general-tip-3',
        title: 'Endgame Fundamentals: King and Pawn',
        excerpt: 'Master the basic king and pawn endgame. Understanding opposition, triangulation, and key squares is essential for every chess player.',
        date: new Date(today.getTime() - 345600000).toISOString(), // 4 days ago
        source: 'Chess Education',
        type: 'tip',
        apiSource: 'general'
      }
    ]
  }

  // Get player comparison between platforms
  async comparePlayer(username) {
    const results = {}

    try {
      const lichessProfile = await this.sources.lichess.getUserProfile(username)
      results.lichess = lichessProfile
    } catch (error) {
      results.lichess = { error: error.message }
    }

    try {
      const chesscomProfile = await this.sources.chesscom.getPlayerProfile(username)
      const chesscomStats = await this.sources.chesscom.getPlayerStats(username)
      results.chesscom = { profile: chesscomProfile, stats: chesscomStats }
    } catch (error) {
      results.chesscom = { error: error.message }
    }

    return results
  }

  // Get combined leaderboards
  async getCombinedLeaderboards() {
    const leaderboards = {
      lichess: null,
      chesscom: null,
      errors: []
    }

    try {
      leaderboards.lichess = await this.sources.lichess.getLeaderboard('blitz', 10)
    } catch (error) {
      leaderboards.errors.push({ source: 'lichess', error: error.message })
    }

    try {
      leaderboards.chesscom = await this.sources.chesscom.getLeaderboards()
    } catch (error) {
      leaderboards.errors.push({ source: 'chesscom', error: error.message })
    }

    return leaderboards
  }

  // Get daily puzzles from both sources
  async getDailyPuzzles() {
    const puzzles = {
      lichess: null,
      chesscom: null,
      errors: []
    }

    try {
      puzzles.lichess = await this.sources.lichess.getDailyPuzzle()
    } catch (error) {
      puzzles.errors.push({ source: 'lichess', error: error.message })
    }

    try {
      puzzles.chesscom = await this.sources.chesscom.getDailyPuzzle()
    } catch (error) {
      puzzles.errors.push({ source: 'chesscom', error: error.message })
    }

    return puzzles
  }

  // Health check for all APIs
  async healthCheck() {
    const health = {
      lichess: false,
      chesscom: false,
      timestamp: new Date().toISOString()
    }

    try {
      await this.sources.lichess.getLeaderboard('blitz', 1)
      health.lichess = true
    } catch (error) {
      console.warn('Lichess API health check failed:', error)
    }

    try {
      await this.sources.chesscom.getLeaderboards()
      health.chesscom = true
    } catch (error) {
      console.warn('Chess.com API health check failed:', error)
    }

    return health
  }
}

export const combinedChessAPI = new CombinedChessAPI()
export default combinedChessAPI