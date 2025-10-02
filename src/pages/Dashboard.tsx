import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useTasks } from "../context/useTasks";
import Header from "../components/Header";
import TaskList from "../components/TaskList";
import TaskModal from "../components/TaskModal";
import AdminPanel from "../components/AdminPanel";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, stats, loading } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.isCompleted;
    if (filter === "completed") return task.isCompleted;
    return true;
  });

  const isAdmin = user?.role === 'admin' || user?.email?.includes('admin');

  return (
    <div className="dashboard">
      <Header />

      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <div>
              <h1>My Tasks</h1>
              <p className="dashboard-subtitle">
                Welcome back, {user?.username}
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              + New Task
            </button>
          </div>

          {loading ? (
            <div className="loading-state">Loading tasks...</div>
          ) : (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{tasks.length}</div>
                  <div className="stat-label">Total Tasks</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats?.pending || 0}</div>
                  <div className="stat-label">Active</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats?.completed || 0}</div>
                  <div className="stat-label">Completed</div>
                </div>
              </div>

              <div className="filter-tabs">
                <button
                  className={`filter-tab ${filter === "all" ? "active" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={`filter-tab ${
                    filter === "active" ? "active" : ""
                  }`}
                  onClick={() => setFilter("active")}
                >
                  Active
                </button>
                <button
                  className={`filter-tab ${
                    filter === "completed" ? "active" : ""
                  }`}
                  onClick={() => setFilter("completed")}
                >
                  Completed
                </button>
              </div>

              <TaskList tasks={filteredTasks} />
            </>
          )}

          {isAdmin && <AdminPanel />}
        </div>
      </main>

      {isModalOpen && <TaskModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Dashboard;