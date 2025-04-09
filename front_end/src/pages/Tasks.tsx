import React, { useState, useEffect } from "react";
import "./style.css";
import "./Tasks.css";

// Type definition for a task
type Task = {
  _id: string;
  userId: string;
  name: string;
  details?: string;
  completed: boolean;
  createdAt?: string;
};

// Determine API base URL based on environment
const isProd = process.env.NODE_ENV === "production";
const API_BASE_URL = isProd
  ? "http://161.35.186.141:5003/api"
  : "http://localhost:5003/api";

// Get user ID from local storage
const userId = localStorage.getItem("userId");

const TaskApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [coins, setCoins] = useState(0);
  const [showEffect, setShowEffect] = useState(false);

  // Fetch tasks on initial load
  useEffect(() => {
    fetch(`${API_BASE_URL}/tasks/${userId}`)
      .then((res) => res.json())
      .then(setTasks)
      .catch((error) => console.error("Error fetching tasks:", error));
    // Fetch user coins
    fetch(`${API_BASE_URL}/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setCoins(data.coins))
      .catch((error) => console.error("Error fetching user coins:", error));
  }, []);

  // Add a new task
  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name: newTask, details: "" }),
      });

      if (!response.ok) throw new Error("Failed to add task");

      const createdTask = await response.json();
      setTasks((prev) => [...prev, createdTask]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const triggerCoinEffect = () => {
    setShowEffect(true);
    setTimeout(() => setShowEffect(false), 1000); // reset after animation
  };

  // Toggle completion status of a task
  const toggleTask = async (
    id: string,
    currentCompleted: boolean,
    taskName: string,
    details: string = ""
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: taskName,
          details,
          completed: !currentCompleted,
          userId,
        }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, completed: !currentCompleted } : task
        )
      );

      // Reward coins on task completion

      if (!currentCompleted) {
        const newCoins = coins + 100;
        setCoins(newCoins);
      // Call the API to update coins on the server (if needed)
      await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coins: newCoins }),
      });

      triggerCoinEffect();
    }
    
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Confirm task edit
  const confirmEdit = async (
    id: string,
    currentCompleted: boolean,
    details: string = ""
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingName,
          details,
          completed: currentCompleted,
        }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, name: editingName } : task
        )
      );
      setEditingId(null);
      setEditingName("");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Start editing a task
  const startEditing = (task: Task) => {
    setEditingId(task._id);
    setEditingName(task.name);
  };


  return (
    <div className="task-app">
      <div className="header">
        <h1 className="title">Todo</h1>
        <div className="coin-display">🪙 {coins}</div>
      </div>

      {showEffect && <div className="coin-splash">✨ +15!</div>}

      <ul className="task-list">
        {tasks.map((task) => {
          const isEditing = editingId === task._id;
          return (
            <li className="task-item" key={task._id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  toggleTask(task._id, task.completed, task.name, task.details || "")
                }
                className="circular-checkbox"
              />
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
                      onClick={() =>
                        confirmEdit(task._id, task.completed, task.details || "")
                      }
                      className="edit-confirm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this task?")) {
                          deleteTask(task._id);
                        }
                      }}
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
