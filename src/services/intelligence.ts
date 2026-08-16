import { invoke } from "@tauri-apps/api/core";
import { InvokeResponse } from "@/models/response";
import { responseHandler } from "@/utils/response";

const isTauri = typeof window !== "undefined" && "__TAURI__" in window;

export interface TestConnectionResponse {
  success: boolean;
  message: string;
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
}
