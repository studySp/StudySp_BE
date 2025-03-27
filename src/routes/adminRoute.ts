import express from "express";
import { getLogFiles, getLogContent, getPolicy, updatePolicy, getUsers, banUser, getReports, updateReport, getRooms, updateRoom } from "../controller/adminController";

const router = express.Router();

// API Log
router.get("/logs", getLogFiles);
router.get("/logs/:filename", getLogContent);

// API Policy
router.get("/policy", getPolicy);
router.post("/policy", updatePolicy);

//API User
router.get("/userList", getUsers);
router.put("/user/ban/:id", banUser);

//API Report
router.get("/reportList", getReports);
router.put("/report/:id", updateReport);

//API Room
router.get("/roomList", getRooms);
router.put("/room/:id", updateRoom);

export default router;
