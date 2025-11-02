import { Request, Response, Router } from "express";
import ActivityModel from "../model/activity.model";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { user, team, issue } = req.query;
    const query: any = {};
    if (user) query.user = user;
    if (team) query.team = team;
    if (issue) query.issue = issue;
    
    const activities = await ActivityModel.find(query)
      .populate("user")
      .populate("issue")
      .populate("team")
      .sort({ createdAt: -1 })
      .limit(100);
    return res.status(200).send(activities);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const activity = await ActivityModel.create(req.body);
    return res.status(201).send(activity);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

export default router;

