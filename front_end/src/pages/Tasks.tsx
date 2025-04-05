import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "react-beautiful-dnd";
import "./style.css";

type Task = {
  id: string;        // We'll use a string for the Draggable's unique key
  name: string;
  completed: boolean;
};

const TaskApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  // Helper to reorder tasks array after a drag
  const reorderTasks = (list: Task[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // Handle drag end event
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    // If dropped outside the list or in the same position, do nothing
    if (!destination || destination.index === source.index) return;
    // Reorder the tasks
    const reordered = reorderTasks(tasks, source.index, destination.index);
    setTasks(reordered);
  };

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

      {/* Drag & Drop Context */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-tasks">
          {(provided) => (
            <ul
              className="task-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks.map((task, index) => {
                const isEditing = editingId === task.id;

                return (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(draggableProvided) => (
                      <li
                        className="task-item"
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                      >
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
                            className={`task-name ${
                              task.completed ? "completed" : ""
                            }`}
                            onClick={() => startEditing(task)}
                          >
                            {task.name}
                          </span>
                        )}
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

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
