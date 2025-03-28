import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string;
  gender?: string;
  roomLimit?: number;
  role?: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
  status?: boolean;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    gender: {
      type: String,
      enum: ["Nam", "Nữ", "Khác"],
      default: "Khác",
    },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    roomLimit: { type: Number, default: 1 },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }, 
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
