import dotenv from "dotenv";

dotenv.config();
import express from "express";
import cors from "cors";

import { errorHandler, ErrorType } from "./middlewares/errorHandler";
//import route
import authRoute from "./routes/authRoute";
import userProfileRoute from "./routes/userProfileRoute";
import { app, server } from "./config/index";
import connectDB from "./db/index";
const port = process.env.APP_PORT || 6060;

app.use(cors());
app.use(express.json());
connectDB();
const prefix = "/api/v1";
app.use(`${prefix}/auth`, authRoute);
app.use(`${prefix}/profile`, userProfileRoute);

//error caching
app.all("*", (req, res, next) => {
  const err: ErrorType = new Error(
    "Unhandled Route <==> " +
      req.originalUrl +
      "  | Method: " +
      req.method +
      " | Please check your request again"
  );
  err.statusCode = 404;
  err.kind = "NotFound";
  next(err);
});
//error handler
app.use("/api/v1", errorHandler);

server.listen(port, () => {
  console.log(`Server connect to port successfully http://localhost:${port} `);
});
