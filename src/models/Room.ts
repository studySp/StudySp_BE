import mongoose, { Schema, Document } from "mongoose";
export interface IRoom extends Document {
  title: string;
  author: string;
  isPrivate: boolean;
  allowCamera: boolean;
  allowMic: boolean;
  hasPassword: boolean;
  password: string;
}

const RoomSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    tag: {
      type: String,
    },
    isPrivate: { type: Boolean, default: false },
    allowCamera: { type: Boolean, default: true },
    allowMic: { type: Boolean, default: true },
    hasPassword: { type: Boolean, default: false },
    password: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model<IRoom>("Room", RoomSchema);

export default Room;
