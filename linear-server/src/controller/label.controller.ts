import { Request, Response, Router } from "express";
import LabelModel from "../model/label.model";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { team } = req.query;
    const query: any = {};
    if (team) query.team = team;
    
    const labels = await LabelModel.find(query).populate("team").sort({ createdAt: -1 });
    return res.status(200).send(labels);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const label = await LabelModel.create(req.body);
    return res.status(201).send(label);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const label = await LabelModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!label) return res.status(404).send({ message: "Label not found" });
    return res.status(200).send(label);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const label = await LabelModel.findByIdAndDelete(req.params.id);
    if (!label) return res.status(404).send({ message: "Label not found" });
    return res.status(200).send({ message: "Label deleted" });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

export default router;

