import type { JwtPayload } from "types";

export const isAuthenticated = async (): Promise<boolean> => {
  return new Promise((resolve) => {
      chrome.storage.local.get(['authToken'], (result) => {
          const token = result.authToken;
          // console.log("tokenfoundhere",token);
          if (!token) {
              // console.log('No token found');
              return resolve(false);
          }
          
          try {
              const parts = token.split('.');
              if (parts.length !== 3) {
                  console.error('Invalid token format');
                  return resolve(false);
              }
              
              const payload = JSON.parse(atob(parts[1])) as JwtPayload;
              const isValid = payload.exp > Date.now() / 1000;
              console.log('Token validation:', isValid ? 'valid' : 'expired');
              resolve(isValid);
          } catch (error) {
              console.error('Token validation error:', error);
              resolve(false);
          }
      });
  });
};


export const getToken = async (): Promise<string | null> => {
  return new Promise((resolve) => {
     chrome.storage.local.get(['authToken'], (result) => {
      const token = result.authToken;
      // console.log("tokenfoundhere",token);
      if (!token) {
        // console.log('No token found');
        return resolve(null);
      }
      resolve(token);
    });
  });
};