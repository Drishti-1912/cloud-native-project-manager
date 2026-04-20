const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = 5000;

// Use env vars or defaults
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "projectman",
  user: process.env.DB_USER || "projectman",
  password: process.env.DB_PASSWORD || "securepassword",
  port: 5432,
});

// Enable CORS (for dev)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(bodyParser.json());

// Test
app.get("/api/health", (req, res) =>
  res.json({ status: "healthy", service: "backend" })
);

// Projects CRUD
app.get("/api/projects", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/projects", async (req, res) => {
  const { name, description, owner, status } = req.body;
  if (!name || !owner) {
    return res.status(400).json({ error: "name and owner required" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO projects (name, description, owner, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description || "", owner, status || "NOT_STARTED"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tasks CRUD (simplified)
app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { projectId, title, assignee, status } = req.body;
  if (!projectId || !title) {
    return res.status(400).json({ error: "projectId and title required" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO tasks (project_id, title, assignee, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [projectId, title, assignee || "", status || "TO_DO"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Initialize DB on first run (dev only)
async function createSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      owner VARCHAR(100) NOT NULL,
      status VARCHAR(30) NOT NULL
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      project_id INTEGER NOT NULL REFERENCES projects(id),
      title VARCHAR(100) NOT NULL,
      assignee VARCHAR(100),
      status VARCHAR(30) NOT NULL
    );
  `);
}

createSchema().catch(console.error);

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});