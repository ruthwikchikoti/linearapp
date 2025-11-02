import { Schema, model } from "mongoose";

export interface ICycle {
  _id?: string;
  name: string;
  team: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  completedAt?: Date;
  progress: number;
  archived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const cycleSchema = new Schema<ICycle>(
  {
    name: { type: String, required: true },
    team: { type: Schema.Types.ObjectId as any, ref: "team", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String },
    completedAt: { type: Date },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CycleModel = model<ICycle>("cycle", cycleSchema);

export default CycleModel;

