import { createContext, useState, useEffect, type ReactNode } from "react";
import { tasksAPI, type Task } from "../api/api";
import { useAuth } from "./useAuth";
import { AxiosError } from "axios";

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (title: string, description: string) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  refreshTasks: () => Promise<void>;
  stats: { completed: number; pending: number } | null;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{
    completed: number;
    pending: number;
  } | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      refreshTasks();
      fetchStats();
    } else {
      setTasks([]);
      setStats(null);
    }
  }, [isAuthenticated]);

  const handleError = (error: unknown, fallbackMessage: string) => {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || error.message || fallbackMessage
      );
    }
    if (error instanceof Error) {
      throw new Error(error.message || fallbackMessage);
    }
    throw new Error(fallbackMessage);
  };

  const refreshTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await tasksAPI.getTasks();
      console.log("Fetched tasks:", fetchedTasks.map(t => t.createdAt));
      setTasks(fetchedTasks);
    } catch (error: unknown) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const fetchedStats = await tasksAPI.getStats();
      setStats(fetchedStats);
    } catch (error: unknown) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const addTask = async (title: string, description: string) => {
    try {
      const newTask = await tasksAPI.createTask({ title, description, createdAt: new Date().toISOString() });
      setTasks((prev) => [...prev, newTask]);
      await fetchStats();
    } catch (error: unknown) {
      handleError(error, "Failed to create task");
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const updatedTask = await tasksAPI.updateTask(id, updates);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
      await fetchStats();
    } catch (error: unknown) {
      handleError(error, "Failed to update task");
    }
  };

  const toggleTask = async (id: number) => {
    try {
      
      await tasksAPI.toggleTask(id);

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
        )
      );

      await fetchStats();
    } catch (error: unknown) {
      handleError(error, "Failed to toggle task");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await tasksAPI.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      await fetchStats();
    } catch (error: unknown) {
      handleError(error, "Failed to delete task");
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        refreshTasks,
        stats,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
