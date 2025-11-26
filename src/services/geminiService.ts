import { GoogleGenAI } from "@google/genai";
import { PRODUCTS, LOCATIONS } from '../constants';
import { DataService } from './dataService';

// Initialize Gemini
// Note: In a real environment, verify process.env.API_KEY exists.
const apiKey = process.env.API_KEY || ''; 
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const GeminiService = {
  generateShiftReport: async (): Promise<string> => {
    if (!ai) {
      return "Gemini API Key is missing. Please configure the environment to enable AI insights.";
    }

    // Gather data context
    const transfers = DataService.getTransfers();
    const incidents = DataService.getIncidents();
    const stockCounts = DataService.getRecentStockCounts();

    // Prepare a prompt context summary
    const summary = `
      Event: CF25 Festival
      Locations: ${LOCATIONS.map(l => l.name).join(', ')}
      Products: ${PRODUCTS.map(p => p.name).join(', ')}
      
      Recent Activity:
      - Total Transfers Logged: ${transfers.length}
      - Total Incidents (Wastage/Breakage): ${incidents.length}
      - Stock Counts Performed: ${stockCounts.length}
      
      Incident Details:
      ${incidents.slice(-5).map(i => `- ${i.reason}: ${i.quantityUnits} units of ${PRODUCTS.find(p => p.id === i.productId)?.name}`).join('\n')}
    `;

    try {
      const model = 'gemini-2.5-flash';
      const prompt = `
        You are an inventory logistics expert for a high-volume music festival.
        Analyze the following operational data summary and provide a brief, bullet-pointed shift report.
        
        Focus on:
        1. Potential efficiency bottlenecks based on transfer volume (Hub & Spoke model).
        2. Wastage trends if any.
        3. A motivating closing remark for the bar staff.
        
        Data:
        ${summary}
      `;

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });

      return response.text || "No insights generated.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Unable to generate report due to AI service error.";
    }
  }
};
