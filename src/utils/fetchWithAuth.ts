import { tokenManager } from "./tokenManager";
import { authApi } from "@/api/authApi";

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const accessToken = tokenManager.getAccessToken();

  // Add authorization header if we have a token
  const headers = {
    ...options.headers,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  let response = await fetch(url, { ...options, headers });

  // If token expired, try to refresh it and retry the request
  if (response.status === 401 && accessToken) {
    try {
      await authApi.refreshToken();

      // Retry the original request with new token
      const newHeaders = {
        ...options.headers,
        Authorization: `Bearer ${tokenManager.getAccessToken()}`,
      };

      response = await fetch(url, { ...options, headers: newHeaders });
    } catch (error) {
      // If refresh token also failed, clear tokens and throw error
      tokenManager.clearTokens();
      throw error;
    }
  }

  return response;
};
