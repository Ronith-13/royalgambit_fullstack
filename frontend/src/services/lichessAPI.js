// Lichess API service
const LICHESS_API_BASE = 'https://lichess.org/api'

class LichessAPI {
  // Get recent games from top players
  async getTopPlayerGames(count = 10) {
    try {
      const response = await fetch(`${LICHESS_API_BASE}/games/export/_ids?ids=`, {
        method: 'POST',
        headers: {
          'Accept': 'application/x-ndjson'
        }
      })
      return await response.text()
    } catch (error) {
      console.error('Error fetching top player games:', error)
      throw error
    }
  }

  // Get user profile
  async getUserProfile(username) {
    try {
      const response = await fetch(`${LICHESS_API_BASE}/user/${username}`)
      if (!response.ok) throw new Error('User not found')
      return await response.json()
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }
  }

  // Get leaderboard
  async getLeaderboard(perfType = 'blitz', nb = 10) {
    try {
      const response = await fetch(`${LICHESS_API_BASE}/player/top/${nb}/${perfType}`)
      if (!response.ok) throw new Error('Failed to fetch leaderboard')
      return await response.json()
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      throw error
    }
  }

  // Get recent tournaments
  async getTournaments() {
    try {
      const response = await fetch(`${LICHESS_API_BASE}/tournament`)
      if (!response.ok) throw new Error('Failed to fetch tournaments')
      return await response.json()
    } catch (error) {
      console.error('Error fetching tournaments:', error)
      throw error
    }
  }

  // Get user's recent games
  async getUserGames(username, max = 10) {
    try {
      const response = await fetch(`${LICHESS_API_BASE}/games/user/${username}?max=${max}&pgnInJson=false&tags=false&clocks=false&evals=false&opening=true`)
      if (!response.ok) throw new Error('Failed to fetch user games')
      
      const text = await response.text()
      const games = text.trim().split('\n').filter(line => line).map(line => JSON.parse(line))
      return games
    } catch (error) {
      console.error('Error fetching user games:', error)
      throw error
    }
  }

  // Get puzzle of the day (using puzzle rush data)
  async getDailyPuzzle() {
    try {
      const response = await fetch(`${LICHESS_API_BASE}/puzzle/daily`)
      if (!response.ok) throw new Error('Failed to fetch daily puzzle')
      return await response.json()
    } catch (error) {
      console.error('Error fetching daily puzzle:', error)
      throw error
    }
  }

  // Get current online players count
  async getOnlineCount() {
    try {
      const response = await fetch(`${LICHESS_API_BASE}/users/status`)
      if (!response.ok) throw new Error('Failed to fetch online count')
      return await response.json()
    } catch (error) {
      console.error('Error fetching online count:', error)
      throw error
    }
  }

  // Convert tournament data to news format
  formatTournamentAsNews(tournaments) {
    return tournaments.created.slice(0, 5).map(tournament => ({
      id: tournament.id,
      title: `${tournament.fullName} Tournament`,
      excerpt: `${tournament.variant.name} tournament with ${tournament.nbPlayers} players. Status: ${tournament.status === 10 ? 'Upcoming' : tournament.status === 20 ? 'Started' : 'Finished'}`,
      date: new Date(tournament.startsAt || tournament.createdAt).toISOString(),
      source: 'Lichess',
      type: 'tournament',
      url: `https://lichess.org/tournament/${tournament.id}`
    }))
  }

  // Convert leaderboard to news format
  formatLeaderboardAsNews(leaderboard, perfType) {
    const topPlayer = leaderboard.users[0]
    return [{
      id: `leaderboard-${perfType}`,
      title: `${topPlayer.username} leads ${perfType.charAt(0).toUpperCase() + perfType.slice(1)} leaderboard`,
      excerpt: `${topPlayer.username} is currently #1 in ${perfType} with a rating of ${topPlayer.perfs[perfType]?.rating || 'N/A'}. Check out the current top players!`,
      date: new Date().toISOString(),
      source: 'Lichess',
      type: 'leaderboard'
    }]
  }

  // Get comprehensive chess news from Lichess
  async getChessNews() {
    try {
      const [tournaments, blitzLeaderboard] = await Promise.all([
        this.getTournaments().catch(() => ({ created: [] })),
        this.getLeaderboard('blitz', 10).catch(() => ({ users: [] }))
      ])

      const news = []

      // Add tournament news
      if (tournaments.created && tournaments.created.length > 0) {
        news.push(...this.formatTournamentAsNews(tournaments))
      }

      // Add leaderboard news
      if (blitzLeaderboard.users && blitzLeaderboard.users.length > 0) {
        news.push(...this.formatLeaderboardAsNews(blitzLeaderboard, 'blitz'))
      }

      // Add some general chess facts/tips as news
      const chessTips = [
        {
          id: 'tip-1',
          title: 'Chess Tip: Control the Center',
          excerpt: 'Controlling the center squares (e4, e5, d4, d5) gives your pieces more mobility and influence over the board.',
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          source: 'Chess Strategy',
          type: 'tip'
        },
        {
          id: 'tip-2',
          title: 'Opening Principle: Develop Knights Before Bishops',
          excerpt: 'Knights are generally developed before bishops because they have fewer good squares and their best squares are easier to identify.',
          date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          source: 'Chess Strategy',
          type: 'tip'
        }
      ]

      news.push(...chessTips)

      // Sort by date (newest first)
      return news.sort((a, b) => new Date(b.date) - new Date(a.date))

    } catch (error) {
      console.error('Error getting chess news from Lichess:', error)
      throw error
    }
  }
}

export const lichessAPI = new LichessAPI()
export default lichessAPI