import mongoose, { Schema, Document, Types } from "mongoose";

export interface IGift extends Document {
  userId: Types.ObjectId;
  bio?: string;
  nickname?: string;
  dob?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GiftSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    bio: { type: String },
    nickname: { type: String },
    dob: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Gift = mongoose.model<IGift>("Gift", GiftSchema);

export default Gift;
