import { Request, Response } from "express";
import Room from "../models/Room";
import { io } from "../config";
export const getOptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const roomId = req.params.roomId;
  const room = Room.findById(roomId).populate("author").lean();

  if (!room) {
    res.status(404).json({ message: "Room not found" });
    return;
  }
  res.status(200).json(room);
};

export const createRoom = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    title,
    author,
    tag,
    isPrivate,
    allowCamera,
    allowMic,
    hasPassword,
    password,
  } = req.body;
  if (!title || !author) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }
  const isLimit = await Room.find({ author }).countDocuments();
  if (isLimit >= 1) {
    res.status(400).json({ message: "Room limit exceeded" });
    return;
  }

  try {
    const newRoom = await Room.create({
      title,
      author,
      tag,
      isPrivate,
      allowCamera,
      allowMic,
      hasPassword,
      password,
    });
    res
      .status(201)
      .json({ message: "Room created successfully", room: newRoom });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

export const getRoomSubjects = async (
  req: Request,
  res: Response
): Promise<void> => {};

export const updateOptions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const update = await Room.findByIdAndUpdate(req.params.roomId, req.body, {
      new: true,
      upsert: true,
    });
    io.to(req.params.roomId).emit("updateOptions", update);
    res.status(200).json({ message: "Room updated successfully" });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};
interface IRoom {
  title: string;
  author: string;
  isPrivate: boolean;
  allowCamera: boolean;
  allowMic: boolean;
  hasPassword: boolean;
  tag: string;
  password: string;
}

export const getRoomById = async (roomId: string): Promise<IRoom> => {
  const room = await Room.findById(roomId).populate("author").lean();
  if (!room) {
    throw new Error("Room not found");
  }
  return {
    title: room.title,
    author: room.author?.username || "",
    isPrivate: room.isPrivate,
    allowCamera: room.allowCamera,
    allowMic: room.allowMic,
    hasPassword: room.hasPassword,
    tag: room.tag,
    password: room.password,
  };
};
