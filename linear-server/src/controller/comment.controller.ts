import { Request, Response, Router } from "express";
import CommentModel from "../model/comment.model";
import ActivityModel from "../model/activity.model";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { issue } = req.query;
    const query: any = {};
    if (issue) query.issue = issue;
    
    const comments = await CommentModel.find(query)
      .populate("author")
      .populate("parent")
      .populate("mentions")
      .sort({ createdAt: 1 });
    return res.status(200).send(comments);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const comment = await CommentModel.findById(req.params.id)
      .populate("author")
      .populate("parent")
      .populate("mentions");
    if (!comment) return res.status(404).send({ message: "Comment not found" });
    return res.status(200).send(comment);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const comment = await CommentModel.create(req.body);
    const populatedComment = await CommentModel.findById(comment._id)
      .populate("author")
      .populate("mentions");
    
    // Create activity
    await ActivityModel.create({
      type: "comment_added",
      issue: comment.issue,
      user: comment.author,
      team: req.body.team,
      data: { commentId: comment._id },
    });
    
    return res.status(201).send(populatedComment);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const comment = await CommentModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("author");
    if (!comment) return res.status(404).send({ message: "Comment not found" });
    return res.status(200).send(comment);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.patch("/:id/reaction", async (req: Request, res: Response) => {
  try {
    const { emoji, userId, action } = req.body; // action: 'add' or 'remove'
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) return res.status(404).send({ message: "Comment not found" });
    
    if (!comment.reactions) comment.reactions = [];
    
    let reaction = comment.reactions.find((r) => r.emoji === emoji);
    
    if (action === "add") {
      if (!reaction) {
        comment.reactions.push({ emoji, users: [userId] });
      } else if (!reaction.users.includes(userId)) {
        reaction.users.push(userId);
      }
    } else if (action === "remove") {
      if (reaction) {
        reaction.users = reaction.users.filter((id) => id.toString() !== userId);
        if (reaction.users.length === 0) {
          comment.reactions = comment.reactions.filter((r) => r.emoji !== emoji);
        }
      }
    }
    
    await comment.save();
    return res.status(200).send(comment);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const comment = await CommentModel.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).send({ message: "Comment not found" });
    return res.status(200).send({ message: "Comment deleted" });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

export default router;

