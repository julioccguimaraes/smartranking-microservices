import mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String },
    email: { type: String, unique: true },
    name: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
    ranking: { type: String },
    rankingPosition: { type: Number },
    photoUrl: { type: String },
  },
  { timestamps: true, collection: 'player' },
);
