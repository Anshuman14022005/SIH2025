import express from "express";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin";
import managerRoutes from "./routes/manager";
import workerRoutes from "./routes/worker";
import cors from "cors";
import authRoutes from "./routes/auth"

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // your Vite dev server
  credentials: true
}));

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/manager", managerRoutes);
app.use("/worker", workerRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
