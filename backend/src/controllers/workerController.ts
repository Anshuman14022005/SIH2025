import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export const getMyTasks = async (req: Request, res: Response) => {
  const user = (req as any).user;

  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .eq("worker_id", user.id);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

export const markAsDone = async (req: Request, res: Response) => {
  const complaintId = req.params.id;

  const { error } = await supabase
    .from("complaints")
    .update({ status: "done" })
    .eq("id", complaintId);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Marked as done" });
};
