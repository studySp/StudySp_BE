import express from "express";
import {
  getOptions,
  createRoom,
  updateOptions,
} from "../controller/roomController";
const Router = express.Router();

Router.get("/:roomId", getOptions);
Router.put("/options/:roomId", updateOptions);
Router.post("/", createRoom);
Router.get("/", createRoom);
export default Router;
