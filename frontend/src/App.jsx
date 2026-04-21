import React, { useEffect, useState, useCallback } from "react";

const API = "";

const STATUS_COLORS = {
  NOT_STARTED: "#8888a0",
  IN_PROGRESS: "#6c63ff",
  ON_HOLD: "#f7c948",
  COMPLETED: "#3ecf8e",
  TO_DO: "#8888a0",
  DONE: "#3ecf8e",
  CANCELLED: "#ff6584",
};

const PRIORITY_COLORS = {
  LOW: "#3ecf8e",
  MEDIUM: "#f7c948",
  HIGH: "#ff6584",
};

const s = {
  // Layout
  app: { display: "flex", flexDirection: "column", minHeight: "100vh" },
  header: {
    padding: "20px 32px",
    borderBottom: "1px solid #2a2a35",
    display: "flex",
    alignItems: "center",
    gap: 16,
    background: "#111118",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontFamily: "Syne, sans-serif",
    fontWeight: 800,
    fontSize: 22,
    color: "#e8e8f0",
    letterSpacing: "-0.5px",
  },
  logoAccent: { color: "#6c63ff" },
  badge: {
    background: "#6c63ff22",
    color: "#6c63ff",
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 8px",
    borderRadius: 20,
    border: "1px solid #6c63ff44",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  main: { display: "flex", flex: 1 },
  sidebar: {
    width: 260,
    background: "#111118",
    borderRight: "1px solid #2a2a35",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  content: { flex: 1, padding: 32, overflowY: "auto" },
  sidebarLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#8888a0",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    padding: "8px 12px 4px",
  },
  sidebarItem: (active) => ({
    padding: "9px 12px",
    borderRadius: 8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    fontWeight: active ? 600 : 400,
    color: active ? "#e8e8f0" : "#8888a0",
    background: active ? "#18181f" : "transparent",
    border: active ? "1px solid #2a2a35" : "1px solid transparent",
    transition: "all 0.15s",
  }),
  sidebarCount: {
    marginLeft: "auto",
    background: "#2a2a35",
    color: "#8888a0",
    borderRadius: 10,
    fontSize: 11,
    padding: "1px 7px",
    fontWeight: 600,
  },

  // Cards
  card: {
    background: "#111118",
    border: "1px solid #2a2a35",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    transition: "border-color 0.15s",
  },
  row: { display: "flex", alignItems: "center", gap: 10, marginBottom: 6 },
  title: {
    fontFamily: "Syne, sans-serif",
    fontWeight: 700,
    fontSize: 16,
    flex: 1,
    color: "#e8e8f0",
  },
  meta: { fontSize: 13, color: "#8888a0" },
  statusPill: (status) => ({
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 20,
    background: (STATUS_COLORS[status] || "#8888a0") + "22",
    color: STATUS_COLORS[status] || "#8888a0",
    border: `1px solid ${(STATUS_COLORS[status] || "#8888a0")}44`,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    whiteSpace: "nowrap",
  }),
  priorityDot: (p) => ({
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: PRIORITY_COLORS[p] || "#8888a0",
    flexShrink: 0,
  }),

  // Forms
  formCard: {
    background: "#18181f",
    border: "1px solid #2a2a35",
    borderRadius: 12,
    padding: 24,
    marginBottom: 28,
  },
  formTitle: {
    fontFamily: "Syne, sans-serif",
    fontWeight: 700,
    fontSize: 15,
    marginBottom: 16,
    color: "#e8e8f0",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 10,
    marginBottom: 12,
  },
  input: {
    background: "#0a0a0f",
    border: "1px solid #2a2a35",
    borderRadius: 8,
    padding: "9px 12px",
    color: "#e8e8f0",
    fontSize: 14,
    outline: "none",
    width: "100%",
    fontFamily: "DM Sans, sans-serif",
  },
  select: {
    background: "#0a0a0f",
    border: "1px solid #2a2a35",
    borderRadius: 8,
    padding: "9px 12px",
    color: "#e8e8f0",
    fontSize: 14,
    outline: "none",
    width: "100%",
    fontFamily: "DM Sans, sans-serif",
    cursor: "pointer",
  },
  btn: (variant = "primary") => ({
    padding: "9px 20px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "Syne, sans-serif",
    letterSpacing: 0.3,
    transition: "all 0.15s",
    ...(variant === "primary"
      ? { background: "#6c63ff", color: "#fff" }
      : variant === "danger"
      ? { background: "#ff658422", color: "#ff6584", border: "1px solid #ff658444" }
      : { background: "#2a2a35", color: "#8888a0" }),
  }),

  // Section header
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "Syne, sans-serif",
    fontWeight: 800,
    fontSize: 26,
    color: "#e8e8f0",
  },

  // Stats
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: 12,
    marginBottom: 28,
  },
  stat: {
    background: "#111118",
    border: "1px solid #2a2a35",
    borderRadius: 12,
    padding: "16px 20px",
  },
  statNum: {
    fontFamily: "Syne, sans-serif",
    fontWeight: 800,
    fontSize: 32,
    color: "#e8e8f0",
    lineHeight: 1,
  },
  statLabel: { fontSize: 12, color: "#8888a0", marginTop: 4 },

  empty: {
    textAlign: "center",
    color: "#8888a0",
    padding: "48px 0",
    fontSize: 14,
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "#8888a0",
    cursor: "pointer",
    fontSize: 16,
    padding: "2px 6px",
    borderRadius: 4,
    lineHeight: 1,
  },
  projectTitle: {
    fontFamily: "Syne, sans-serif",
    fontWeight: 700,
    fontSize: 14,
    color: "#8888a8",
    marginBottom: 8,
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  },
};

