import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { image, focus, mood, language } = await request.json();

    if (!image || !focus || !mood || !language) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Handle string (legacy) or array (new) inputs
    const moodStr = Array.isArray(mood) ? mood.join(" & ") : mood;
    const langStr = Array.isArray(language) ? language.join(" & ") : language;

    const base64Data = image.split(",")[1];
    // Extract mime type from the data URL prefix (e.g. "data:image/heic;base64")
    const mimeType = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/)?.[1] || "image/jpeg";

    if (!base64Data) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }

    // List of models to try in order of preference
    // This provides fallback redundancy for 429 (Rate Limit) and 404 (Not Found) errors
    const modelsToTry = [
      "gemini-2.0-flash-exp",             // Latest experimental (often best quality/speed)
      "gemini-2.0-flash-lite-preview-02-05", // New lite preview (separate quota usually)
      "gemini-flash-latest",              // Stable Flash alias
      "gemini-1.5-flash-latest"           // Explicit 1.5 fallback
    ];

    // 1. Define specific rules for each language/mood
    const langRules: Record<string, string> = {
      "Bangla": "Use pure Bengali Script (বাংলা অক্ষর). Add deep poetic words (আবেগ) and local context.",
      "Banglish": "Use Romanized Bengali (English letters). Mix Bengali and English slang (e.g., 'Vibe ta pura joss').",
      "English": "Use modern Gen-Z English with emojis. Keep it aesthetic and minimalist.",
      "Urdu": "Use Romanized Urdu mixed with English. Example style: 'Yeh scene toh kamaal hai ✨' or 'Aaj ka vibe bohot sakht hai.'",
      "Hindi": "Use Romanized Hindi mixed with English. Keep it trendy and relatable."
    };

    const moodRules: Record<string, string> = {
      "Romantic": "Poetic, dreamy, and soft. Focus on feelings and 'Mon' (মন).",
      "Funny": "Sarcastic, humorous, and witty. Use funny local observations.",
      "Zen-Z-Hype": "Savage, confident, and bold. Use boss-level energy.",
      "Attitude": "Savage, confident, and bold. Use boss-level energy.",
      "Minimal": "Short, 3-5 words only, very aesthetic.",
      "Aesthetic": "Visually pleasing, artsy, and calm.",
      "Poetic": "Deep, rhyming, and metaphorical."
    };

    // Helper to extract primary key if array/string mixed
    const safeLang = Object.keys(langRules).find(k => langStr.includes(k)) || "English";
    const safeMood = Object.keys(moodRules).find(k => moodStr.includes(k)) || "Aesthetic";

    const prompt = `You are a viral social media expert. Analyze this image and create engaging content.

Focus Point: ${focus}
Mood: ${moodStr}
Language: ${langStr}

STRICT STYLE RULES:
- Language Style: ${langRules[safeLang] || langRules["English"]}
- Mood Style: ${moodRules[safeMood] || "Keep it engaging."}
- Length: Max 12 words per caption.
- Structure: Create 5 unique captions. Do NOT be boring. Use emojis naturally.

Based on the image focusing on "${focus}", generate:

1. EXACTLY 5 captions matching the "${moodStr}" vibe.
Captions must be viral-worthy.

2. EXACTLY 5 trending song recommendations matching the "${moodStr}" vibe. Include songs like Arijit Singh, Atif Aslam ,AP Dhillon, Diljit Dosanjh, The Weeknd, Travis Scott style. For each song provide title, artist, most iconic lyric, and a youtube_link (search URL).

Return ONLY valid JSON (no markdown, no code blocks):
{
  "captions": ["caption1", "caption2", "caption3", "caption4", "caption5"],
  "songs": [
    {"title": "Song Name", "artist": "Artist Name", "lyric": "Iconic lyric", "youtube_link": "https://www.youtube.com/results?search_query=Song+Name+Artist"},
    {"title": "Song Name 2", "artist": "Artist Name 2", "lyric": "Iconic lyric 2", "youtube_link": "https://www.youtube.com/results?search_query=Song+Name+2+Artist"},
    {"title": "Song Name 3", "artist": "Artist Name 3", "lyric": "Iconic lyric 3", "youtube_link": "https://www.youtube.com/results?search_query=Song+Name+3+Artist"},
    {"title": "Song Name 4", "artist": "Artist Name 4", "lyric": "Iconic lyric 4", "youtube_link": "https://www.youtube.com/results?search_query=Song+Name+4+Artist"},
    {"title": "Song Name 5", "artist": "Artist Name 5", "lyric": "Iconic lyric 5", "youtube_link": "https://www.youtube.com/results?search_query=Song+Name+5+Artist"}
  ]
}`;

    let lastError;
    let generatedContent;

    // Try models in sequence until one works
    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting generation with model: ${modelName}`);
        const model = genAI.getGenerativeModel({ 
          model: modelName 
        });

        const result = await model.generateContent([
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType, 
            },
          },
          { text: prompt },
        ]);

        const response = await result.response;
        // Check if we got a valid text response
        const text = response.text();
        if (!text) throw new Error("Empty response from AI");

        // Parse JSON
        try {
          const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          generatedContent = JSON.parse(cleanedText);
          
          // If we successfully parsed, break the loop - we have our result!
          console.log(`✅ Success with model: ${modelName}`);
          break; 
        } catch (parseError) {
          console.error(`Failed to parse JSON from ${modelName}:`, text.substring(0, 100) + "...");
          // If JSON parsing fails, we might want to try another model or just fail. 
          // Usually this means the model output was bad. Let's count it as a failure and try next.
          throw new Error("JSON parsing failed");
        }

      } catch (error: any) {
        console.warn(`❌ Failed with ${modelName}: ${error.message}`);
        lastError = error;
        
        // If it's a 429 (Rate Limit), wait a short bit before trying next model
        // to avoid hammering the API if quotas are shared.
        if (error.message.includes("429")) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        continue; // Try next model
      }
    }

    if (!generatedContent) {
      console.error("All models failed. Last error:", lastError);
      return NextResponse.json(
        { 
          error: "All AI models failed", 
          details: lastError?.message || "Unknown error",
          suggestion: "Please wait a moment and try again." 
        },
        { status: 503 } // Service Unavailable
      );
    }

    return NextResponse.json(generatedContent);

  } catch (error: any) {
    console.error("Jhakkas Error:", error);
    return NextResponse.json(
      { error: "AI Generation failed", details: error.message },
      { status: 500 }
    );
  }
}
