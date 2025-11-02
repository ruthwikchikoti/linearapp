import { Request, Response, Router } from "express";
import UserModel from "../model/user.model";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find().populate("teams");
    return res.status(200).send(users);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.params.id).populate("teams");
    if (!user) return res.status(404).send({ message: "User not found" });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const user = await UserModel.create(req.body);
    return res.status(201).send(user);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).send({ message: "User not found" });
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

export default router;

