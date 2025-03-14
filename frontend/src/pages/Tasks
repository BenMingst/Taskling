import React, { useState } from "react";

const TaskApp: React.FC = () => {
  const [tasks, setTasks] = useState<Array<{ id: number; name: string; details: string; completed: boolean }>>([]);
  const [selectedTask, setSelectedTask] = useState<{ id: number; name: string; details: string; completed: boolean } | null>(null);
  const [taskInput, setTaskInput] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);

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

  const addTask = (taskName: string) => {
    setTasks([
      ...tasks,
      {
        id: tasks.length,
        name: taskName,
        details: "",
        completed: false,
      },
    ]);
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const openTaskInfo = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  };

  const closeTaskInfo = () => {
    setSelectedTask(null);
  };

  const deleteTask = () => {
    if (selectedTask) {
      setTasks(tasks.filter((t) => t.id !== selectedTask.id));
      closeTaskInfo();
    }
  };

  const handleDetailsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedTask) {
      setSelectedTask({
        ...selectedTask,
        details: event.target.value,
      });
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg relative">
        <h2 contentEditable="true" className="text-xl font-semibold mb-4 cursor-pointer">
          Tasks
        </h2>
        <div id="taskList" className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center p-2 bg-gray-200 rounded cursor-pointer w-3/4 ${
                task === selectedTask ? "bg-gray-300" : ""
              }`}
              onClick={() => openTaskInfo(task.id)}
            >
 <div
                className={`h-5 w-5 border-2 border-gray-500 rounded-full mr-3 ${
                  task.completed ? "bg-green-500" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTaskCompletion(task.id);
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
          <textarea
            className="w-full mt-2 p-2 border rounded"
            rows={5}
            value={selectedTask.details}
            onChange={handleDetailsChange}
            placeholder="Task details..."
          ></textarea>
          <button
            onClick={deleteTask}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete Task
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskApp;         
