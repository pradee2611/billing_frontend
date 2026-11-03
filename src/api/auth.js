const KEY = "billing-token";

// localStorage can throw (private windows, blocked storage); the app then just asks for a login each visit.
export const getToken = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    localStorage.setItem(KEY, token);
  } catch {
    /* ignore */
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
};

export const AUTH_EXPIRED = "auth-expired";
