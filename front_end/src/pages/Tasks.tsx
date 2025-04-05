import React, { useState } from "react";
import "./style.css"; // only needed if you're using custom styles

const TaskApp: React.FC = () => {
  const [tasks, setTasks] = useState<{ id: number; name: string; completed: boolean }[]>([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), name: newTask.trim(), completed: false }]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">📝 Taskling</h1>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button
            onClick={addTask}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Add
          </button>
        </div>

        <ul className="space-y-3">
          {tasks.map(task => (
            <li
              key={task.id}
              className="flex justify-between items-center px-4 py-2 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <div
                onClick={() => toggleTask(task.id)}
                className={`cursor-pointer flex-1 ${
                  task.completed ? "line-through text-gray-400" : "text-gray-800"
                }`}
              >
                {task.name}
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskApp;
