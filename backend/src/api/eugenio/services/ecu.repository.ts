import { ECU } from "../types/ecu.types.js";
import { join } from "path";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";

// Directorio donde se guardan los ECUs
const ECU_DIR = join(__dirname, "../../../../agent/ecu-sessions");

export const ecuRepository = {
  /**
   * Carga el ECU de una sesión desde disco.
   * @param sessionId string
   * @returns ECU | null
   */
  loadECU(sessionId: string): ECU | null {
    const filePath = join(ECU_DIR, `ecu-session-${sessionId}.json`);
    if (!existsSync(filePath)) return null;
    const data = readFileSync(filePath, "utf-8");
    return JSON.parse(data) as ECU;
  },

  /**
   * Guarda el ECU de una sesión en disco.
   * @param sessionId string
   * @param ecu ECU
   */
  saveECU(sessionId: string, ecu: ECU): void {
    if (!existsSync(ECU_DIR)) mkdirSync(ECU_DIR, { recursive: true });
    const filePath = join(ECU_DIR, `ecu-session-${sessionId}.json`);
    writeFileSync(filePath, JSON.stringify(ecu, null, 2), "utf-8");
  },

  /**
   * Crea un nuevo objeto ECU vacío para una sesión.
   * @param sessionId string
   * @returns ECU
   */
  createNewECU(sessionId: string): ECU {
    const now = new Date().toISOString();
    return {
      metadata: {
        sessionId,
        createdAt: now,
        updatedAt: now,
      },
      cognitive_vectors: {
        case_facts: { facts: [], summary: "" },
        client_profile: { name: "", email: "", preferences: {} },
        dialogue_history: { turns: [] },
        current_hypothesis: { hypothesis: "", confidence: 0 },
        session_status: { status: "active", lastAction: "" },
      },
    };
  }
};