// ─── API helpers ────────────────────────────────────────────
const api = {
  get: (url) => fetch(API + url).then((r) => r.json()),
  post: (url, body) =>
    fetch(API + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  put: (url, body) =>
    fetch(API + url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  del: (url) => fetch(API + url, { method: "DELETE" }),
};

// ─── Components ─────────────────────────────────────────────

function StatBar({ projects, tasks }) {
  const done = projects.filter((p) => p.status === "COMPLETED").length;
  const inProg = projects.filter((p) => p.status === "IN_PROGRESS").length;
  const tasksDone = tasks.filter((t) => t.status === "DONE").length;
  return (
    <div style={s.stats}>
      <div style={s.stat}>
        <div style={s.statNum}>{projects.length}</div>
        <div style={s.statLabel}>Total Projects</div>
      </div>
      <div style={s.stat}>
        <div style={{ ...s.statNum, color: "#6c63ff" }}>{inProg}</div>
        <div style={s.statLabel}>In Progress</div>
      </div>
      <div style={s.stat}>
        <div style={{ ...s.statNum, color: "#3ecf8e" }}>{done}</div>
        <div style={s.statLabel}>Completed</div>
      </div>
      <div style={s.stat}>
        <div style={s.statNum}>{tasks.length}</div>
        <div style={s.statLabel}>Total Tasks</div>
      </div>
      <div style={s.stat}>
        <div style={{ ...s.statNum, color: "#3ecf8e" }}>{tasksDone}</div>
        <div style={s.statLabel}>Tasks Done</div>
      </div>
    </div>
  );
}

function ProjectForm({ onCreated }) {
  const [form, setForm] = useState({ name: "", description: "", owner: "", status: "NOT_STARTED" });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.name || !form.owner) return;
    setLoading(true);
    const p = await api.post("/api/projects", form);
    setLoading(false);
    if (p.id) {
      onCreated(p);
      setForm({ name: "", description: "", owner: "", status: "NOT_STARTED" });
    }
  };

  return (
    <div style={s.formCard}>
      <div style={s.formTitle}>＋ New Project</div>
      <div style={s.formGrid}>
        <input style={s.input} placeholder="Project name *" value={form.name} onChange={set("name")} />
        <input style={s.input} placeholder="Owner *" value={form.owner} onChange={set("owner")} />
        <input style={s.input} placeholder="Description" value={form.description} onChange={set("description")} />
        <select style={s.select} value={form.status} onChange={set("status")}>
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      <button style={s.btn("primary")} onClick={submit} disabled={loading}>
        {loading ? "Creating…" : "Create Project"}
      </button>
    </div>
  );
}

