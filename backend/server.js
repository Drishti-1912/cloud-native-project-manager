const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = 5000;

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "projectman",
  user: process.env.DB_USER || "projectman",
  password: process.env.DB_PASSWORD || "securepassword",
  port: 5432,
});

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(bodyParser.json());

// Health
app.get("/api/health", (req, res) =>
  res.json({ status: "healthy", service: "backend" })
);

// ── Projects ──────────────────────────────────────────────
app.get("/api/projects", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/projects", async (req, res) => {
  const { name, description, owner, status } = req.body;
  if (!name || !owner)
    return res.status(400).json({ error: "name and owner required" });
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

app.put("/api/projects/:id", async (req, res) => {
  const { name, description, owner, status } = req.body;
  try {
    const result = await pool.query(
      "UPDATE projects SET name=$1, description=$2, owner=$3, status=$4 WHERE id=$5 RETURNING *",
      [name, description, owner, status, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/projects/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tasks WHERE project_id=$1", [req.params.id]);
    await pool.query("DELETE FROM projects WHERE id=$1", [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Tasks ─────────────────────────────────────────────────
app.get("/api/tasks", async (req, res) => {
  try {
    const projectId = req.query.projectId;
    let result;
    if (projectId) {
      result = await pool.query(
        "SELECT * FROM tasks WHERE project_id=$1 ORDER BY id DESC",
        [projectId]
      );
    } else {
      result = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { projectId, title, assignee, status, priority } = req.body;
  if (!projectId || !title)
    return res.status(400).json({ error: "projectId and title required" });
  try {
    const result = await pool.query(
      "INSERT INTO tasks (project_id, title, assignee, status, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [projectId, title, assignee || "", status || "TO_DO", priority || "MEDIUM"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  const { title, assignee, status, priority } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tasks SET title=$1, assignee=$2, status=$3, priority=$4 WHERE id=$5 RETURNING *",
      [title, assignee, status, priority, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tasks WHERE id=$1", [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Schema init with retry ────────────────────────────────
async function createSchema(retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS projects (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT DEFAULT '',
          owner VARCHAR(100) NOT NULL,
          status VARCHAR(30) NOT NULL DEFAULT 'NOT_STARTED'
        );
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
          title VARCHAR(100) NOT NULL,
          assignee VARCHAR(100) DEFAULT '',
          status VARCHAR(30) NOT NULL DEFAULT 'TO_DO',
          priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM'
        );
      `);
      console.log("Database schema ready.");
      return;
    } catch (err) {
      console.log(`DB not ready (attempt ${i + 1}/${retries}): ${err.message}`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  console.error("Could not connect to DB after retries. Exiting.");
  process.exit(1);
}

createSchema().then(() => {
  app.listen(port, () => console.log(`Backend listening on port ${port}`));
});