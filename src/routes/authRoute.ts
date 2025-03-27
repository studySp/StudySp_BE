import express from "express";
import { login, register } from "../controller/authController";

const Router = express.Router();
Router.post("/login", login);
Router.post("/register", register);
export default Router;
