import mongoose, { Schema, Document } from "mongoose";

export interface IReport extends Document {
  userReport: mongoose.Types.ObjectId;
  userReported?: mongoose.Types.ObjectId;
  title: string;
  detail: string;
  status: "Open" | "Review" | "Resolve" | "Cancel";
  result?: string; // Admin's response
  createdAt?: Date;
  updatedAt?: Date;
}

const ReportSchema: Schema = new Schema(
  {
    userReport: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    userReported: { type: Schema.Types.ObjectId, ref: "User", default: null }, 
    title: { type: String, required: true },
    detail: { type: String, required: true },
    status: { type: String, enum: ["Open", "Review", "Resolve", "Cancel"], default: "Open" },
    result: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model<IReport>("Report", ReportSchema);

export default Report;
