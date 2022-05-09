import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { TodoModel } from './TodoModel';

test('renders learn react link', () => {
  const model = new TodoModel('react-todos');
  render(<App model={model} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
