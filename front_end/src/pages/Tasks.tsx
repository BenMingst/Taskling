import React, { useState } from "react";
import "./style.css";

type Task = {
  id: string;
  name: string;
  completed: boolean;
};

const TaskApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // Add a new task at the bottom
  const addTask = () => {
    if (!newTask.trim()) return;
    const newItem: Task = {
      id: Date.now().toString(),
      name: newTask.trim(),
      completed: false,
    };
    setTasks([...tasks, newItem]);
    setNewTask("");
  };

  // Toggle completion
  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  // Delete a task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Inline editing logic
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditingName(task.name);
  };

  const confirmEdit = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name: editingName } : t))
    );
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="task-app">
      <h1 className="title">Todo</h1>

      {/* Task List */}
      <ul className="task-list">
        {tasks.map((task) => {
          const isEditing = editingId === task.id;

          return (
            <li className="task-item" key={task.id}>
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="circular-checkbox"
              />

              {/* Task Name or Editing Field */}
              {isEditing ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="edit-input"
                  />
                  <div className="edit-actions">
                    <button
                      onClick={() => confirmEdit(task.id)}
                      className="edit-confirm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="edit-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <span
                  className={`task-name ${task.completed ? "completed" : ""}`}
                  onClick={() => startEditing(task)}
                >
                  {task.name}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {/* Add New Task at the bottom */}
      <div className="add-task">
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
        />
        <button onClick={addTask}>Add</button>
      </div>
    </div>
  );
};

export default TaskApp;
