import { apiRequest } from "@/lib/queryClient";
import { ConvertCodeRequest, ConvertCodeResponse } from "@shared/schema";

export async function convertCode(
  request: ConvertCodeRequest
): Promise<ConvertCodeResponse> {
  const response = await apiRequest("POST", "/api/convert", request);
  return await response.json();
}