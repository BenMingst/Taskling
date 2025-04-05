import React, { useState } from "react";
import "./style.css"; // ensure this is the correct path to your style.css

const TaskApp: React.FC = () => {
  const [tasks, setTasks] = useState<Array<{ id: number; name: string; details: string; completed: boolean }>>([]);
  const [selectedTask, setSelectedTask] = useState<{ id: number; name: string; details: string; completed: boolean } | null>(null);
  const [taskInput, setTaskInput] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);

  const showTaskInput = () => setShowInput(true);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && taskInput.trim() !== "") {
      addTask(taskInput.trim());
      setTaskInput("");
      setShowInput(false);
    }
  };

  const addTask = (taskName: string) => {
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        name: taskName,
        details: "",
        completed: false,
      },
    ]);
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map((task) => task.id === taskId ? { ...task, completed: !task.completed } : task));
  };

  const openTaskInfo = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) setSelectedTask(task);
  };

  const closeTaskInfo = () => setSelectedTask(null);

  const deleteTask = () => {
    if (selectedTask) {
      setTasks(tasks.filter((t) => t.id !== selectedTask.id));
      closeTaskInfo();
    }
  };

  const handleDetailsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedTask) {
      setSelectedTask({ ...selectedTask, details: event.target.value });
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-8 bg-white rounded-2xl p-8 shadow-2xl relative">

        <h1 contentEditable className="text-3xl font-bold text-gray-800 border-b pb-4">
          🗒️ My Tasks
        </h1>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-4 border rounded-lg shadow-sm transition-all duration-200 cursor-pointer hover:bg-gray-100 ${
                task === selectedTask ? "bg-gray-100" : "bg-white"
              }`}
              onClick={() => openTaskInfo(task.id)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`h-5 w-5 border-2 rounded-full flex items-center justify-center transition-colors ${
                    task.completed ? "bg-green-500 border-green-500" : "border-gray-400"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTaskCompletion(task.id);
                  }}
                >
                  {task.completed && <span className="text-white text-xs">✔</span>}
                </div>
                <span className={`${task.completed ? "line-through text-gray-500" : "text-gray-800"}`}>
                  {task.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          {showInput ? (
            <input
              autoFocus
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a new task..."
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          ) : (
            <button
              onClick={showTaskInput}
              className="w-full text-left text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
            >
              + Add Task
            </button>
          )}
        </div>
      </div>

      {/* Slide-out panel */}
      {selectedTask && (
        <div className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl p-6 transition-all z-50">
          <button
            onClick={closeTaskInfo}
            className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
          >
            &times;
          </button>
          <h2 className="text-2xl font-semibold mb-4">{selectedTask.name}</h2>
          <textarea
            value={selectedTask.details}
            onChange={handleDetailsChange}
            rows={6}
            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Add some details..."
          />
          <button
            onClick={deleteTask}
            className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
          >
            Delete Task
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskApp;
