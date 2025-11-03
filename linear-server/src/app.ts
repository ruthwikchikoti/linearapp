import "dotenv/config";
import cors from "cors";
import express, { json } from "express";
import connection from "./config/db";
import { Server } from "socket.io";
import ticketController from "./controller/ticket.controller";
import webhookController from "./controller/webhook.controller";
import userController from "./controller/user.controller";
import teamController from "./controller/team.controller";
import projectController from "./controller/project.controller";
import labelController from "./controller/label.controller";
import cycleController from "./controller/cycle.controller";
import commentController from "./controller/comment.controller";
import activityController from "./controller/activity.controller";
import uploadController from "./controller/upload.controller";

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "https://linearapp-ecru.vercel.app",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/ticket", ticketController);
app.use("/user", userController);
app.use("/team", teamController);
app.use("/project", projectController);
app.use("/label", labelController);
app.use("/cycle", cycleController);
app.use("/comment", commentController);
app.use("/activity", activityController);
app.use("/upload", uploadController);
app.use("/linear", webhookController);

const PORT = process.env.PORT;

let server = app.listen(PORT, async (): Promise<void> => {
  try {
    connection();
  } catch (error) {
    console.log(error);
  }
  console.log(`Listening on Port ${PORT}`);
});

const io = new Server(server, {
  pingTimeout: 6000,
  cors: {
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("current-team", (currentTeamId) => {
    socket.join(currentTeamId);
  });

  // Ticket events
  socket.on("create-ticket", (receiveData) => {
    socket.in(receiveData.team || "default-team").emit("recieved-ticket", receiveData);
  });
  socket.on("update-ticket", (receiveData) => {
    socket.in(receiveData.team || "default-team").emit("recieved-update-ticket", receiveData);
  });
  socket.on("delete-ticket", (data) => {
    socket.in(data.team || "default-team").emit("ticket-deleted", data);
  });

  // Comment events
  socket.on("create-comment", (data) => {
    socket.in(data.team || "default-team").emit("comment-created", data);
  });
  socket.on("update-comment", (data) => {
    socket.in(data.team || "default-team").emit("comment-updated", data);
  });

  // Activity events
  socket.on("new-activity", (data) => {
    socket.in(data.team || "default-team").emit("activity-created", data);
  });
});

export default io;
