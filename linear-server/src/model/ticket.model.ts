import { Schema, model } from "mongoose";

export interface ITicket {
  _id?: string;
  title: string;
  description?: string;
  status: "TODO" | "INPROGRESS" | "IN_DEV_REVIEW" | "DONE" | "CANCELLED";
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW";
  issueId: string;
  team: string;
  assignee?: string;
  project?: string;
  cycle?: string;
  labels: string[];
  dueDate?: Date;
  sortOrder: number;
  attachments?: string[];
  githubLinks?: string[];
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["TODO", "INPROGRESS", "IN_DEV_REVIEW", "DONE", "CANCELLED"],
      default: "TODO",
    },
    priority: {
      type: String,
      enum: ["URGENT", "HIGH", "MEDIUM", "LOW"],
      default: "MEDIUM",
    },
    issueId: { type: String, required: true, unique: true },
    team: { type: Schema.Types.ObjectId as any, ref: "team", required: true },
    assignee: { type: Schema.Types.ObjectId as any, ref: "user" },
    project: { type: Schema.Types.ObjectId as any, ref: "project" },
    cycle: { type: Schema.Types.ObjectId as any, ref: "cycle" },
    labels: [{ type: Schema.Types.ObjectId as any, ref: "label" }],
    dueDate: { type: Date },
    sortOrder: { type: Number, default: 0 },
    attachments: [{ type: String }],
    githubLinks: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId as any, ref: "user" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TicketModel = model<ITicket>("ticket", ticketSchema);

export default TicketModel;
