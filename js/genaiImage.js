import { GoogleGenerativeAI, Modality } from "@google/generative-ai";
import { generatePrompt } from "./promptGenerator.js";

export function initGenAI() {
  const keyInput = document.getElementById("genai-key-input");
  const button = document.getElementById("generate-image-button");
  const resultContainer = document.getElementById("image-result");

  if (!keyInput || !button || !resultContainer) {
    console.error("GenAI elements not found");
    return;
  }

  button.addEventListener("click", async () => {
    const apiKey = keyInput.value.trim();
    if (!apiKey) {
      alert("API key required");
      return;
    }

    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = "Generating...";

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-preview-image-generation",
          generationConfig: {
              responseModalities: [Modality.IMAGE],
          }
      });
      const prompt = generatePrompt();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let imageData;
      const candidates = response.candidates || [];
      if (candidates.length > 0) {
        const parts = candidates[0].content.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            imageData = part.inlineData.data;
            break;
          }
        }
      }
      resultContainer.innerHTML = "";
      if (imageData) {
        const img = document.createElement("img");
        img.src = `data:image/png;base64,${imageData}`;
        img.className = "mt-4";
        resultContainer.appendChild(img);
      } else {
        resultContainer.textContent = "No image received.";
      }
    } catch (err) {
      console.error("Error generating image", err);
      resultContainer.textContent = "Error generating image.";
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  });
}