function TaskForm({ projects, onCreated }) {
  const [form, setForm] = useState({ projectId: "", title: "", assignee: "", status: "TO_DO", priority: "MEDIUM" });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.projectId || !form.title) return;
    setLoading(true);
    const t = await api.post("/api/tasks", form);
    setLoading(false);
    if (t.id) {
      onCreated(t);
      setForm({ projectId: form.projectId, title: "", assignee: "", status: "TO_DO", priority: "MEDIUM" });
    }
  };

  return (
    <div style={s.formCard}>
      <div style={s.formTitle}>＋ New Task</div>
      <div style={s.formGrid}>
        <select style={s.select} value={form.projectId} onChange={set("projectId")}>
          <option value="">Select project *</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <input style={s.input} placeholder="Task title *" value={form.title} onChange={set("title")} />
        <input style={s.input} placeholder="Assignee" value={form.assignee} onChange={set("assignee")} />
        <select style={s.select} value={form.status} onChange={set("status")}>
          <option value="TO_DO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select style={s.select} value={form.priority} onChange={set("priority")}>
          <option value="LOW">Low Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="HIGH">High Priority</option>
        </select>
      </div>
      <button style={s.btn("primary")} onClick={submit} disabled={loading}>
        {loading ? "Creating…" : "Create Task"}
      </button>
    </div>
  );
}

function ProjectCard({ project, tasks, onDelete, onStatusChange }) {
  const ptasks = tasks.filter((t) => t.project_id === project.id);
  const done = ptasks.filter((t) => t.status === "DONE").length;

  return (
    <div style={s.card}>
      <div style={s.row}>
        <div style={s.title}>{project.name}</div>
        <select
          style={{ ...s.select, width: "auto", fontSize: 12, padding: "3px 8px" }}
          value={project.status}
          onChange={(e) => onStatusChange(project, e.target.value)}
        >
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <button style={s.deleteBtn} onClick={() => onDelete(project.id)} title="Delete">✕</button>
      </div>
      <div style={s.row}>
        <span style={s.meta}>👤 {project.owner}</span>
        {project.description && <span style={{ ...s.meta, marginLeft: 8 }}>· {project.description}</span>}
      </div>
      <div style={{ ...s.meta, marginTop: 6 }}>
        {ptasks.length > 0
          ? `${done}/${ptasks.length} tasks complete`
          : "No tasks yet"}
      </div>
    </div>
  );
}

function TaskCard({ task, projects, onDelete, onStatusChange }) {
  const proj = projects.find((p) => p.id === task.project_id);
  return (
    <div style={s.card}>
      <div style={s.row}>
        <div style={s.priorityDot(task.priority)} />
        <div style={s.title}>{task.title}</div>
        <select
          style={{ ...s.select, width: "auto", fontSize: 12, padding: "3px 8px" }}
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value)}
        >
          <option value="TO_DO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <button style={s.deleteBtn} onClick={() => onDelete(task.id)} title="Delete">✕</button>
      </div>
      <div style={s.row}>
        {task.assignee && <span style={s.meta}>👤 {task.assignee}</span>}
        {proj && <span style={{ ...s.meta, marginLeft: task.assignee ? 8 : 0 }}>📁 {proj.name}</span>}
        <span style={{ ...s.meta, marginLeft: "auto" }}>{task.priority}</span>
      </div>
    </div>
  );
}

