import express from "express";
import { getOptions, createRoom } from "../controller/roomController";
const Router = express.Router();

Router.get("/options/:roomId", getOptions);
Router.post("/", createRoom);
Router.get("/", createRoom);
export default Router;
