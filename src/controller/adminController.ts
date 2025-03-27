import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import User from "../models/User";
import Report from "../models/Report";
import Room from "../models/Room";

const logDirectory = path.join(__dirname, "../../src/resources/logs");
const policyFilePath = path.join(__dirname, "../../src/resources/policy/policy.txt");
console.log("logDirectory", logDirectory);
console.log("policyFilePath", policyFilePath);

//View Log Files
export const getLogFiles = async (req: Request, res: Response): Promise<void> => {
    try {
        const files = await fs.readdir(logDirectory);
        res.json({ files });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách file log:", error);
        res.status(500).json({ error: "Không thể lấy danh sách log" });
    }
};

export const getLogContent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { filename } = req.params;
        const filePath = path.join(logDirectory, filename);

        const content = await fs.readFile(filePath, "utf-8");

        const logs = content.split("\n").filter(Boolean).map(line => {
            const match = line.match(/\[(.*?)\] (.*?) - (.*)/);
            return match ? { timestamp: match[1], level: match[2], message: match[3] } : null;
        }).filter(Boolean);

        res.json({ logs });
    } catch (error) {
        console.error("Lỗi khi đọc file log:", error);
        res.status(500).json({ error: "Không thể đọc file log" });
    }
};

//Policy
export const getPolicy = async (req: Request, res: Response): Promise<void> => {
    try {
        const policy = await fs.readFile(policyFilePath, "utf-8");
        res.json({ policy });
    } catch (error) {
        console.error("Lỗi khi đọc policy:", error);
        res.status(500).json({ error: "Không thể đọc policy" });
    }
};

export const updatePolicy = async (req: Request, res: Response): Promise<void> => {
    try {
        const { policy } = req.body;
        if (!policy) {
            res.status(400).json({ error: "Dữ liệu không hợp lệ" });
            return;
        }

        await fs.writeFile(policyFilePath, policy, "utf-8");
        res.json({ message: "Lưu thành công!" });
    } catch (error) {
        console.error("Lỗi khi ghi policy:", error);
        res.status(500).json({ error: "Không thể lưu policy" });
    }
};

//User
// Lấy danh sách người dùng
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng" });
    }
};

export const banUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: "Không tìm thấy người dùng" });
            return;
        }

        user.status = !user.status;
        await user.save();

        res.json({ message: `Tài khoản đã ${user.status ? "được mở khóa" : "bị khóa"}` });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật trạng thái người dùng" });
    }
};

//Report
// Lấy danh sách tất cả report (kèm thông tin người report)
export const getReports = async (req: Request, res: Response) => {
    try {
        const reports = await Report.find()
            .populate("userReport", "username email avatar")
            .populate("userReported", "username email avatar");

        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách báo cáo" });
    }
};

// Cập nhật trạng thái và kết quả báo cáo
export const updateReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status, result } = req.body;
        const report = await Report.findById(req.params.id);

        if (!report) {
            res.status(404).json({ message: "Báo cáo không tồn tại" });
            return;
        }

        report.status = status;
        if (result) report.result = result;

        await report.save();
        res.json({ message: "Cập nhật báo cáo thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật báo cáo" });
    }
};

//Room
// Lấy danh sách phòng
export const getRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy danh sách phòng" });
    }
};

// Cập nhật thông tin phòng
export const updateRoom = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { isPrivate, allowCamera, allowMic, hasPassword, password } = req.body;
        
        const room = await Room.findById(id);

        if (!room || room === null) {
            res.status(404).json({ error: "Không tìm thấy phòng" });
            return;
        }

        room.isPrivate = isPrivate;
        room.allowCamera = allowCamera;
        room.allowMic = allowMic;
        room.hasPassword = hasPassword;
        room.password = password;

        const updatedRoom = await room.save();

        res.json(updatedRoom);
    } catch (error) {
        console.error("Lỗi khi cập nhật phòng:", error);
        res.status(500).json({ error: "Lỗi khi cập nhật phòng" });
    }
};
