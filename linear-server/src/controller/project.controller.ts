import { Request, Response, Router } from "express";
import ProjectModel from "../model/project.model";
import TicketModel from "../model/ticket.model";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { team } = req.query;
    const query: any = {};
    if (team) query.team = team;
    
    const projects = await ProjectModel.find(query)
      .populate("team")
      .populate("lead")
      .sort({ createdAt: -1 });
    
    // Calculate progress for each project
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const issues = await TicketModel.find({ project: project._id });
        const completed = issues.filter((i) => i.status === "DONE").length;
        const progress = issues.length > 0 ? (completed / issues.length) * 100 : 0;
        return { ...project.toObject(), progress: Math.round(progress) };
      })
    );
    
    return res.status(200).send(projectsWithProgress);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const project = await ProjectModel.findById(req.params.id)
      .populate("team")
      .populate("lead");
    if (!project) return res.status(404).send({ message: "Project not found" });
    
    const issues = await TicketModel.find({ project: project._id });
    const completed = issues.filter((i) => i.status === "DONE").length;
    const progress = issues.length > 0 ? (completed / issues.length) * 100 : 0;
    
    return res.status(200).send({ ...project.toObject(), progress: Math.round(progress) });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const project = await ProjectModel.create(req.body);
    return res.status(201).send(project);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const project = await ProjectModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) return res.status(404).send({ message: "Project not found" });
    return res.status(200).send(project);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const project = await ProjectModel.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).send({ message: "Project not found" });
    return res.status(200).send({ message: "Project deleted" });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

export default router;

