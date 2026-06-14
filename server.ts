import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Initialize Gemini AI client using server-only process.env.GEMINI_API_KEY
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route for ADHD Reset micro-intervention generation
  app.post("/api/reset", async (req, res) => {
    try {
      const { feeling, trigger, location, task, time, intensity = "moderate" } = req.body;

      if (!feeling || !location || !task || !time) {
        return res.status(400).json({ error: "Missing required fields (feeling, location, task, time)" });
      }

      if (!apiKey) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY is not set on the server. Please make sure the AI Studio Secrets panel contains this key." 
        });
      }

      const prompt = `
Generate EXACTLY ONE highly specific somatic or cognitive micro-reset intervention to do RIGHT NOW for a young neurodivergent (ADHD, Autistic, or generally sensory-sensitive) Nigerian adult suffering from task inertia, executive dysfunction, cognitive burnout, or sensory overload.

User Profile:
- Current Feeling: "${feeling}"
- Feeling Intensity Level: "${intensity}" (options: "mild", "moderate", "intense")
- Trigger (if any): "${trigger || "General transition / cognitive overload"}"
- Physical Location: "${location}"
- Target Task (must do): "${task}"
- Available Time To Reset: "${time}"

Guidelines & Tone Constraints:
1. Provide EXACTLY ONE specific micro-intervention to do RIGHT NOW. Do not offer lists, options, choices, or suggestions. Just one.
2. Must take 2–10 minutes max.
3. Must be 100% physically and socially realistic for their customized physical location: "${location}".
   - If they are in a highly public or restrictive space (e.g., banking hall, office/coworking desk, danfo bus, lecture hall), suggest discreet physical grounding, isometric muscle releases, toe curls, closed-eye breathing, ankle rolls, or simple tactile phone/material exploration. Never suggest weird pacing, dancing, singing, or actions that will call public attention.
   - If they are in a personal or comfortable space (e.g., private bedroom, parlor, girlfriend's house, kitchen, single office, quiet yard), you can suggest active stretching, body shaking, splashing cold tap water, lighting incense, changing audio stimulation, short physical resets, or pacing safely.
4. Tone: Like a wise, smart, slightly cynical but deeply caring Nigerian friend who has ADHD/autism themselves and gets it. Warm, direct, clear, grounded, zero toxic positivity. NO generic phrases like "You've got this!", "You're a champion!", "Almost there!". Use natural Nigerian-flavored English nuances or terms when appropriate ("no gree", "calm down first", "reset your head", "safely", "arrange your headspace") without overdoing it. Relatable but fully practical.
5. Name the evidence-based neurodivergent management or sensory regulation research principle behind this specific intervention (e.g., sensory regulation, muscle compression proprioception, dopamine micro-bursts, visual cue anchoring, bilateral stimulation, autistic inertia bypass). Keep it strictly as one short, research-grounded sentence.
6. End with exactly one gentle sentence that bridges them back to their task in a non-threatening way: "${task}".
7. Align the physical/cognitive demand of your intervention to the Feeling Intensity Level:
   - For "mild" intensity (simple distraction or transition lag): suggest a subtle cognitive refocus, visual observation task, or light creative engagement.
   - For "moderate" intensity (active avoidance or staring blankly): suggest structured task-initiation tricks, short physical movements, or easy dopamine-seeking sweeps.
   - For "intense" intensity (total freeze state, sensory meltdown, panic): suggest sudden, high-intensity somatic resets, thermal shocking (water splash), deeper sensory changes, louder humming, or sudden large muscle contraction to force-bypass autonomic lock.

You must return your response conforming strictly to this JSON schema:
{
  "title": "A short, engaging Nigerian-focused catchphrase or title of the action (e.g., 'The Go-Slow Grounding', 'Pure Water Splash', 'Legwork Under the Table', 'Soft Girlfriend's House Reset')",
  "intervention": "The actionable step. Must start with 'Do this now: ' and then detail the step clearly.",
  "whyItWorks": "The scientific justification. Must start with 'Why it works: ' and describe the principle in one research-grounded sentence.",
  "then": "The bridging step. Must start with 'Then: ' and contain exactly one gentle sentence bridging back to their task.",
  "category": "One of [sensory, movement, dopamine, body-double, initiation]",
  "durationSeconds": "A realistic estimation of the duration in seconds (between 120 and 600)"
}
`;

      let response;
      try {
        console.log("Attempting generation using gemini-3.5-flash...");
        response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                intervention: { type: Type.STRING },
                whyItWorks: { type: Type.STRING },
                then: { type: Type.STRING },
                category: { type: Type.STRING },
                durationSeconds: { type: Type.INTEGER }
              },
              required: ["title", "intervention", "whyItWorks", "then", "category", "durationSeconds"]
            },
            systemInstruction: "You are a neurodivergent focus coach and empathetic peer named NeuroReset. You tailor realistic, quick 2-10 min offline interventions specifically for young Nigerian adults with ADHD, sensory sensitivity, or autistic inertia, using peer-friendly, realistic language and clinical coping strategies."
          }
        });
      } catch (geminiError: any) {
        console.warn("Primary model gemini-3.5-flash failed or quota exceeded. Falling back to gemini-3.1-flash-lite. Error was:", geminiError.message || geminiError);
        response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: prompt,
          config: {
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                intervention: { type: Type.STRING },
                whyItWorks: { type: Type.STRING },
                then: { type: Type.STRING },
                category: { type: Type.STRING },
                durationSeconds: { type: Type.INTEGER }
              },
              required: ["title", "intervention", "whyItWorks", "then", "category", "durationSeconds"]
            },
            systemInstruction: "You are a neurodivergent focus coach and empathetic peer named NeuroReset. You tailor realistic, quick 2-10 min offline interventions specifically for young Nigerian adults with ADHD, sensory sensitivity, or autistic inertia, using peer-friendly, realistic language and clinical coping strategies."
          }
        });
      }

      const text = response.text;
      if (!text) {
        throw new Error("No response from Gemini API");
      }

      const result = JSON.parse(text.trim());
      res.json(result);
    } catch (error: any) {
      console.error("Express API Reset Error:", error);
      res.status(500).json({ error: error.message || "An error occurred with the AI system" });
    }
  });

  // Vite middleware setup (development) vs Static serving (production)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
