import { render, screen } from '@testing-library/react';
import App from './App';

test('renders scroll indicator', () => {
  render(<App />);
  const indicator = screen.getByText(/scroll/i);
  expect(indicator).toBeInTheDocument();
});
