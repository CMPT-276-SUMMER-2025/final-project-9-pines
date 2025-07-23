import { callLLMAPI } from '../components/llmAPI';

global.fetch = jest.fn();

describe('callLLMAPI', () => {
  it('returns parsed string from successful API call', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 'PushUps,10,0' })
    });

    const input = "I did 10 push-ups";
    const result = await callLLMAPI(input);

    expect(result).toBe('PushUps,10,0');
    expect(fetch).toHaveBeenCalledWith('/api/llm', expect.any(Object));
  });

  it('returns null and logs error when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await callLLMAPI("test input");
    expect(result).toBeNull();
  });

  it('returns null if response is not ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({})
    });

    const result = await callLLMAPI("test input");
    expect(result).toBeNull();
  });

  it('returns parsed string from successful API call', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 'Squats,12,30' })
    });

    const input = "I did 12 squats with 30 pounds";
    const result = await callLLMAPI(input);

    expect(result).toBe('Squats,12,30');
    expect(fetch).toHaveBeenCalledWith('/api/llm', expect.any(Object));
  });

  it('returns parsed string from successful API call', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 'BicepCurls,12,25' })
    });

    const input = "I lifted 25 pounds doing bicep curls";
    const result = await callLLMAPI(input);

    expect(result).toBe('BicepCurls,12,25');
    expect(fetch).toHaveBeenCalledWith('/api/llm', expect.any(Object));
  });

  it('returns parsed string from successful API call', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 'SitUps,20,0' })
    });

    const input = "I did 20 sit-ups";
    const result = await callLLMAPI(input);

    expect(result).toBe('SitUps,20,0');
    expect(fetch).toHaveBeenCalledWith('/api/llm', expect.any(Object));
  });

  it('returns parsed string from successful API call', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 'BenchPress,8,180' })
    });

    const input = "I performed 8 bench presses with 180 pounds";
    const result = await callLLMAPI(input);

    expect(result).toBe('BenchPress,8,180');
    expect(fetch).toHaveBeenCalledWith('/api/llm', expect.any(Object));
  });

  it('returns parsed string from successful API call', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: 'Cycling,10min,0' })
    });

    const input = "I biked for 10 minutes";
    const result = await callLLMAPI(input);

    expect(result).toBe('Cycling,10min,0');
    expect(fetch).toHaveBeenCalledWith('/api/llm', expect.any(Object));
  });

});

