import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";

export const authMiddleware = (roles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    if (!header) return res.status(401).json({ error: "No token provided" });

    const token = header.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
      // Verify token using Supabase helper
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      const userRole = user.user_metadata?.role;

      if (roles.length && !roles.includes(userRole)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      (req as any).user = { id: user.id, role: userRole, email: user.email };
      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
};
