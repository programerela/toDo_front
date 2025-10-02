import { useState } from 'react';
import { useTasks } from '../context/useTasks';
import TaskModal from './TaskModal';
import '../styles/TaskItem.css';
import type { Task } from '../api/api';

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const { toggleTask, deleteTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = async () => {
    if (showDelete) {
      try {
        await deleteTask(task.id);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    } else {
      setShowDelete(true);
      setTimeout(() => setShowDelete(false), 3000);
    }
  };

  return (
    <>
      <div className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
        <div className="task-checkbox">
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={() => toggleTask(task.id)}
            id={`task-${task.id}`}
          />
          <label htmlFor={`task-${task.id}`} className="checkbox-label">
            <svg className="checkbox-icon" viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </label>
        </div>

        <div className="task-content">
          <h3 className="task-title">{task.title}</h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          
          <span className="task-date">
            Created on: {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="task-actions">
          <button
            className="task-action-btn edit"
            onClick={() => setIsEditing(true)}
            aria-label="Edit task"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            className={`task-action-btn delete ${showDelete ? 'confirm' : ''}`}
            onClick={handleDelete}
            aria-label="Delete task"
          >
            {showDelete ? (
              <span className="delete-confirm">?</span>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isEditing && (
        <TaskModal
          task={task}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
};

export default TaskItem;