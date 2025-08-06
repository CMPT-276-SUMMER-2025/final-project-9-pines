import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './components/app';

// Mock the speech recognition hook
jest.mock('react-speech-recognition', () => ({
  useSpeechRecognition: () => ({
    transcript: '',
    listening: false,
    resetTranscript: jest.fn(),
    browserSupportsSpeechRecognition: true,
    isMicrophoneAvailable: true,
  }),
}));

// Mock the Gemini API
jest.mock('./llm/gemini', () => ({
  callGeminiAPI: jest.fn(),
}));

// Wrapper component to provide router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

test('renders app without crashing', () => {
  renderWithRouter(<App />);
  // The app should render without throwing any errors
  expect(document.body).toBeInTheDocument();
});

test('app has routing functionality', () => {
  renderWithRouter(<App />);
  // Check that the app renders (this is a basic smoke test)
  expect(document.querySelector('.app')).toBeTruthy();
}); 