import { Schema, model } from "mongoose";

export interface IActivity {
  _id?: string;
  type: "issue_created" | "issue_updated" | "issue_assigned" | "comment_added" | "mention" | "status_changed";
  issue?: string;
  user: string;
  team: string;
  data?: any; // Flexible data field for activity-specific info
  createdAt?: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    type: {
      type: String,
      enum: ["issue_created", "issue_updated", "issue_assigned", "comment_added", "mention", "status_changed"],
      required: true,
    },
    issue: { type: Schema.Types.ObjectId as any, ref: "ticket" },
    user: { type: Schema.Types.ObjectId as any, ref: "user", required: true },
    team: { type: Schema.Types.ObjectId as any, ref: "team", required: true },
    data: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ActivityModel = model<IActivity>("activity", activitySchema);

export default ActivityModel;

