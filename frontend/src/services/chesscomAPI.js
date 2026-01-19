// Chess.com API service
const CHESSCOM_API_BASE = 'https://api.chess.com/pub'

class ChesscomAPI {
  // Get player profile
  async getPlayerProfile(username) {
    try {
      const response = await fetch(`${CHESSCOM_API_BASE}/player/${username}`)
      if (!response.ok) throw new Error('Player not found')
      return await response.json()
    } catch (error) {
      console.error('Error fetching Chess.com player profile:', error)
      throw error
    }
  }

  // Get player stats
  async getPlayerStats(username) {
    try {
      const response = await fetch(`${CHESSCOM_API_BASE}/player/${username}/stats`)
      if (!response.ok) throw new Error('Player stats not found')
      return await response.json()
    } catch (error) {
      console.error('Error fetching Chess.com player stats:', error)
      throw error
    }
  }

  // Get player's current games
  async getPlayerCurrentGames(username) {
    try {
      const response = await fetch(`${CHESSCOM_API_BASE}/player/${username}/games`)
      if (!response.ok) throw new Error('Current games not found')
      return await response.json()
    } catch (error) {
      console.error('Error fetching Chess.com current games:', error)
      throw error
    }
  }

  // Get player's game archives (monthly)
  async getPlayerGameArchives(username) {
    try {
      const response = await fetch(`${CHESSCOM_API_BASE}/player/${username}/games/archives`)
      if (!response.ok) throw new Error('Game archives not found')
      return await response.json()
    } catch (error) {
      console.error('Error fetching Chess.com game archives:', error)
      throw error
    }
  }

  // Get games from specific month
  async getMonthlyGames(username, year, month) {
    try {
      const paddedMonth = month.toString().padStart(2, '0')
      const response = await fetch(`${CHESSCOM_API_BASE}/player/${username}/games/${year}/${paddedMonth}`)
      if (!response.ok) throw new Error('Monthly games not found')
      return await response.json()
    } catch (error) {
      console.error('Error fetching Chess.com monthly games:', error)
      throw error
    }
  }

  // Get daily puzzle
  async getDailyPuzzle() {
    try {
      const response = await fetch(`${CHESSCOM_API_BASE}/puzzle`)
      if (!response.ok) throw new Error('Daily puzzle not found')
      return await response.json()
    } catch (error) {
      console.error('Error fetching Chess.com daily puzzle:', error)
      throw error
    }
  }

  // Get random puzzle
  async getRandomPuzzle() {
    try {
      const response = await fetch(`${CHESSCOM_API_BASE}/puzzle/random`)
      if (!response.ok) throw new Error('Random puzzle not found')
      return await response.json()
    } catch (error) {
      console.error('Error fetching Chess.com random puzzle:', error)
      throw error
    }
  }

  // Get streamers
  async getStreamers() {
    try {
      const response = await fetch(`${CHESSCOM_API_BASE}/streamers`)
      if (!response.ok) throw new Error('Streamers not found')
      return await response.json()
    } catch (error) {
      console.error('Error fetching Chess.com streamers:', error)
      throw error
    }
  }

  // Get leaderboards
  async getLeaderboards() {
    try {
      const response = await fetch(`${CHESSCOM_API_BASE}/leaderboards`)
      if (!response.ok) throw new Error('Leaderboards not found')
      return await response.json()
    } catch (error) {
      console.error('Error fetching Chess.com leaderboards:', error)
      throw error
    }
  }

  // Get country details
  async getCountry(countryCode) {
    try {
      const response = await fetch(`${CHESSCOM_API_BASE}/country/${countryCode}`)
      if (!response.ok) throw new Error('Country not found')
      return await response.json()
    } catch (error) {
      console.error('Error fetching Chess.com country:', error)
      throw error
    }
  }

  // Get country players
  async getCountryPlayers(countryCode) {
    try {
      const response = await fetch(`${CHESSCOM_API_BASE}/country/${countryCode}/players`)
      if (!response.ok) throw new Error('Country players not found')
      return await response.json()
    } catch (error) {
      console.error('Error fetching Chess.com country players:', error)
      throw error
    }
  }

  // Format player achievements as news
  formatPlayerAsNews(player, stats) {
    const news = []
    
    if (stats.chess_rapid?.last?.rating > 2000) {
      news.push({
        id: `player-${player.username}-rapid`,
        title: `${player.username} achieves ${stats.chess_rapid.last.rating} rapid rating`,
        excerpt: `Player ${player.username} has reached an impressive rapid rating of ${stats.chess_rapid.last.rating} on Chess.com.`,
        date: new Date(stats.chess_rapid.last.date * 1000).toISOString(),
        source: 'Chess.com',
        type: 'achievement',
        url: player.url
      })
    }

    if (stats.chess_blitz?.last?.rating > 2000) {
      news.push({
        id: `player-${player.username}-blitz`,
        title: `${player.username} reaches ${stats.chess_blitz.last.rating} blitz rating`,
        excerpt: `Impressive blitz performance by ${player.username} with a rating of ${stats.chess_blitz.last.rating}.`,
        date: new Date(stats.chess_blitz.last.date * 1000).toISOString(),
        source: 'Chess.com',
        type: 'achievement',
        url: player.url
      })
    }

    return news
  }

