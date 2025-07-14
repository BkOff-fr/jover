import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio link in header', () => {
  render(<App />);
  const linkElement = screen.getByText(/portfolio/i);
  expect(linkElement).toBeInTheDocument();
});
