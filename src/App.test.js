import { render, screen, fireEvent, act } from "@testing-library/react";
import App from "./App";

test('renders accueil link', () => {
  render(<App />);
  const linkElement = screen.getByText(/ACCUEIL/i);

  expect(linkElement).toBeInTheDocument();
});

// New test for scroll-based transition image scaling

// Helper variable to control the top position returned by getBoundingClientRect
let sectionTop = 2000;

beforeEach(() => {
  // Mock getBoundingClientRect to control scroll position of the experience section
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function () {
    if (this.classList.contains('experience-section')) {
      return { top: sectionTop, bottom: sectionTop + 100, left: 0, right: 0, width: 0, height: 100 };
    }
    return { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('transition image scales after scrolling past threshold', () => {
  jest.useFakeTimers();
  const { container } = render(<App />);

  // Fast-forward the loading timer
  act(() => {
    jest.runAllTimers();
  });

  const transitionImage = container.querySelector('#transitionImage');
  expect(transitionImage).toBeTruthy();

  // Initial transform should be translateY(0px)
  expect(transitionImage.style.transform).toBe('translateY(0px)');

  // Scroll past the threshold by updating the section top and pageYOffset
  sectionTop = 0;
  Object.defineProperty(window, 'pageYOffset', { value: 1000, writable: true });
  fireEvent.scroll(window);

  const match = transitionImage.style.transform.match(/scaleX\(([^)]+)\)/);
  expect(match).not.toBeNull();
  expect(parseFloat(match[1])).toBeGreaterThan(1);
});
