import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameType: {
    type: String,
    enum: ['pvp', 'vs-computer'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: null
  },
  result: {
    type: String,
    enum: ['win', 'loss', 'draw'],
    required: true
  },
  pointsAwarded: {
    type: Number,
    default: 0
  },
  moveHistory: [{
    from: { row: Number, col: Number },
    to: { row: Number, col: Number },
    piece: String,
    timestamp: { type: Date, default: Date.now }
  }],
  duration: {
    type: Number, // in seconds
    default: 0
  }
}, {
  timestamps: true
});

const Game = mongoose.model('Game', gameSchema);

export default Game;
