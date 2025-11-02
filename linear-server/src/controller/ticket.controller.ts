import { Request, Response, Router } from "express";
import TicketModel from "../model/ticket.model";
import ActivityModel from "../model/activity.model";
import TeamModel from "../model/team.model";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      team,
      assignee,
      status,
      priority,
      project,
      cycle,
      label,
      search,
      sortBy = "sortOrder",
      order = "asc",
    } = req.query;

    const query: any = {};
    if (team) query.team = team;
    if (assignee) query.assignee = assignee;
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (project) query.project = project;
    if (cycle) query.cycle = cycle;
    if (label) query.labels = label;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { issueId: { $regex: search, $options: "i" } },
      ];
    }

    const sort: any = {};
    sort[sortBy as string] = order === "desc" ? -1 : 1;

    const tickets = await TicketModel.find(query)
      .populate("team")
      .populate("assignee")
      .populate("project")
      .populate("cycle")
      .populate("labels")
      .populate("createdBy")
      .sort(sort);
    return res.status(200).send(tickets);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const ticket = await TicketModel.findById(req.params.id)
      .populate("team")
      .populate("assignee")
      .populate("project")
      .populate("cycle")
      .populate("labels")
      .populate("createdBy");
    if (!ticket) return res.status(404).send({ message: "Ticket not found" });
    return res.status(200).send(ticket);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    // Generate issue ID
    const team = await TeamModel.findById(req.body.team);
    if (!team) return res.status(404).send({ message: "Team not found" });

    const count = await TicketModel.countDocuments({ team: req.body.team });
    req.body.issueId = `${team.identifier}-${count + 1}`;

    const ticket = await TicketModel.create(req.body);
    const populatedTicket = await TicketModel.findById(ticket._id)
      .populate("team")
      .populate("assignee")
      .populate("project")
      .populate("labels");

    // Create activity
    await ActivityModel.create({
      type: "issue_created",
      issue: ticket._id,
      user: ticket.createdBy || ticket.assignee,
      team: ticket.team,
      data: { issueId: ticket.issueId },
    });

    return res.status(201).send(populatedTicket);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const oldTicket = await TicketModel.findById(req.params.id);
    if (!oldTicket) return res.status(404).send({ message: "Ticket not found" });

    const ticket = await TicketModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("team")
      .populate("assignee")
      .populate("project")
      .populate("cycle")
      .populate("labels");

    // Create activity for status change
    if (req.body.status && oldTicket.status !== req.body.status) {
      await ActivityModel.create({
        type: "status_changed",
        issue: ticket?._id,
        user: req.body.updatedBy || oldTicket.createdBy,
        team: ticket?.team,
        data: { oldStatus: oldTicket.status, newStatus: req.body.status },
      });
    }

    // Create activity for assignment change
    if (req.body.assignee && oldTicket.assignee?.toString() !== req.body.assignee) {
      await ActivityModel.create({
        type: "issue_assigned",
        issue: ticket?._id,
        user: req.body.assignee,
        team: ticket?.team,
        data: { assignee: req.body.assignee },
      });
    }

    return res.status(200).send(ticket);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const ticket = await TicketModel.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).send({ message: "Ticket not found" });
    return res.status(200).send({ message: "Ticket deleted" });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

export default router;
