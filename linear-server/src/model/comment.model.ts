import { Schema, model } from "mongoose";

export interface IComment {
  _id?: string;
  issue: string;
  body: string;
  author: string;
  parent?: string; // For threaded comments
  reactions?: {
    emoji: string;
    users: string[];
  }[];
  attachments?: string[];
  mentions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const commentSchema = new Schema<IComment>(
  {
    issue: { type: Schema.Types.ObjectId as any, ref: "ticket", required: true },
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId as any, ref: "user", required: true },
    parent: { type: Schema.Types.ObjectId as any, ref: "comment" },
    reactions: [
      {
        emoji: { type: String, required: true },
        users: [{ type: Schema.Types.ObjectId as any, ref: "user" }],
      },
    ],
    attachments: [{ type: String }],
    mentions: [{ type: Schema.Types.ObjectId as any, ref: "user" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CommentModel = model<IComment>("comment", commentSchema);

export default CommentModel;

