import { Schema, model } from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "member" | "guest";
  teams: string[];
  preferences?: {
    theme?: "light" | "dark";
    notifications?: boolean;
    emailNotifications?: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    role: { type: String, enum: ["admin", "member", "guest"], default: "member" },
    teams: [{ type: Schema.Types.ObjectId as any, ref: "team" }],
    preferences: {
      theme: { type: String, enum: ["light", "dark"], default: "dark" },
      notifications: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = model<IUser>("user", userSchema);

export default UserModel;

