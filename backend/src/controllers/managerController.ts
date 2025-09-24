import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export const getDepartmentComplaints = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .eq("department_id", user.department_id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

export const assignToWorker = async (req: Request, res: Response) => {
  const complaintId = req.params.id;
  const { worker_id } = req.body;

  const { error } = await supabase
    .from("complaints")
    .update({ worker_id, status: "in_progress" })
    .eq("id", complaintId);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Assigned to worker" });
};

export const getWorkers = async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email")
    .eq("role", "worker");

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};