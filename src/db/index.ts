"use strict";
import e from "express";
import mongoose from "mongoose";
let connectString = `${process.env.MONGO_URI}`;

const connectDB = async () => {
  try {
    await mongoose.connect(connectString);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed", error);
  }
};

export default connectDB;
