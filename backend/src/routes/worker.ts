import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { getMyTasks, markAsDone } from "../controllers/workerController";

const router = Router();

router.get("/tasks", authMiddleware(["worker"]), getMyTasks);
router.post("/done/:id", authMiddleware(["worker"]), markAsDone);

export default router;
