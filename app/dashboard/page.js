"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" && localStorage.getItem("token");

  /* =========================
     FETCH PROFILE
  ========================= */
  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/auth/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
    } catch (err) {
      console.error("Profile fetch failed");
    }
  };

  /* =========================
     FETCH TASKS
  ========================= */
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/tasks",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(res.data);
    } catch (err) {
      console.error("Task fetch failed");
    }
  };

  /* =========================
     LOAD ON MOUNT
  ========================= */
  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      await fetchProfile();
      await fetchTasks();
      setLoading(false);
    };

    loadData();
  }, []);

  /* =========================
     ADD TASK
  ========================= */
  const addTask = async () => {
    if (!title.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/tasks",
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks([res.data, ...tasks]);
      setTitle("");
    } catch (err) {
      console.error("Add task failed");
    }
  };

  /* =========================
     UPDATE TASK
  ========================= */
  const updateTask = async (id, currentTitle) => {
    const newTitle = prompt("Edit task:", currentTitle);
    if (!newTitle) return;

    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchTasks();
    } catch (err) {
      console.error("Update failed");
    }
  };

  /* =========================
     DELETE TASK
  ========================= */
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/tasks/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Delete failed");
    }
  };

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>Your Tasks</h3>
          <small className="text-muted">
            Welcome, {user?.name}
          </small>
        </div>

        <button onClick={logout} className="btn btn-outline-danger">
          Logout
        </button>
      </div>

      {/* PROFILE CARD */}
      <div className="card p-3 mb-4">
        <h5>Profile</h5>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <strong>{user?.name}</strong><br />
            <small className="text-muted">{user?.email}</small>
          </div>

          <button
            className="btn btn-sm btn-outline-primary"
            onClick={async () => {
              const newName = prompt("Update name:", user?.name);
              if (!newName) return;

              await axios.put(
                "http://localhost:5000/api/auth/profile",
                { name: newName },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              fetchProfile();
            }}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* ADD TASK */}
      <div className="input-group mb-3">
        <input
          className="form-control"
          placeholder="New Task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addTask} className="btn btn-dark">
          Add
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="form-control mb-3"
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TASK LIST */}
      <ul className="list-group">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {task.title}

            <div>
              <button
                onClick={() => updateTask(task.id, task.title)}
                className="btn btn-sm btn-warning me-2"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                className="btn btn-sm btn-danger"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {filteredTasks.length === 0 && (
        <div className="text-center text-muted mt-4">
          No tasks available
        </div>
      )}
    </div>
  );
}
