import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export const getComplaints = async (req: Request, res: Response) => {
  const { data, error } = await supabase.from("complaints").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

export const assignToDepartment = async (req: Request, res: Response) => {
  const complaintId = req.params.id;
  const { department_id } = req.body;

  const { error } = await supabase
    .from("complaints")
    .update({ department_id, status: "assigned" })
    .eq("id", complaintId);

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Assigned to department" });
};
