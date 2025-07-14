import { render, screen } from '@testing-library/react';
import App from './App';

test('renders accueil link', () => {
  render(<App />);
  const linkElement = screen.getByText(/ACCUEIL/i);

  expect(linkElement).toBeInTheDocument();
});
