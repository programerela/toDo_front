import TaskItem from "./TaskItem";
import "../styles/TaskList.css";
import type { Task } from "../api/api";

interface TaskListProps {
  tasks: Task[];
}

const TaskList = ({ tasks }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <h3>No tasks found</h3>
        <p>Create your first task to get started</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks
        .filter((task): task is NonNullable<typeof task> => task != null)
        .map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
    </div>
  );
};

export default TaskList;
