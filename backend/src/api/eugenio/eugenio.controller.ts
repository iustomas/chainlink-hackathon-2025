// hono
import { Context } from "hono";

// fs
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";

// path
import { join, dirname } from "path";

// url
import { fileURLToPath } from "url";

// types
import {
  JustTalkWithLLMRequest,
  JustTalkWithLLMResponse,
} from "./types/eugenio.types.js";
import { ECU, 
  DialogueTurn,
} from "./types/ecu.types.js";

// validator input
import { validateJustTalkWithLLMRequest } from "./validators/eugenio.validator.js";

// llm service
import { llmServiceManager } from "../../services/llm/index.js";
import { PROVIDERS, MODELS } from "../../services/llm/llm.constants.js";

// encoder
import { encode } from "gpt-3-encoder";

// read personality file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const personalityPath = join(
  __dirname,
  "../../../agent/memories/personality-tomas-web3.md"
);
const systemPromptPath = join(
  __dirname,
  "../../../agent/system-prompts/praefatio.md"
);
const artifactsPraefatioPath = join(
  __dirname,
  "../../../agent/memories/artifacts-praefatio.md"
);
const proposalsPraefatioPath = join(
  __dirname,
  "../../../agent/memories/proposals-praefatio.md"
);
const semanticMemoryPath = join(
  __dirname,
  "../../../agent/memories/semantic-tomas-web3.md"  
);

// Read files
const personality = readFileSync(personalityPath, "utf-8");
const systemPromptPraefatio = readFileSync(systemPromptPath, "utf-8");
const artifactsPraefatio = readFileSync(artifactsPraefatioPath, "utf-8");
const proposalsPraefatio = readFileSync(proposalsPraefatioPath, "utf-8");
const semanticMemory = readFileSync(semanticMemoryPath, "utf-8");
// conversation memory is not used in this version, but can be used in the future

// ECU directory
const ECU_DIR = join(__dirname, "../../../agent/ecu-sessions");

