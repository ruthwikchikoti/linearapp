import { Request, Response, Router } from "express";
import multer from "multer";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept all file types
    cb(null, true);
  },
});

router.post("/", upload.array("files", 10), async (req: Request, res: Response) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const fileUrls = files.map(
      (file) => `${process.env.BASE_URL || "http://localhost:3001"}/uploads/${file.filename}`
    );
    return res.status(200).send({ files: fileUrls });
  } catch (error) {
    return res.status(400).send({ message: error });
  }
});

router.get("/:filename", async (req: Request, res: Response) => {
  try {
    res.sendFile(req.params.filename, { root: "uploads/" });
  } catch (error) {
    return res.status(404).send({ message: "File not found" });
  }
});

export default router;

