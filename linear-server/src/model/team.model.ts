import { Schema, model } from "mongoose";

export interface ITeam {
  _id?: string;
  name: string;
  identifier: string; // e.g., "ENG" for Engineering
  description?: string;
  icon?: string;
  members: string[];
  archived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    identifier: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String },
    members: [{ type: Schema.Types.ObjectId as any, ref: "user" }],
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TeamModel = model<ITeam>("team", teamSchema);

export default TeamModel;

