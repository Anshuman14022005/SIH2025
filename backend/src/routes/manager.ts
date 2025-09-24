import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { getDepartmentComplaints, assignToWorker, getWorkers } from "../controllers/managerController";

const router = Router();

router.get("/complaints", authMiddleware(["manager"]), getDepartmentComplaints);
router.post("/assign/:id", authMiddleware(["manager"]), assignToWorker);
router.get("/workers", authMiddleware(["manager"]), getWorkers);

export default router;
