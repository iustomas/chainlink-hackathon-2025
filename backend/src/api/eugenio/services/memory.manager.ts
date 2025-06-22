import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

/**
 * MemoryManager: Singleton para cargar y cachear archivos de conocimiento estático (.md)
 */
export class MemoryManager {
  private static instance: MemoryManager;
  private memoryCache: Map<string, string> = new Map();

  private constructor() {
    this.loadAllMemories();
  }

  public static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  /**
   * Carga todos los archivos .md de las carpetas relevantes en memoria al iniciar la app.
   */
  private loadAllMemories() {
    // Puedes agregar aquí más carpetas si tienes más fuentes de memoria
    const memoryDirs = [
      join(__dirname, "../../../../agent/memories"),
      join(__dirname, "../../../../agent/system-prompts"),
    ];

    for (const dir of memoryDirs) {
      if (!existsSync(dir)) continue;
      const files = readdirSync(dir);
      for (const file of files) {
        if (file.endsWith(".md")) {
          const key = `${dir.split("agent/").pop()}/${file}`.replace(/\\/g, "/");
          const content = readFileSync(join(dir, file), "utf-8");
          this.memoryCache.set(key, content);
        }
      }
    }
  }

  /**
   * Obtiene el contenido de memoria cacheado por clave relativa (ej: "memories/personality-tomas-web3.md")
   */
  public read(key: string): string | undefined {
    return this.memoryCache.get(key);
  }
}