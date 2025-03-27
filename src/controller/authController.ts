import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import UserProfile from "../models/UserProfile";
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  try {
    const userFind = await User.findOne({ email });
    if (!userFind) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const isMatch = await bcrypt.compare(password, userFind.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const profile = await UserProfile.findOne({ userId: userFind._id });
    res.status(200).json({
      message: "Login successful",
      data: {
        user: {
          id: userFind._id,
          userName: userFind.username,
          email: userFind.email,
          password: userFind.password,
          avatar: userFind.avatar,
          role: userFind.role,
        },
        dayOfBirth: profile?.dayOfBirth || "",
        bio: profile?.bio,
        nickname: profile?.nickname,
        gender: userFind.gender,
      },
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, gender } = req.body;
  if (!username || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  try {
    const newUser = await User.create({
      username,
      email,
      password,
      gender,
    });
    const profile = await UserProfile.create({
      userId: newUser._id,
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser, profile });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};
