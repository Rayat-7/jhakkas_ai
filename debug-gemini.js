const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require("path");

// Load .env.local
dotenv.config({ path: path.join(__dirname, ".env.local") });

async function listModels() {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey || apiKey === "your_api_key_here") {
        console.error("❌ Error: GOOGLE_AI_API_KEY is not set correctly in .env.local");
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            const modelNames = data.models.map(m => m.name);
            const targets = [
                "models/gemini-1.5-flash",
                "models/gemini-1.5-pro",
                "models/gemini-pro",
                "models/gemini-pro-vision",
                "models/gemini-1.0-pro"
            ];

            console.log("✅ Models found summary:");
            targets.forEach(t => {
                const found = modelNames.includes(t);
                console.log(`${found ? "✅" : "❌"} ${t}`);
            });

            console.log("\nOther Gemini-like models:");
            modelNames.filter(n => n.includes("gemini") && !targets.includes(n)).forEach(n => console.log(`- ${n}`));
        } else {
            console.log("❌ No models returned. Full response:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("General error:", error.message);
    }
}

listModels();
