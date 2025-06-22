import { ECU } from "../types/ecu.types.js";
import { JustTalkWithLLMResponse } from "../types/eugenio.types.js";
import { ecuRepository } from "./ecu.repository.js"; 
import { PromptBuilder } from "./prompt.builder.js";
import { llmServiceManager } from "../../../services/llm/llm.service.js";
import { PROVIDERS, MODELS } from "../../../services/llm/llm.constants.js";
import { MemoryManager } from "./memory.manager.js";

// Instancia única de MemoryManager (debe inicializarse al arrancar la app)
const memoryManager = MemoryManager.getInstance();
const promptBuilder = PromptBuilder.getInstance(memoryManager);

export const ecuService = {
  /**
   * Orquesta el ciclo de vida de un turno de conversación.
   * @param sessionId string
   * @param userMessage string
   * @returns Promise<JustTalkWithLLMResponse>
   */
  async processTurn(sessionId: string, userMessage: string): Promise<JustTalkWithLLMResponse> {
    // 1. Cargar o crear el ECU de la sesión
    let ecu = await ecuRepository.loadECU(sessionId);
    if (!ecu) {
      ecu = ecuRepository.createNewECU(sessionId);
    }

    // 2. Construir el prompt usando PromptBuilder
    const taskType = "praefatio-interactive-ecu"; // O el que corresponda según tu lógica
    const systemPrompt = promptBuilder.build(taskType, ecu);

    // 3. Llamar al LLM
    const llmResponse = await llmServiceManager.generateText(
      {
        prompt: userMessage,
        systemPrompt,
        model: MODELS.GEMINI_2_5_FLASH_PREVIEW_05_20, // Ajusta según tu modelo
      },
      PROVIDERS.GEMINI // Ajusta según tu provider
    );

    // 4. Parsear y validar la respuesta del LLM
    let llmJson;
    let llmContent = llmResponse.content.trim();
    if (llmContent.startsWith("```json")) {
      llmContent = llmContent.replace(/^```json/, "").replace(/```$/, "").trim();
    }
    try {
      llmJson = JSON.parse(llmContent);
    } catch (e) {
      llmJson = {
        client_response: "Hubo un error procesando la respuesta del agente.",
        ecu: {},
        actions: []
      };
    }

    // 5. Actualizar el ECU con la nueva información recibida
    if (llmJson.ecu) {
      if (llmJson.ecu.case_facts) ecu.cognitive_vectors.case_facts = llmJson.ecu.case_facts;
      if (llmJson.ecu.client_profile) ecu.cognitive_vectors.client_profile = llmJson.ecu.client_profile;
      if (llmJson.ecu.current_hypothesis) ecu.cognitive_vectors.current_hypothesis = llmJson.ecu.current_hypothesis;
      if (llmJson.ecu.session_status) ecu.cognitive_vectors.session_status = llmJson.ecu.session_status;
    }

    // 6. Guardar el turno en el historial del ECU
    ecu.cognitive_vectors.dialogue_history.turns.push({
      messageNumber: ecu.cognitive_vectors.dialogue_history.turns.length + 1,
      user: userMessage,
      llm: llmResponse.content,
      timestamp: new Date().toISOString(),
    });
    ecu.metadata.updatedAt = new Date().toISOString();

    // 7. Guardar el nuevo estado del ECU
    await ecuRepository.saveECU(sessionId, ecu);

    // 8. Preparar y devolver la respuesta para el Controller
    return {
      success: true,
      response: llmJson.client_response,
      ecu: llmJson.ecu,
      actions: llmJson.actions,
      timestamp: new Date().toISOString(),
    };
  }
};