import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

// REMOVE DATABASE_URL completely — we don't use it anymore
console.log("🔍 PG Config:", {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
});

// DIRECT CONNECTION (avoids SCRAM + URL bugs)
const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: false
});

pool.connect()
  .then(() => console.log("✅ PostgreSQL connected successfully"))
  .catch((err) => {
    console.error("❌ PostgreSQL connection failed:", err);
    process.exit(1);
  });

export { pool };
