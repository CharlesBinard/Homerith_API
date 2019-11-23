import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema(
  {
    victoryPoint: {
      type: Number,
      required: true,
    },
    looserPoint: {
      type: Number,
      required: true,
    },
    victoryTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    looserTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  },
  {
    timestamps: true,
  },
);

const Score = mongoose.model('Score', scoreSchema);

export default Score;
