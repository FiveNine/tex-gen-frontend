let accessToken: string | null = null;
let refreshToken: string | null = null;

export const tokenManager = {
  setTokens: (newAccessToken: string, newRefreshToken: string) => {
    accessToken = newAccessToken;
    refreshToken = newRefreshToken;
  },

  clearTokens: () => {
    accessToken = null;
    refreshToken = null;
  },

  getAccessToken: () => accessToken,
  getRefreshToken: () => refreshToken,

  isAuthenticated: () => !!accessToken,
};
