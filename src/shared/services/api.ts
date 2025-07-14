import { authService } from '../../modules/auth';
import { getApiBaseUrl } from '../utils/config';

const API_URL = getApiBaseUrl();

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      // Obtener headers de autenticación
      const authHeaders = authService.getAuthHeaders();
      
      // Configurar la petición
      const config: RequestInit = {
        ...options,
        headers: {
          ...authHeaders,
          ...options.headers,
        },
        credentials: 'include', // Incluir cookies automáticamente
      };

      const response = await fetch(`${API_URL}${endpoint}`, config);
      
      // Manejar errores de autenticación
      if (response.status === 401) {
        // Intentar renovar el token
        const refreshed = await authService.refreshToken();
        if (refreshed) {
          // Reintentar la petición original con el nuevo token
          const retryHeaders = authService.getAuthHeaders();
          const retryConfig: RequestInit = {
            ...options,
            headers: {
              ...retryHeaders,
              ...options.headers,
            },
            credentials: 'include',
          };
          
          const retryResponse = await fetch(`${API_URL}${endpoint}`, retryConfig);
          const retryData = await retryResponse.json();
          
          return {
            data: retryData,
            status: retryResponse.status,
          };
        } else {
          // Token no se pudo renovar, redirigir al login
          authService.logout();
          window.location.href = '/login';
          return {
            error: 'Sesión expirada',
            status: 401,
          };
        }
      }

      const data = await response.json();
      
      return {
        data,
        status: response.status,
      };
    } catch (error: unknown) {
      console.error('API request failed:', error);
      return {
        error: 'Error de conexión',
        status: 500,
      };
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

export default new ApiService();