import express from 'express';
import axios from 'axios';

const router = express.Router();

// Cache for news (refresh every hour)
let newsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Fetch chess news from Chess.com API
router.get('/', async (req, res) => {
  try {
    // Check cache
    if (newsCache && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
      return res.json(newsCache);
    }

    // Fetch from Chess.com API
    try {
      const response = await axios.get('https://api.chess.com/pub/news', {
        timeout: 10000
      });
      
      const news = response.data || [];
      
      // Transform data to a simpler format
      const formattedNews = news.slice(0, 10).map(item => ({
        title: item.title || 'Chess News',
        url: item.url || '#',
        date: item.date || new Date().toISOString(),
        excerpt: item.excerpt || '',
        image: item.image || null
      }));

      newsCache = { news: formattedNews };
      cacheTimestamp = Date.now();

      res.json(newsCache);
    } catch (apiError) {
      // Fallback to mock data if API fails
      console.warn('Chess.com API failed, using mock data:', apiError.message);
      
      const mockNews = [
        {
          title: 'Grandmaster Tournament Update',
          url: '#',
          date: new Date().toISOString(),
          excerpt: 'Latest updates from the world championship tournament.',
          image: null
        },
        {
          title: 'New Chess Opening Discovered',
          url: '#',
          date: new Date().toISOString(),
          excerpt: 'Players are exploring innovative opening strategies.',
          image: null
        },
        {
          title: 'Chess Engine Reaches New Milestone',
          url: '#',
          date: new Date().toISOString(),
          excerpt: 'AI chess engines continue to improve their playing strength.',
          image: null
        },
        {
          title: 'Youth Chess Championship Results',
          url: '#',
          date: new Date().toISOString(),
          excerpt: 'Young talents showcase their skills in international competition.',
          image: null
        },
        {
          title: 'Chess Education Programs Expand',
          url: '#',
          date: new Date().toISOString(),
          excerpt: 'More schools are incorporating chess into their curriculum.',
          image: null
        }
      ];

      newsCache = { news: mockNews };
      cacheTimestamp = Date.now();

      res.json(newsCache);
    }
  } catch (error) {
    console.error('News fetch error:', error);
    res.status(500).json({ message: 'Error fetching chess news', news: [] });
  }
});

export default router;
