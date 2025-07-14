/**
 * Environment configuration utility
 * Manages API URLs and environment-specific settings
 */

export interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'production';
  apiTimeout: number;
  apiRetryAttempts: number;
}

/**
 * Get the current environment
 */
const getEnvironment = (): 'development' | 'production' => {
  const env = import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development';
  return env === 'production' ? 'production' : 'development';
};

/**
 * Get the API base URL based on current environment
 */
export const getApiBaseUrl = (): string => {
  const environment = getEnvironment();
  
  if (environment === 'production') {
    return import.meta.env.VITE_API_BASE_URL_PROD || 'https://ds-backend-proyect.vercel.app/';
  }
  
  return import.meta.env.VITE_API_BASE_URL_DEV || 'http://localhost:8091';
};

/**
 * Application configuration object
 */
export const config: AppConfig = {
  apiBaseUrl: getApiBaseUrl(),
  environment: getEnvironment(),
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
  apiRetryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3', 10),
};

/**
 * Helper function to get full API endpoint URL
 */
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = config.apiBaseUrl.endsWith('/') 
    ? config.apiBaseUrl.slice(0, -1) 
    : config.apiBaseUrl;
  
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${baseUrl}${cleanEndpoint}`;
};

/**
 * Development mode check
 */
export const isDevelopment = (): boolean => config.environment === 'development';

/**
 * Production mode check
 */
export const isProduction = (): boolean => config.environment === 'production';