  // Format streamers as news
  formatStreamersAsNews(streamers) {
    return streamers.streamers.slice(0, 3).map(streamer => ({
      id: `streamer-${streamer.username}`,
      title: `${streamer.username} is streaming chess`,
      excerpt: `Watch ${streamer.username} play chess live on their stream. Join the community and learn from their gameplay!`,
      date: new Date().toISOString(),
      source: 'Chess.com',
      type: 'streaming',
      url: streamer.twitch_url || streamer.url
    }))
  }

  // Format leaderboards as news
  formatLeaderboardsAsNews(leaderboards) {
    const news = []
    
    if (leaderboards.daily && leaderboards.daily.length > 0) {
      const topPlayer = leaderboards.daily[0]
      news.push({
        id: 'leaderboard-daily',
        title: `${topPlayer.username} leads Daily Chess leaderboard`,
        excerpt: `${topPlayer.username} is currently #1 in Daily Chess with ${topPlayer.score} points and a win rate of ${topPlayer.win_percentage}%.`,
        date: new Date().toISOString(),
        source: 'Chess.com',
        type: 'leaderboard',
        url: `https://chess.com/member/${topPlayer.username}`
      })
    }

    if (leaderboards.live_rapid && leaderboards.live_rapid.length > 0) {
      const topPlayer = leaderboards.live_rapid[0]
      news.push({
        id: 'leaderboard-rapid',
        title: `${topPlayer.username} dominates Rapid Chess leaderboard`,
        excerpt: `${topPlayer.username} holds the #1 spot in Rapid Chess with ${topPlayer.score} points.`,
        date: new Date().toISOString(),
        source: 'Chess.com',
        type: 'leaderboard',
        url: `https://chess.com/member/${topPlayer.username}`
      })
    }

    if (leaderboards.live_blitz && leaderboards.live_blitz.length > 0) {
      const topPlayer = leaderboards.live_blitz[0]
      news.push({
        id: 'leaderboard-blitz',
        title: `${topPlayer.username} tops Blitz Chess leaderboard`,
        excerpt: `${topPlayer.username} is the current Blitz Chess leader with ${topPlayer.score} points.`,
        date: new Date().toISOString(),
        source: 'Chess.com',
        type: 'leaderboard',
        url: `https://chess.com/member/${topPlayer.username}`
      })
    }

    return news
  }

  // Format puzzle as news
  formatPuzzleAsNews(puzzle) {
    return {
      id: `puzzle-${puzzle.publish_time}`,
      title: 'Daily Chess Puzzle Available',
      excerpt: `Today's puzzle: ${puzzle.title}. Test your tactical skills with this ${puzzle.rating}-rated puzzle.`,
      date: new Date(puzzle.publish_time * 1000).toISOString(),
      source: 'Chess.com',
      type: 'puzzle',
      url: puzzle.url
    }
  }

  // Get comprehensive chess news from Chess.com
  async getChessNews() {
    try {
      const news = []

      // Get featured players (popular streamers/players)
      const featuredPlayers = ['hikaru', 'gothamchess', 'chessnetwork', 'saint_louis_chess_club']
      
      // Get leaderboards
      try {
        const leaderboards = await this.getLeaderboards()
        news.push(...this.formatLeaderboardsAsNews(leaderboards))
      } catch (error) {
        console.warn('Failed to fetch Chess.com leaderboards:', error)
      }

      // Get streamers
      try {
        const streamers = await this.getStreamers()
        if (streamers.streamers && streamers.streamers.length > 0) {
          news.push(...this.formatStreamersAsNews(streamers))
        }
      } catch (error) {
        console.warn('Failed to fetch Chess.com streamers:', error)
      }

      // Get daily puzzle
      try {
        const puzzle = await getDailyPuzzle()
        news.push(this.formatPuzzleAsNews(puzzle))
      } catch (error) {
        console.warn('Failed to fetch Chess.com daily puzzle:', error)
      }

      // Get some featured player stats
      for (const username of featuredPlayers.slice(0, 2)) {
        try {
          const [player, stats] = await Promise.all([
            this.getPlayerProfile(username),
            this.getPlayerStats(username)
          ])
          news.push(...this.formatPlayerAsNews(player, stats))
          break // Only get one successful player to avoid rate limits
        } catch (error) {
          console.warn(`Failed to fetch data for ${username}:`, error)
          continue
        }
      }

      // Add some Chess.com specific tips
      const chesscomTips = [
        {
          id: 'chesscom-tip-1',
          title: 'Chess.com Feature: Analysis Board',
          excerpt: 'Use Chess.com\'s analysis board to study your games and find the best moves with engine assistance.',
          date: new Date(Date.now() - 86400000).toISOString(),
          source: 'Chess.com',
          type: 'tip'
        },
        {
          id: 'chesscom-tip-2',
          title: 'Daily Puzzles Improve Tactics',
          excerpt: 'Solving daily puzzles on Chess.com is one of the best ways to improve your tactical vision and pattern recognition.',
          date: new Date(Date.now() - 172800000).toISOString(),
          source: 'Chess.com',
          type: 'tip'
        }
      ]

      news.push(...chesscomTips)

      // Sort by date (newest first)
      return news.sort((a, b) => new Date(b.date) - new Date(a.date))

    } catch (error) {
      console.error('Error getting chess news from Chess.com:', error)
      throw error
    }
  }
}

export const chesscomAPI = new ChesscomAPI()
export default chesscomAPI