// =======================================
// FIX: Load .env from root folder
// =======================================
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// IMPORTANT: load .env from backend/.env
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Debug
console.log("🔍 Loaded DATABASE_URL:", process.env.DATABASE_URL);


// =======================================
// IMPORTS
// =======================================
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { authRouter } from "./routes/authRoutes.js";
import { resumeRouter } from "./routes/resumeRoutes.js";

const app = express();


// =======================================
// MIDDLEWARE
// =======================================
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));


// =======================================
// ROUTES
// =======================================
app.use("/api/auth", authRouter);
app.use("/api/resume", resumeRouter);

app.get("/", (_req, res) => res.json({ status: "OK" }));


// =======================================
// START SERVER
// =======================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
