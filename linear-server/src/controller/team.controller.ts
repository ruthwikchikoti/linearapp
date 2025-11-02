import { Request, Response, Router } from "express";
import TeamModel from "../model/team.model";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const teams = await TeamModel.find({ archived: false })
      .populate("members")
      .sort({ createdAt: -1 });
    return res.status(200).send(teams);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const team = await TeamModel.findById(req.params.id).populate("members");
    if (!team) return res.status(404).send({ message: "Team not found" });
    return res.status(200).send(team);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const team = await TeamModel.create(req.body);
    return res.status(201).send(team);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const team = await TeamModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("members");
    if (!team) return res.status(404).send({ message: "Team not found" });
    return res.status(200).send(team);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const team = await TeamModel.findByIdAndUpdate(
      req.params.id,
      { archived: true },
      { new: true }
    );
    if (!team) return res.status(404).send({ message: "Team not found" });
    return res.status(200).send(team);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

export default router;

