
import { render, screen, fireEvent } from "@testing-library/react";
import TaskApp from "./Tasks";
import { vi } from "vitest";


describe('Tasks Component', () => {
  // 1. Renders the title
  it('renders the title "Todo"', () => {
    render(<TaskApp />);
    expect(screen.getByText('Todo')).toBeInTheDocument();
  });

  // 2. Adds a task when typing and clicking "Add"
  it('adds a task to the list', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      _id: "1",
      userId: "test-user-id",
      name: "Exercise",
      completed: false,
    }),
  });
    render(<TaskApp />);

    const input = screen.getByPlaceholderText('Add a new task...');
    const button = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'Study React' } });
    fireEvent.click(button);

    const newTask = await screen.findByText('Study React');
    expect(newTask).toBeInTheDocument();

  });

  //3. Clicking on task enables editing mode
  it('starts editing when clicking on task name', async () => {
    render(<TaskApp />);

    // Add a task first
    fireEvent.change(screen.getByPlaceholderText('Add a new task...'), {
      target: { value: 'Exercise' },
    });
    fireEvent.click(screen.getByText('Add'));

    // Click on task name to edit
    const taskText = await screen.findByText('Exercise');
    fireEvent.click(taskText);

    // Edit input should appear
    const input = await screen.findByDisplayValue('Exercise');
    expect(input).toBeInTheDocument();

  });
});
