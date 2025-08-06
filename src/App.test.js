import { callGeminiAPI } from './llm/gemini';

// Mock the Gemini API module
jest.mock('./llm/gemini', () => ({
  callGeminiAPI: jest.fn(),
}));

//Comment another

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Gemini API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('callGeminiAPI should be called with correct parameters', async () => {
    const mockResponse = { result: 'BenchPress,10,135lbs' };
    callGeminiAPI.mockResolvedValue(mockResponse);

    const testText = 'Just did 10 reps of bench press with 135 pounds';
    const result = await callGeminiAPI(testText);

    expect(callGeminiAPI).toHaveBeenCalledWith(testText);
    expect(result).toEqual(mockResponse);
  });

  test('callGeminiAPI should handle errors gracefully', async () => {
    const mockError = { error: 'API Error', status: 500 };
    callGeminiAPI.mockResolvedValue(mockError);

    const testText = 'Invalid input';
    const result = await callGeminiAPI(testText);

    expect(callGeminiAPI).toHaveBeenCalledWith(testText);
    expect(result).toHaveProperty('error');
    expect(result.status).toBe(500);
  });

  test('callGeminiAPI should handle empty input', async () => {
    const mockResponse = { error: 'Missing or invalid text parameter.', status: 400 };
    callGeminiAPI.mockResolvedValue(mockResponse);

    const result = await callGeminiAPI('');

    expect(callGeminiAPI).toHaveBeenCalledWith('');
    expect(result).toHaveProperty('error');
    expect(result.status).toBe(400);
  });
});
 