import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const authRouter = express.Router();

const makeToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// SIGNUP
authRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const exists = await pool.query("SELECT id FROM users WHERE email=$1", [email]);
    if (exists.rows.length) return res.status(400).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const insert = await pool.query(
      `INSERT INTO users(name,email,password_hash)
       VALUES ($1,$2,$3)
       RETURNING id,name,email,role`,
      [name, email, passwordHash]
    );
    const user = insert.rows[0];
    const token = makeToken(user);
    res.json({ token, user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// LOGIN
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    if (!result.rows.length) return res.status(400).json({ error: "Invalid credentials" });

    const row = result.rows[0];
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });

    const user = { id: row.id, name: row.name, email: row.email, role: row.role };
    const token = makeToken(user);
    res.json({ token, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ME
authRouter.get("/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users WHERE id=$1", [req.user.id]);
    if (!result.rows.length) return res.status(404).json({ error: "User not found" });

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});
