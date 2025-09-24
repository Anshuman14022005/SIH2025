import { Router } from "express";
import { supabase } from "../config/supabase";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return res.status(401).json({ error: error?.message || "Login failed" });
    }

    const user = data.user;
    const token = data.session?.access_token;

    res.json({
      token,
      role: user.user_metadata?.role || null, // ensure role is stored in Supabase metadata
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
