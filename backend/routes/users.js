import express from 'express';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        points: user.points,
        stats: user.stats,
        winRate: user.getWinRate()
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user stats and points
router.put('/me/stats', authenticateToken, async (req, res) => {
  try {
    const { result, points } = req.body; // result: 'win', 'loss', 'draw'

    if (!result || !['win', 'loss', 'draw'].includes(result)) {
      return res.status(400).json({ message: 'Invalid result. Must be win, loss, or draw' });
    }

    const user = await User.findById(req.user._id);
    
    // Update stats
    if (result === 'win') {
      user.stats.wins += 1;
    } else if (result === 'loss') {
      user.stats.losses += 1;
    } else if (result === 'draw') {
      user.stats.draws += 1;
    }

    // Add points if provided (only for wins)
    if (points && result === 'win') {
      user.points += points;
    }

    await user.save();

    res.json({
      message: 'Stats updated successfully',
      user: {
        id: user._id,
        username: user.username,
        points: user.points,
        stats: user.stats,
        winRate: user.getWinRate()
      }
    });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ message: 'Server error updating stats' });
  }
});

export default router;
