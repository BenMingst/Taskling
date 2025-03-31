import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Task {
  _id: string;
  name: string;
  completed: boolean;
}

const API_BASE_URL = import.meta.env.PROD
  ? 'https://taskling.site/api'
  : 'http://localhost:5001/api';

const TaskApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskInput, setTaskInput] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User not logged in');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/tasks/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskName: string) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name: taskName,
        }),
      });

      if (!response.ok) throw new Error('Failed to create task');
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task');
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;

      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          completed: !task.completed,
        }),
      });

      if (!response.ok) throw new Error('Failed to update task');
      setTasks(tasks.map(t =>
        t._id === taskId ? { ...t, completed: !t.completed } : t
      ));
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
    }
  };

  const deleteTask = async () => {
    if (!selectedTask) return;

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${selectedTask._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(t => t._id !== selectedTask._id));
      closeTaskInfo();
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
    }
  };

  const showTaskInput = () => {
    setShowInput(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && taskInput.trim() !== "") {
      addTask(taskInput.trim());
      setTaskInput("");
      setShowInput(false);
    }
  };

  const openTaskInfo = (taskId: string) => {
    const task = tasks.find(t => t._id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  };

  const closeTaskInfo = () => {
    setSelectedTask(null);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="flex">
      <aside className="w-20 bg-white text-purple-500 flex flex-col items-center py-4">
        <Link to="/Tasks" className="mb-8">📋</Link>
        <Link to="/shop" className="mb-8">🛒</Link>
      </aside>

      <div className="flex-1">
        <div className="bg-gray-100 flex justify-center items-center h-screen">
          <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg relative">
            <h2 contentEditable="true" className="text-xl font-semibold mb-4 cursor-pointer">
              Tasks
            </h2>
            <div id="taskList" className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className={`flex items-center p-2 bg-gray-200 rounded cursor-pointer w-3/4 ${
                    task === selectedTask ? "bg-gray-300" : ""
                  }`}
                  onClick={() => openTaskInfo(task._id)}
                >
                  <div
                    className={`h-5 w-5 border-2 border-gray-500 rounded-full mr-3 ${
                      task.completed ? "bg-green-500" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskCompletion(task._id);
                    }}
                  />
                  <span>{task.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-4">
              <button
                onClick={showTaskInput}
                className="w-full text-left text-gray-500 hover:text-black"
              >
                + Add Task
              </button>
              {showInput && (
                <input
                  id="taskInput"
                  type="text"
                  className="w-full mt-2 border rounded p-2"
                  placeholder="Enter task..."
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              )}
            </div>
          </div>

          {selectedTask && (
            <div
              id="taskInfo"
              className="fixed right-0 top-0 h-full w-1/3 bg-white p-6 shadow-lg"
            >
              <button
                onClick={closeTaskInfo}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                &times;
              </button>
              <h3 className="text-lg font-semibold">{selectedTask.name}</h3>
              <button
                onClick={deleteTask}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete Task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskApp;         
