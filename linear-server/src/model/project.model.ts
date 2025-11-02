import { Schema, model } from "mongoose";

export interface IProject {
  _id?: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  team: string;
  lead?: string;
  status: "planned" | "active" | "paused" | "completed" | "cancelled";
  startDate?: Date;
  targetDate?: Date;
  progress: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const projectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String },
    icon: { type: String },
    color: { type: String, default: "#5E6AD2" },
    team: { type: Schema.Types.ObjectId as any, ref: "team", required: true },
    lead: { type: Schema.Types.ObjectId as any, ref: "user" },
    status: {
      type: String,
      enum: ["planned", "active", "paused", "completed", "cancelled"],
      default: "planned",
    },
    startDate: { type: Date },
    targetDate: { type: Date },
    progress: { type: Number, default: 0, min: 0, max: 100 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ProjectModel = model<IProject>("project", projectSchema);

export default ProjectModel;