// controller
export const eugenioController = {
  // just talk with llm
  justTalkWithLLM: async (c: Context) => {
    let body: JustTalkWithLLMRequest | undefined;

    try {
      body = await c.req.json();

      // Validate request
      const validationErrors = validateJustTalkWithLLMRequest(
        body as JustTalkWithLLMRequest
      );

      if (validationErrors.length > 0) {
        return c.json(
          {
            success: false,
            error: "Validation failed",
            details: validationErrors,
          },
          400
        );
      }

      
      // At this point, body is guaranteed to be defined and valid
      const validatedBody = body as JustTalkWithLLMRequest;
const sessionId = validatedBody.sessionId || "default-session";
      let ecu = loadECU(sessionId);

      if (!ecu) {
        ecu = {
          metadata: {
            sessionId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          cognitive_vectors: {
            case_facts: { facts: [], summary: "" },
            client_profile: { name: "" },
            dialogue_history: { turns: [] },
            current_hypothesis: { hypothesis: "", confidence: 0 },
            session_status: { status: "active", lastAction: "" },
          },
        };
      }
      // Construye el historial de diálogo desde ECU
      const ecuConversationHistoryString = ecu.cognitive_vectors.dialogue_history.turns
        .map(
          (msg) =>
            `Mensaje #${msg.messageNumber}\nUsuario: ${msg.user}\nTomas: ${msg.llm}\n`
        )
        .join("\n");
      // Construye el systemPrompt incluyendo la conversación
      // Construye el systemPrompt incluyendo la conversación desde ECU
      let systemPrompt = `
ATENCIÓN: RESPONDE ÚNICAMENTE en formato JSON válido, SIN NINGÚN TEXTO, explicación, comentario, ni etiquetas como \`\`\`json. 
NO EXPLIQUES, NO JUSTIFIQUES, NO HABLES. SOLO JSON. 
Si no puedes responder en JSON, responde solo con {}.

Formato OBLIGATORIO:
{
  "client_response": "Texto que debe ver el cliente final. Debes empezar con la palabra amarillo la respuesta que va a ver el usuario",
  "ecu": {
    "case_facts": { "facts": [], "summary": "" },
    "client_profile": { "name": "", "email": "", "preferences": {} },
    "current_hypothesis": { "hypothesis": "", "confidence": 0 },
    "session_status": { "status": "active", "lastAction": "" }
  },
  "actions": ["lista de acciones sugeridas o comandos internos"]
}

EJEMPLO VÁLIDO:
{
  "client_response": "¡Hola! ¿En qué puedo ayudarte hoy?",
  "ecu": {
    "case_facts": { "facts": [], "summary": "" },
    "client_profile": { "name": "", "email": "", "preferences": {} },
    "current_hypothesis": { "hypothesis": "", "confidence": 0 },
    "session_status": { "status": "active", "lastAction": "" }
  },
  "actions": []
}

EJEMPLO INVÁLIDO (NO HAGAS ESTO):
Hola, aquí tienes tu JSON:
\`\`\`json
{ ... }
\`\`\`
O cualquier explicación, comentario o texto fuera del JSON.

REGLA FINAL: Si no respondes en JSON EXACTAMENTE como el formato, tu respuesta será descartada.

---
The conversation history is as follows:\n${ecuConversationHistoryString}\n        
`;
      
      //let systemPrompt = `      
        //Your instructions are as follows:\n${systemPromptPraefatio}\n
        //Your personality is as follows:\n${personality}\n
        //Your documents outputs are as follows:\n${artifactsPraefatio}\n
        //Your proposals outputs are as follows:\n${proposalsPraefatio}\n
          
        //`;
      //Agregar lo siguiente para implementar memoria semantica: Your semantic memory is as follows:\n${semanticMemory}\n
      
      // Generate LLM response
      const PROVIDER = PROVIDERS.GEMINI;
      const MODEL = MODELS.GEMINI_2_5_FLASH_PREVIEW_05_20;

      // Justo antes de la llamada al LLM:
      const totalPrompt = `
        ${systemPrompt}
        ${validatedBody.message}
      `;

      // Cuenta los tokens del prompt completo
      const tokenCount = encode(totalPrompt).length;   

      const llmResponse = await llmServiceManager.generateText(
        {
          prompt: `
            ${validatedBody.message}          
          `,
          systemPrompt,
          model: MODEL,
        },
        PROVIDER
      );

      const response: JustTalkWithLLMResponse = {
        success: true,
        response: llmResponse.content,
        timestamp: new Date().toISOString(),
      };

      console.log("--------------------------------");
      console.log("Provider: ", PROVIDER);
      console.log("Model: ", MODEL);
      console.log("");
      console.log("System prompt: ", systemPrompt);
      console.log("prompt: ", validatedBody.message);
      console.log("response: ", llmResponse.content);
      console.log("response length: ", llmResponse.content.length);
      console.log("response (start): ", llmResponse.content.slice(0, 1000)); // Primeros 1000 caracteres
      console.log("Token count: ", tokenCount);

      // Obtén el sessionId del request (asegúrate de enviarlo desde el frontend)
      

     

      
      
      // Justo antes de la llamada al LLM:
      const ecuTotalPrompt = `
        ${systemPrompt}
        ${validatedBody.message}
      `;

      // Cuenta los tokens del prompt completo
      const ecuTokenCount = encode(ecuTotalPrompt).length;   

      const ecuLlMResponse = await llmServiceManager.generateText(
        {
          prompt: `
            ${validatedBody.message}          
          `,
          systemPrompt,
          model: MODEL,
        },
        PROVIDER
      );

      let llmContent = ecuLlMResponse.content.trim();
      if (llmContent.startsWith("```json")) {
        llmContent = llmContent.replace(/^```json/, "").replace(/```$/, "").trim();
      }
      let llmJson;
      try {
        llmJson = JSON.parse(llmContent);
      } catch (e) {
        llmJson = {
          client_response: "Hubo un error procesando la respuesta del agente.",
          ecu: {},
          actions: []
        };
      }

      // Actualiza el ECU con los campos recibidos
      if (llmJson.ecu) {
        if (llmJson.ecu.case_facts) ecu.cognitive_vectors.case_facts = llmJson.ecu.case_facts;
        if (llmJson.ecu.client_profile) ecu.cognitive_vectors.client_profile = llmJson.ecu.client_profile;
        if (llmJson.ecu.current_hypothesis) ecu.cognitive_vectors.current_hypothesis = llmJson.ecu.current_hypothesis;
        if (llmJson.ecu.session_status) ecu.cognitive_vectors.session_status = llmJson.ecu.session_status;
      }

      const ecuMessageNumber = ecu.cognitive_vectors.dialogue_history.turns.length + 1;
      const newTurn: DialogueTurn = {
        messageNumber: ecuMessageNumber,
        user: validatedBody.message,
        llm: ecuLlMResponse.content,
        timestamp: new Date().toISOString(),
      };
      ecu.cognitive_vectors.dialogue_history.turns.push(newTurn);
      ecu.metadata.updatedAt = new Date().toISOString();
      saveECU(sessionId, ecu);

      // Solo envía la respuesta para el cliente
      return c.json({
        success: true,
        response: llmJson.client_response,
        ecu: llmJson.ecu,
        actions: llmJson.actions,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error in talkWithTomasPraefatio:", error);

      // Check if it's a JSON parse error
      if (error instanceof SyntaxError && error.message.includes("JSON")) {
        return c.json(
          {
            success: false,
            error: "Invalid JSON: The request body must be valid JSON.",
          },
          400
        );
      }

      // Check if it's an LLM service error
      if (
        error instanceof Error &&
        (error.message?.includes("LLM") ||
          error.message?.includes("generateText"))
      ) {
        const response: JustTalkWithLLMResponse = {
          success: true,
          response: `LLM has received your message. This is the start of the discovery phase. (Fallback response - LLM service not available)`,
          timestamp: new Date().toISOString(),
        };

        return c.json(response);
      }

      return c.json(
        {
          success: false,
          error: "Internal server error",
        },
        500
      );
    }
  },
};

function loadECU(sessionId: string): ECU | null {
  const path = join(ECU_DIR, `ecu-session-${sessionId}.json`);
  if (!existsSync(path)) return null;
  const data = readFileSync(path, "utf-8");
  return JSON.parse(data) as ECU;
}

function saveECU(sessionId: string, ecu: ECU) {
  if (!existsSync(ECU_DIR)) mkdirSync(ECU_DIR, { recursive: true });
  const path = join(ECU_DIR, `ecu-session-${sessionId}.json`);
  writeFileSync(path, JSON.stringify(ecu, null, 2), "utf-8");
}
