import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { getComplaints, assignToDepartment } from "../controllers/adminController";

const router = Router();

router.get("/complaints", authMiddleware(["admin"]), getComplaints);
router.post("/assign/:id", authMiddleware(["admin"]), assignToDepartment);

export default router;
