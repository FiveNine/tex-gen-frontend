
// API base URL - this will be replaced with the production URL later
export const API_BASE_URL = "http://localhost:8000";

// Common fetch options
export const getDefaultOptions = (includeCredentials = true) => {
  const options: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    }
  };
  
  if (includeCredentials) {
    options.credentials = 'include';
  }
  
  return options;
};

// Error handling helper
export const handleApiError = (error: unknown, context: string): never => {
  console.error(`Error ${context}:`, error);
  throw new Error(`Failed to ${context}`);
};
