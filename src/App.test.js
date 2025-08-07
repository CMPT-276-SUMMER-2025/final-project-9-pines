import { callGeminiAPI } from './llm/gemini';
import { translations } from './locales/translations';

// Mock the Gemini API module
jest.mock('./llm/gemini', () => ({
  callGeminiAPI: jest.fn(),
}));

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

// Test translation dictionary structure
describe('Translation Dictionary', () => {
  test('should have the same keys for English and French', () => {
    const enKeys = Object.keys(translations.en);
    const frKeys = Object.keys(translations.fr);

    // Check that both have the same number of keys
    expect(enKeys.length).toBe(frKeys.length);

    // Check that every key in English exists in French
    enKeys.forEach(key => {
      expect(frKeys).toContain(key);
    });

    // Check that every key in French exists in English
    frKeys.forEach(key => {
      expect(enKeys).toContain(key);
    });
  });

  test('should have non-empty values for all keys', () => {
    const enKeys = Object.keys(translations.en);
    const frKeys = Object.keys(translations.fr);

    // Check that all English values are non-empty strings
    enKeys.forEach(key => {
      expect(translations.en[key]).toBeTruthy();
      expect(typeof translations.en[key]).toBe('string');
      expect(translations.en[key].length).toBeGreaterThan(0);
    });

    // Check that all French values are non-empty strings
    frKeys.forEach(key => {
      expect(translations.fr[key]).toBeTruthy();
      expect(typeof translations.fr[key]).toBe('string');
      expect(translations.fr[key].length).toBeGreaterThan(0);
    });
  });
});
 