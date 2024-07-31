import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY as string;
export const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0,
  },
  systemInstruction: `You are a data extraction model. You are to get information from any document given to you.`,
});