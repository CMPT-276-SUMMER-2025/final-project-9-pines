import { GoogleGenAI } from '@google/genai';
//SET TEMPERATURE to 0
//Dont let user ramble on, check before continuing
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('REACT_APP_GEMINI_API_KEY environment variable is not set. Please add it to your .env file.');
}
const ai = new GoogleGenAI({ apiKey });
const csvDataPrompt = `You are part of a workout tracking application. 
You will only reply with CSV data values.
Extract the following data from the user's workout description in this format: workoutType,Reps,Weight[,NeedsReview]

IMPORTANT: If the exercise seems unusual, unrealistic, or outside normal human capabilities (e.g., extremely high reps, unrealistic weights, impossible exercises), add "NeedsReview" as the fourth field.

Example 1:
"Just did a set of benchpress, 9 reps with a plate on each side"

---Reasoning---: A plate is 45lbs and the standard bar weight is 45lbs, so the weight is 2 x 45lbs plate + 1 x 45lbs bar = 135 lbs. This is a normal, realistic workout.
Output: BenchPress,9,135lbs

Example 2:
"6 reps of lateral raises with 20lbs dumbbells"

---Reasoning---: For the workout type of lateral raises, we set the weight to 20lbs, because this is what the user has in each hand. This is a normal, realistic workout.
Output: LateralRaise,6,20lbs

Example 3:
"I did 4000 pushups with 1000lbs on my back"

---Reasoning---: 4000 pushups with 1000lbs is extremely unrealistic and outside normal human capabilities. This needs review.
Output: PushUps,4000,1000lbs,NeedsReview

Example 4:
"I just did my benchpress workout, it consisted of 3 sets of a plate and 1 set of just 25lbs, first set I did 10 reps, second set I did 9, third did 8. And the 4th with 25lbs I did 12reps"

--Reasoning:--: The input describes multiple workout sets in one prompt, so we need to output multiple lines of csv data. All sets are realistic.
Output: BenchPress,10,135lbs;BenchPress,9,135lbs;BenchPress,8,135lbs;BenchPress,12,95lbs

Example 5: "I did 3 sets of lat pull downs with 110lbs,10reps then 9 and 8. And 4 sets of pushups 10 reps, 9 and 7"
--Reasoning--: All sets are realistic and normal.

Output: "LatPullDown,10,110lbs;LatPullDown,9,110lbs;LatPullDown,8,110lbs;PushUps,10,Bodyweight;PushUps,9,Bodyweight;PushUps,7,Bodyweight;"

Example 6:
"I did 5000 squats with 2000lbs"

---Reasoning---: 5000 squats with 2000lbs is extremely unrealistic and impossible for any human.
Output: Squats,5000,2000lbs,NeedsReview

Now complete the following example:


`;


// Prompt for summarizing workout CSV data
const csvSummaryPrompt = `You are a helpful assistant for a workout tracking application.
You will be given a list of workout entries in CSV format, where each entry is in the form: workoutType,Reps,Weight[,Date].
Your job is to summarize the user's workout history in a concise, human-readable way.
Highlight the most common workout types, total sets, average reps, and any notable trends or achievements.
Do not include the raw CSV data in your response. Be brief and informative.

Example input:
BenchPress,10,135lbs
BenchPress,9,135lbs
PushUps,15,Bodyweight
PushUps,12,Bodyweight

Example output:
You performed mostly BenchPress and PushUps. For BenchPress, you completed 2 sets averaging 9.5 reps at 135lbs. For PushUps, you did 2 sets averaging 13.5 reps. Great consistency!

Now summarize the following workout data:
`;

/**
 * Summarizes workout CSV data using Gemini API.
 * @param {Array<string>} workoutData - Array of CSV strings, e.g. ["BenchPress,10,135lbs", ...]
 * @param {string} language - Language code, e.g. 'en' or 'fr'. Defaults to 'en'.
 * @returns {Promise<{summary: string}|{error: string, status: number}>}
 */
export async function summarizeWorkoutCSV(workoutData, language = 'en') {
  try {
    if (!Array.isArray(workoutData) || workoutData.length === 0) {
      return { error: 'Missing or invalid \'workoutData\' parameter.', status: 400 };
    }
    // Join the CSV entries with newlines for clarity
    const csvString = workoutData.join('\n');
    // Add language-specific instruction to the prompt
    const languageInstruction = language === 'fr' ? '\n\nIMPORTANT: Reply in French.' : '';
    const prompt = csvSummaryPrompt + languageInstruction + '\n' + csvString;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
          temperature: 0,
        },
      },
    });

    let summaryText = response?.text;
    if (!summaryText && response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      summaryText = response.candidates[0].content.parts[0].text;
    }

    return { summary: summaryText };
  } catch (error) {
    return { error: error?.message || 'Internal Server Error', status: 500 };
  }
}



export async function callGeminiAPI(text, language = 'en') {
  try {
    
    // Add language-specific instruction to the prompt
    const languageInstruction = language === 'fr' ? '\n\nIMPORTANT: Reply in French.' : '';
    const prompt = csvDataPrompt + languageInstruction + '\n\n' + text;

    if (typeof text !== 'string' || !text.trim()) {
      return { error: 'Missing or invalid \'text\' parameter.', status: 400 };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0,
          temperature:0, // Disables thinking
        },
      },
    });

    // The Gemini API response may have a .text or .candidates[0].content.parts[0].text
    let resultText = response?.text;
    if (!resultText && response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      resultText = response.candidates[0].content.parts[0].text;
    }

    return { result: resultText };
  } catch (error) {
    return { error: error?.message || 'Internal Server Error', status: 500 };
  }
}