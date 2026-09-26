import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { AgentSecurityService, TravelAgentService } from './src/services/agentLogic';
import { ResearchService } from './src/services/researchData';
import { EvaluationService } from './src/services/evaluation';
import { TripItinerary, TripRequirements } from './src/types/travel';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI on server if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Real data research endpoint
app.post('/api/research', async (req: Request, res: Response) => {
  try {
    const { destination, daysCount } = req.body;
    if (!destination) {
      return res.status(400).json({ error: 'destination is required' });
    }
    const data = await ResearchService.researchDestination(destination, daysCount || 5);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to research destination' });
  }
});

// Decision explanation endpoint ("Why did you choose this?")
app.post('/api/explain', (req: Request, res: Response) => {
  try {
    const { itemType, itemName, requirements, itinerary } = req.body;
    if (!itemName || !itinerary) {
      return res.status(400).json({ error: 'itemName and itinerary are required' });
    }
    const explanation = TravelAgentService.explainDecision(
      itemType || 'activity',
      itemName,
      itinerary as TripItinerary,
      requirements as TripRequirements
    );
    res.json({ explanation });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to generate explanation' });
  }
});

// Adaptive re-planning endpoint
app.post('/api/replan', async (req: Request, res: Response) => {
  try {
    const { changeRequest, currentRequirements, currentItinerary } = req.body;
    if (!changeRequest || !currentRequirements) {
      return res.status(400).json({ error: 'changeRequest and currentRequirements are required' });
    }

    const { safeText, isSuspect, flags } = AgentSecurityService.sanitizeUserInput(changeRequest);
    if (isSuspect) {
      return res.json({
        securityBlocked: true,
        message: `Security Shield Alert: Request contains disallowed instruction overrides (${flags.join(', ')}). Your travel parameters were preserved safely.`,
      });
    }

    const { requirements: updatedReq, detectedChanges, researchLogs: parseLogs } =
      TravelAgentService.extractTripRequirements(safeText, currentRequirements);

    const { itinerary: newItinerary, researchLogs: genLogs } = await TravelAgentService.generateItinerary(
      updatedReq,
      currentItinerary,
      { trigger: detectedChanges.join('; ') || safeText }
    );

    res.json({
      requirements: updatedReq,
      itinerary: newItinerary,
      detectedChanges,
      researchLogs: [...parseLogs, ...genLogs],
      message: `Re-planned successfully! ${newItinerary.diffFromPrevious?.summary || ''}`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to re-plan itinerary' });
  }
});

// Main conversational agent endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, existingRequirements, existingItinerary } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 1. Security & Prompt Injection Defense
    const { safeText, isSuspect, flags } = AgentSecurityService.sanitizeUserInput(message);
    if (isSuspect) {
      return res.json({
        securityBlocked: true,
        text: `⚠️ Security Guardrail Triggered: The input was flagged for attempted system prompt or constraint override (${flags.join('; ')}). I am maintaining strict adherence to your travel constraints.`,
        tripRequirements: existingRequirements || null,
        itinerary: existingItinerary || null,
      });
    }

    // 2. Smart Trip Understanding
    const {
      requirements,
      detectedChanges,
      researchLogs: understandLogs,
    } = TravelAgentService.extractTripRequirements(safeText, existingRequirements);

    // If critical information is missing, do NOT invent! Ask clarifying question
    if (requirements.isMissingRequiredInfo) {
      return res.json({
        text: requirements.clarifyingQuestion || 'Could you specify your intended destination and duration?',
        tripRequirements: requirements,
        itinerary: existingItinerary || null,
        workflowStep: 'understanding',
        missingFields: requirements.missingFields,
        suggestedQuickReplies: [
          '5-day trip to Manali under ₹50,000 for 2 people',
          '3-day heritage tour to Jaipur under ₹30,000',
          '4-day relaxed beach trip to Goa under ₹45,000',
        ],
        researchLogs: understandLogs,
      });
    }

    // 3. Research & Personalized Itinerary Generation
    const { itinerary, researchLogs: planLogs } = await TravelAgentService.generateItinerary(
      requirements,
      existingItinerary,
      detectedChanges.length > 0 ? { trigger: detectedChanges.join('; ') } : undefined
    );

    const allLogs = [...understandLogs, ...planLogs];

    // Build agent conversational response
    let agentText = '';
    const diff = itinerary.diffFromPrevious;
    const isOver = itinerary.validation.budgetStatus.isOverBudget;

    if (diff && diff.itemizedChanges.length > 0) {
      agentText = `🔄 **Adaptive Re-planning Complete**\n\n`;
      agentText += `**Changes detected:**\n${diff.itemizedChanges.map((c) => `• ${c}`).join('\n')}\n\n`;
      if (diff.preservedDays.length > 0) {
        agentText += `✅ **Preserved:** Days ${diff.preservedDays.join(', ')} remain untouched.\n`;
      }
      agentText += `✏️ **Modified:** Days ${diff.modifiedDays.join(', ')} adjusted.\n\n`;
    } else {
      agentText = `✨ **Crafted your ${requirements.durationDays}-Day personalized itinerary for ${requirements.destination}!**\n\n`;
      agentText += `Researched real live weather, verified attractions, local dining, and accommodation tailored for ${requirements.travelers} traveler(s).\n\n`;
    }

    if (isOver) {
      agentText += `⚠️ **Budget Notice:** ${itinerary.validation.budgetStatus.message}\n`;
      agentText += `**Actionable remedies to bring within budget:**\n`;
      itinerary.validation.budgetStatus.remedies.forEach((r) => {
        agentText += `• ${r}\n`;
      });
    } else {
      agentText += `💰 **Budget Status:** ₹${itinerary.totalCost.toLocaleString('en-IN')} total estimated spend (surplus of ₹${itinerary.validation.budgetStatus.diff.toLocaleString('en-IN')}).\n`;
    }

    // Optional AI enhancement if Gemini key is available
    if (aiClient) {
      try {
        const aiPrompt = `You are WanderWise, an elite, practical AI Travel Agent.
The user asked: "${safeText}"
A verified itinerary for ${requirements.destination} (${requirements.durationDays} days, ${requirements.travelers} people, budget ₹${requirements.budget.amount}) has been generated. Total cost: ₹${itinerary.totalCost}.
Write a warm, concise 2-sentence conversational intro summarizing how the plan matches their specific preferences for ${requirements.interests.join(', ')}. Keep it under 50 words. Do not repeat full bullet lists.`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: aiPrompt,
        });

        if (response.text) {
          agentText = `${response.text.trim()}\n\n${agentText}`;
        }
      } catch {
        // Fallback to deterministic text
      }
    }

    res.json({
      text: agentText,
      tripRequirements: requirements,
      itinerary,
      validation: itinerary.validation,
      diff: itinerary.diffFromPrevious,
      workflowStep: 'completed',
      researchLogs: allLogs,
      suggestedQuickReplies: [
        `Reduce my budget to ₹${Math.max(15000, Math.round(requirements.budget.amount * 0.75))}`,
        'Make the itinerary more relaxed',
        'I don’t want early morning activities',
        'What if it rains on Day 3?',
        `Why did you choose ${itinerary.days[0]?.activities[0]?.title || 'this'}?`,
      ],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Chat service encountered an error' });
  }
});

// Evaluation suite runner endpoint
app.post('/api/evaluate', async (_req: Request, res: Response) => {
  try {
    const report = await EvaluationService.runAllTests();
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to execute evaluation test suite' });
  }
});

// Vite or Static Production middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[WanderWise AI Travel Agent] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
