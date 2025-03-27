import express from "express";
import { getOptions } from "../controller/roomController";
const Router = express.Router();

Router.get("/options/:roomId", getOptions);

export default Router;
