import { config } from "@/config/env";
import { tokenManager } from "@/utils/tokenManager";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    subscriptionPlan: string;
    credits: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface ApiError {
  status: number;
  message: string;
  data?: any;
}

const handleApiError = async (response: Response): Promise<never> => {
  let errorMessage = `Error ${response.status}`;
  let errorData;

  try {
    errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
  } catch {
    // If response is not JSON, try to get text
    try {
      const text = await response.text();
      errorMessage = text || errorMessage;
    } catch {
      // If we can't get text either, use default message
    }
  }

  const error: ApiError = {
    status: response.status,
    message: errorMessage,
    data: errorData,
  };

  console.error(`API Error: ${errorMessage}`, error);
  throw error;
};

export const authApi = {
  // Register a new user
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const data = await response.json();
      tokenManager.setTokens(data.accessToken, data.refreshToken);
      console.log("Register response:", data);
      return data;
    } catch (error) {
      console.error("Error in register:", error);
      throw error;
    }
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const data = await response.json();
      tokenManager.setTokens(data.accessToken, data.refreshToken);
      return data;
    } catch (error) {
      console.error("Error in login:", error);
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenManager.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      tokenManager.clearTokens();
    } catch (error) {
      console.error("Error in logout:", error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<AuthResponse["user"]> => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenManager.getAccessToken()}`,
        },
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const data = await response.json();
      console.log("Current user response:", data);
      return data;
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      throw error;
    }
  },

  // Refresh access token
  refreshToken: async (): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenManager.getRefreshToken()}`,
        },
      });

      if (!response.ok) {
        return handleApiError(response);
      }

      const data = await response.json();
      tokenManager.setTokens(data.accessToken, data.refreshToken);
      console.log("Token refresh response:", data);
      return data;
    } catch (error) {
      console.error("Error in refreshToken:", error);
      throw error;
    }
  },
};
