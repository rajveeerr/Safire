import type { JwtPayload } from "types";

export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as JwtPayload;
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  };
  
  export const getStoredToken = (): string | null => {
    return localStorage.getItem('authToken');
  };
  
  export const setToken = (token: string): void => {
    localStorage.setItem('authToken', token);
  };
  
  export const removeToken = (): void => {
    localStorage.removeItem('authToken');
  };
  