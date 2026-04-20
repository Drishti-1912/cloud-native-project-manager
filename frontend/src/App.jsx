import React, { useEffect, useState } from "react";

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(setProjects)
      .catch(console.error);

    fetch("/api/tasks")
      .then(r => r.json())
      .then(setTasks)
      .catch(console.error);
  }, []);

  const addProject = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((r) => r.json())
      .then((p) => setProjects((ps) => [...ps, p]));
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h1>☁️ Cloud Native Project Manager</h1>

      <h2>Projects</h2>
      <ul>
        {projects.map((p) => (
          <li key={p.id}>
            {p.name} ({p.owner}, {p.status})
          </li>
        ))}
      </ul>

      <h3>Create Project</h3>
      <form onSubmit={addProject}>
        <input name="name" placeholder="Project name" required />
        <input name="description" placeholder="Description" />
        <input name="owner" placeholder="Owner" required />
        <button type="submit">Create</button>
      </form>

      <h2>Tasks</h2>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            {t.title} (Project {t.project_id}, {t.status})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;