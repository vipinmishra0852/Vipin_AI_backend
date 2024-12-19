import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import Gemini API SDK

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Use the Gemini API key from your .env file
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Specify the model you want to use (e.g., "gemini-1.5-flash")

// Test route to check server status
app.get("/", (req, res) => {
  res.status(200).send({
    message: "Hello from CodeX!",
  });
});

// Handle POST requests to generate AI response
app.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Check if prompt is empty
    if (!prompt) {
      return res.status(400).send({ message: "Prompt is required" });
    }

    console.log("Received prompt:", prompt); // Log the prompt for debugging

    // Call Gemini API to generate response
    const result = await model.generateContent(prompt);

    // Send Gemini API response back to the frontend
    res.status(200).send({
      bot: result.response.text().trim(), // Get the response text from Gemini API and send it back
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error:", error.message);

    // Return error response to frontend
    res.status(500).send({
      message: "Internal Server Error",
      details: error.message,
    });
  }
});

// Start the server
app.listen(5000, () =>
  console.log("AI server started on http://localhost:5000")
);
