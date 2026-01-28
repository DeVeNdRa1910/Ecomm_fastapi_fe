/**
 * Cookie utility functions for managing authentication tokens
 */

const TOKEN_KEY = 'auth_token';

interface CookieOptions {
  expires?: number; // Days until expiration
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * Set a cookie with the given name, value, and options
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') return;

  const {
    expires = 7, // Default 7 days
    path = '/',
    domain,
    secure = false,
    sameSite = 'Lax',
  } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (expires) {
    const date = new Date();
    date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  }

  if (path) {
    cookieString += `; path=${path}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += '; secure';
  }

  if (sameSite) {
    cookieString += `; SameSite=${sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      const value = cookie.substring(nameEQ.length);
      return decodeURIComponent(value);
    }
  }

  return null;
}

/**
 * Remove a cookie by name
 */
export function removeCookie(name: string, path: string = '/'): void {
  if (typeof document === 'undefined') return;

  // Set cookie with expiration date in the past
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
}

/**
 * Token management using cookies
 */
export const tokenManager = {
  /**
   * Get the authentication token from cookies
   * @returns The token string or null if not found
   */
  getToken: (): string | null => {
    return getCookie(TOKEN_KEY);
  },

  /**
   * Set the authentication token in cookies
   * @param token - The token to store
   * @param expiresInDays - Number of days until expiration (default: 7)
   */
  setToken: (token: string, expiresInDays: number = 7): void => {
    if (!token || token.trim() === '') {
      return;
    }
    
    setCookie(TOKEN_KEY, token, {
      expires: expiresInDays,
      path: '/',
      secure: false, // Set to false for localhost development, true for production HTTPS
      sameSite: 'Lax',
    });
  },

  /**
   * Remove the authentication token from cookies
   */
  removeToken: (): void => {
    removeCookie(TOKEN_KEY, '/');
  },

  /**
   * Check if a token exists
   * @returns true if token exists, false otherwise
   */
  hasToken: (): boolean => {
    return !!getCookie(TOKEN_KEY);
  },
};

/**
 * Utility function to get the authentication token for protected routes
 * This function can be used in middleware, API routes, or components that need to access the token
 * 
 * @returns The authentication token or null if not found
 * 
 * @example
 * ```ts
 * // In a protected route component
 * const token = getAuthToken();
 * if (!token) {
 *   router.push('/signin');
 * }
 * ```
 * 
 * @example
 * ```ts
 * // In an API call
 * const token = getAuthToken();
 * const response = await fetch('/api/protected', {
 *   headers: {
 *     'Authorization': `Bearer ${token}`
 *   }
 * });
 * ```
 */
export function getAuthToken(): string | null {
  return tokenManager.getToken();
}

