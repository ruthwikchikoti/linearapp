import { Request, Response, Router } from "express";
import CycleModel from "../model/cycle.model";
import TicketModel from "../model/ticket.model";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { team } = req.query;
    const query: any = { archived: false };
    if (team) query.team = team;
    
    const cycles = await CycleModel.find(query)
      .populate("team")
      .sort({ startDate: -1 });
    
    // Calculate progress for each cycle
    const cyclesWithProgress = await Promise.all(
      cycles.map(async (cycle) => {
        const issues = await TicketModel.find({ cycle: cycle._id });
        const completed = issues.filter((i) => i.status === "DONE").length;
        const progress = issues.length > 0 ? (completed / issues.length) * 100 : 0;
        return { ...cycle.toObject(), progress: Math.round(progress) };
      })
    );
    
    return res.status(200).send(cyclesWithProgress);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const cycle = await CycleModel.findById(req.params.id).populate("team");
    if (!cycle) return res.status(404).send({ message: "Cycle not found" });
    
    const issues = await TicketModel.find({ cycle: cycle._id });
    const completed = issues.filter((i) => i.status === "DONE").length;
    const progress = issues.length > 0 ? (completed / issues.length) * 100 : 0;
    
    return res.status(200).send({ ...cycle.toObject(), progress: Math.round(progress) });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const cycle = await CycleModel.create(req.body);
    
    // Auto-include active issues in the cycle
    if (req.body.team) {
      const activeIssues = await TicketModel.find({
        team: req.body.team,
        status: { $in: ["TODO", "INPROGRESS", "IN_DEV_REVIEW"] },
        cycle: { $exists: false },
      });
      
      // Optionally auto-assign first batch of active issues
      // Or just update cycle association for existing active issues
      if (activeIssues.length > 0) {
        await TicketModel.updateMany(
          { _id: { $in: activeIssues.map((i) => i._id) } },
          { cycle: cycle._id }
        );
      }
    }
    
    return res.status(201).send(cycle);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const cycle = await CycleModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!cycle) return res.status(404).send({ message: "Cycle not found" });
    return res.status(200).send(cycle);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const cycle = await CycleModel.findByIdAndUpdate(
      req.params.id,
      { archived: true },
      { new: true }
    );
    if (!cycle) return res.status(404).send({ message: "Cycle not found" });
    return res.status(200).send(cycle);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

export default router;

