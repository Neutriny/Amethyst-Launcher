import { invoke } from "@tauri-apps/api/core";
import { InvokeResponse } from "@/models/response";
import { responseHandler } from "@/utils/response";

const isTauri = typeof window !== "undefined" && "__TAURI__" in window;

export interface TestConnectionResponse {
  success: boolean;
  message: string;
}

export interface AnalyzeLogResponse {
  success: boolean;
  analysis: string;
  error?: string;
}

/**
 * Service class for intelligence features.
 */
export class IntelligenceService {
  /**
   * TEST the connection to the configured LLM API.
   * @returns {Promise<InvokeResponse<TestConnectionResponse>>} The test result.
   */
  @responseHandler("intelligence")
  static async testLLMConnection(): Promise<
    InvokeResponse<TestConnectionResponse>
  > {
    return await invoke("test_llm_connection");
  }

  /**
   * ANALYZE game log using configured LLM.
   * @param {string} logContent - The game log content to analyze.
   * @returns {Promise<InvokeResponse<AnalyzeLogResponse>>} The analysis result.
   */
  @responseHandler("intelligence")
  static async analyzeGameLog(
    logContent: string
  ): Promise<InvokeResponse<AnalyzeLogResponse>> {
    return await invoke("analyze_game_log", { logContent });
  }
}
