import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "FF Trusted Market", timestamp: new Date().toISOString() });
  });

  // AI Free Fire Account Appraisal & Valuation Endpoint
  app.post("/api/ai-evaluate", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "Gemini API key is not configured" });
      }

      const { level, rank, evoGuns, elitePasses, bundles, server } = req.body;

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an expert Free Fire account appraiser and gaming marketplace specialist.
Evaluate this Free Fire account for the '${server || 'BD'}' server:
- Account Level: ${level || '65+'}
- Rank: ${rank || 'Heroic'}
- Evo Guns: ${evoGuns ? evoGuns.join(', ') : 'None'}
- Elite Passes: ${elitePasses || 0}
- Rare Bundles/Skins: ${bundles ? bundles.join(', ') : 'Standard'}

Provide a JSON object response with:
1. "estimatedPriceBDT": Estimated market price in BDT (Bangladeshi Taka, e.g., 3500)
2. "rarityGrade": e.g. "Mythic", "Legendary", "Epic", "Grandmaster tier"
3. "keyHighlights": Array of 3 bullet points highlighting why this account is valuable
4. "suggestedTitle": Catchy marketplace title (max 60 chars)
5. "suggestedDescription": Professional description for selling on FF Trusted Market.

Return ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const jsonText = response.text;
      if (jsonText) {
        const parsed = JSON.parse(jsonText);
        return res.json({ success: true, evaluation: parsed });
      } else {
        return res.status(500).json({ error: "Empty AI response" });
      }
    } catch (err: any) {
      console.error("AI Evaluation error:", err);
      res.status(500).json({ error: err.message || "Failed to evaluate account" });
    }
  });

  // Vite middleware for development
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
    console.log(`FF Trusted Market server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
