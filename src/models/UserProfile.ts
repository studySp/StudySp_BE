import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUserProfile extends Document {
  userId: Types.ObjectId;
  bio?: string;
  nickname?: string;
  dayOfBirth?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    bio: { type: String },
    nickname: { type: String },
    dayOfBirth: { type: String },
  },
  {
    timestamps: true,
  }
);

const UserProfile = mongoose.model<IUserProfile>(
  "UserProfile",
  UserProfileSchema
);

export default UserProfile;
