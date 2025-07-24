import { callGeminiAPI } from '../src/llm/gemini';
import fetch, { Headers } from 'node-fetch';

global.fetch = fetch;
global.Headers = Headers;

describe('callGeminiAPI', () => {
  it('returns expected CSV string for push-ups', async () => {
    const input = "I did 10 push-ups";
    const expected = "PushUps,10,0lbs";
    const result = await callGeminiAPI(input);
    if (result.result === expected) {
      console.log('PASS: push-ups');
    } else {
      console.log('FAIL: push-ups', result.result);
    }
  });

  it('returns expected CSV string for squats', async () => {
    const input = "I did 12 squats with 30 pounds";
    const expected = "Squats,12,30lbs";
    const result = await callGeminiAPI(input);
    if (result.result === expected) {
      console.log('PASS: squats');
    } else {
      console.log('FAIL: squats', result.result);
    }
  });

  it('returns expected CSV string for bicep curls', async () => {
    const input = "I lifted 25 pounds doing bicep curls";
    const expected = "BicepCurls,12,25lbs";
    const result = await callGeminiAPI(input);
    if (result.result === expected) {
      console.log('PASS: bicep curls');
    } else {
      console.log('FAIL: bicep curls', result.result);
    }
  });

  it('returns expected CSV string for sit-ups', async () => {
    const input = "I did 20 sit-ups";
    const expected = "SitUp,20,0lbs";
    const result = await callGeminiAPI(input);
    if (result.result === expected) {
      console.log('PASS: sit-ups');
    } else {
      console.log('FAIL: sit-ups', result.result);
    }
  });

  it('returns expected CSV string for bench press', async () => {
    const input = "I performed 8 bench presses with 180 pounds";
    const expected = "BenchPress,8,180lbs";
    const result = await callGeminiAPI(input);
    if (result.result === expected) {
      console.log('PASS: bench press');
    } else {
      console.log('FAIL: bench press', result.result);
    }
  });

  it('returns expected CSV string for cycling', async () => {
    const input = "I biked for 10 minutes";
    const expected = "Cycling,10min,0lbs";
    const result = await callGeminiAPI(input);
    if (result.result === expected) {
      console.log('PASS: cycling');
    } else {
      console.log('FAIL: cycling', result.result);
    }
  });
});
