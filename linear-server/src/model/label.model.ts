import { Schema, model } from "mongoose";

export interface ILabel {
  _id?: string;
  name: string;
  color: string;
  team: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const labelSchema = new Schema<ILabel>(
  {
    name: { type: String, required: true },
    color: { type: String, required: true, default: "#5E6AD2" },
    team: { type: Schema.Types.ObjectId as any, ref: "team", required: true },
    description: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const LabelModel = model<ILabel>("label", labelSchema);

export default LabelModel;
