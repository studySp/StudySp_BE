import { Request, Response } from "express";
import Room from "../models/Room";
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
