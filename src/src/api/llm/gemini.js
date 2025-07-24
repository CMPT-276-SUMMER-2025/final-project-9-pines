import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyCHEbnuTeXfarDkKTbS5E50YGwMothFQ5g" });
const csvDataPrompt = `You are part of a workout tracking application. 
You will only reply with CSV data values.
Extract the following data from the user's workout description in this format: workoutType,Reps,Weight

Example 1:
"Just did a set of benchpress, 9 reps with a plate on each side"

---Reasoning---: A plate is 45lbs and the standard bar weight is 45lbs, so the weight is 2 x 45lbs plate + 1 x 45lbs bar = 135 lbs
Output: BenchPress,9,135lbs

Example 2:
"6 reps of lateral raises with 20lbs dumbbells"

---Reasoning---: For the workout type of lateral raises, we set the weight to 20lbs, because this is what the user has in each hand.
Output: LateralRaise,6,20lbs

Now complete this example:

`;

export async function callGeminiAPI(text) {
  try {
    
    const prompt = csvDataPrompt + text

    if (typeof text !== "string" || !text.trim()) {
      return { error: "Missing or invalid 'text' parameter.", status: 400 };
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
        }
    });

    // The Gemini API response may have a .text or .candidates[0].content.parts[0].text
    let resultText = response?.text;
    if (!resultText && response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      resultText = response.candidates[0].content.parts[0].text;
    }

    return { result: resultText };
  } catch (error) {
    return { error: error?.message || "Internal Server Error", status: 500 };
  }
}
