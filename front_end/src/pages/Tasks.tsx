import React, { useState, useEffect } from "react";
import "./style.css";
const [userCoins, setUserCoins] = useState(0);  // Add this to track the user's total coins

type Task = {
  _id: string;
  userId: string;
  name: string;
  details?: string;
  completed: boolean;
  createdAt?: string;
};

const BASE_URL = "http://161.35.186.141:5003/api"; // Update if needed
const userId = "user1"; // Replace with the actual user ID

const TaskApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  // Fetch tasks when component mounts
  useEffect(() => {
    fetch(`${BASE_URL}/tasks/${userId}`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  // Add a new task via the API
  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const response = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          name: newTask,
          details: "",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add task");
      }
      const createdTask = await response.json();
      setTasks((prev) => [...prev, createdTask]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTask = async (
    id: string,
    currentCompleted: boolean,
    taskName: string,
    details: string = ""
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: taskName,
          details,
          completed: !currentCompleted,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      
      // Update local state after success
      setTasks((prev) =>
        prev.map((task) =>
          task._id === id ? { ...task, completed: !currentCompleted } : task
        )
      );
  
      // If the task is completed, increment the coins and log the details
      if (!currentCompleted) {
        const addedCoins = 15;  // Example: Adding 15 coins when a task is marked as completed
  
        // Update the user's coin balance (You could replace this with an API call to fetch user data)
        setUserCoins((prevCoins) => {
          const newTotal = prevCoins + addedCoins;
          console.log(
            `Task "${taskName}" was set to completed. Total coins: ${newTotal}. Coins added: ${addedCoins}.`
          );
          return newTotal;
        });
      }
  
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };
  

  // Delete a task via the API
  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Confirm edit of a task via the API
  const confirmEdit = async (
    id: string,
    currentCompleted: boolean,
    details: string = ""
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingName,
          details,
          completed: currentCompleted,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
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

  const startEditing = (task: Task) => {
    setEditingId(task._id);
    setEditingName(task.name);
  };

  return (
    <div className="task-app">
      <h1 className="title">Todo</h1>
      {/* Task List */}
      <ul className="task-list">
        {tasks.map((task) => {
          const isEditing = editingId === task._id;
          return (
            <li className="task-item" key={task._id}>
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  toggleTask(task._id, task.completed, task.name, task.details || "")
                }
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
                      onClick={() =>
                        confirmEdit(task._id, task.completed, task.details || "")
                      }
                      className="edit-confirm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => deleteTask(task._id)}
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
      {/* Add New Task */}
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