// ─── App ────────────────────────────────────────────────────
export default function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const [ps, ts] = await Promise.all([api.get("/api/projects"), api.get("/api/tasks")]);
      if (Array.isArray(ps)) setProjects(ps);
      if (Array.isArray(ts)) setTasks(ts);
      setError(null);
    } catch (e) {
      setError("Could not reach backend. Is it running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const deleteProject = async (id) => {
    if (!confirm("Delete this project and all its tasks?")) return;
    await api.del(`/api/projects/${id}`);
    setProjects((ps) => ps.filter((p) => p.id !== id));
    setTasks((ts) => ts.filter((t) => t.project_id !== id));
  };

  const deleteTask = async (id) => {
    await api.del(`/api/tasks/${id}`);
    setTasks((ts) => ts.filter((t) => t.id !== id));
  };

  const updateProjectStatus = async (project, status) => {
    const updated = await api.put(`/api/projects/${project.id}`, { ...project, status });
    setProjects((ps) => ps.map((p) => (p.id === project.id ? updated : p)));
  };

  const updateTaskStatus = async (task, status) => {
    const updated = await api.put(`/api/tasks/${task.id}`, { ...task, status });
    setTasks((ts) => ts.map((t) => (t.id === task.id ? updated : t)));
  };

  const navItems = [
    { id: "dashboard", icon: "◈", label: "Dashboard" },
    { id: "projects", icon: "◉", label: "Projects", count: projects.length },
    { id: "tasks", icon: "◎", label: "Tasks", count: tasks.length },
  ];

  return (
    <div style={s.app}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.logo}>
          Project<span style={s.logoAccent}>Man</span>
        </div>
        <span style={s.badge}>Cloud Native</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          {error && <span style={{ fontSize: 12, color: "#ff6584" }}>⚠ {error}</span>}
          <button style={s.btn("ghost")} onClick={load}>↻ Refresh</button>
        </div>
      </header>

      <div style={s.main}>
        {/* Sidebar */}
        <aside style={s.sidebar}>
          <div style={s.sidebarLabel}>Navigation</div>
          {navItems.map((item) => (
            <div key={item.id} style={s.sidebarItem(view === item.id)} onClick={() => setView(item.id)}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.count !== undefined && <span style={s.sidebarCount}>{item.count}</span>}
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main style={s.content}>
          {loading ? (
            <div style={s.empty}>Loading…</div>
          ) : (
            <>
              {/* Dashboard */}
              {view === "dashboard" && (
                <>
                  <div style={s.sectionHeader}>
                    <div style={s.sectionTitle}>Dashboard</div>
                  </div>
                  <StatBar projects={projects} tasks={tasks} />

                  <div style={{ ...s.sectionTitle, fontSize: 18, marginBottom: 14 }}>Recent Projects</div>
                  {projects.slice(0, 3).map((p) => (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      tasks={tasks}
                      onDelete={deleteProject}
                      onStatusChange={updateProjectStatus}
                    />
                  ))}
                  {projects.length === 0 && <div style={s.empty}>No projects yet. Create one below!</div>}
                  {projects.length > 3 && (
                    <div
                      style={{ ...s.meta, cursor: "pointer", color: "#6c63ff", marginBottom: 20 }}
                      onClick={() => setView("projects")}
                    >
                      View all {projects.length} projects →
                    </div>
                  )}

                  <div style={{ ...s.sectionTitle, fontSize: 18, marginBottom: 14, marginTop: 8 }}>Recent Tasks</div>
                  {tasks.slice(0, 4).map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      projects={projects}
                      onDelete={deleteTask}
                      onStatusChange={updateTaskStatus}
                    />
                  ))}
                  {tasks.length === 0 && <div style={s.empty}>No tasks yet.</div>}
                </>
              )}

              {/* Projects view */}
              {view === "projects" && (
                <>
                  <div style={s.sectionHeader}>
                    <div style={s.sectionTitle}>Projects</div>
                  </div>
                  <ProjectForm onCreated={(p) => setProjects((ps) => [p, ...ps])} />
                  {projects.length === 0 && <div style={s.empty}>No projects yet.</div>}
                  {projects.map((p) => (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      tasks={tasks}
                      onDelete={deleteProject}
                      onStatusChange={updateProjectStatus}
                    />
                  ))}
                </>
              )}

              {/* Tasks view */}
              {view === "tasks" && (
                <>
                  <div style={s.sectionHeader}>
                    <div style={s.sectionTitle}>Tasks</div>
                  </div>
                  <TaskForm projects={projects} onCreated={(t) => setTasks((ts) => [t, ...ts])} />
                  {tasks.length === 0 && <div style={s.empty}>No tasks yet.</div>}
                  {tasks.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      projects={projects}
                      onDelete={deleteTask}
                      onStatusChange={updateTaskStatus}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}