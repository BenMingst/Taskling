
import { render, screen, fireEvent } from '@testing-library/react';
import SignUp from './SignUp';
import { MemoryRouter } from 'react-router-dom';

test('renders all input fields and sign-up button', () => {
  render(
  <MemoryRouter>
    <SignUp />
  </MemoryRouter>
  );

  // Check the heading
  expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();

  // Input fields
  expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

  // Sign Up button
  expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
});

test('displays validation errors for weak password', async () => {
  render(
  <MemoryRouter>
    <SignUp />
  </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText('First Name'), {
    target: { value: 'Chamari' },
  });
  fireEvent.change(screen.getByPlaceholderText('Last Name'), {
    target: { value: 'Abesinghe' },
  });
  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: 'chamari@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('Password'), {
    target: { value: 'abc' },
  });

  fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

  expect(
    await screen.findByText(/password does not meet all requirements/i)
  ).toBeInTheDocument();
});

test('shows error message when password does not meet criteria', async () => {
  render(
  <MemoryRouter>
    <SignUp />
  </MemoryRouter>
  );

  fireEvent.change(screen.getByPlaceholderText('First Name'), {
    target: { value: 'Chamari' },
  });
  fireEvent.change(screen.getByPlaceholderText('Last Name'), {
    target: { value: 'Abesinghe' },
  });
  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: 'chamari@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('Password'), {
    target: { value: 'abc' },
  });

  fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

  expect(
    await screen.findByText(/password does not meet all requirements/i)
  ).toBeInTheDocument();
});
