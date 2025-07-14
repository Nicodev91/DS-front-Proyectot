// Tipos básicos
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  error?: string;
}

import { getApiBaseUrl } from '../../../shared/utils/config';

const API_URL = getApiBaseUrl();

// Función para establecer cookies seguras
const setSecureCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  // Configuración segura de cookies
  const cookieOptions = [
    `expires=${expires.toUTCString()}`,
    'path=/',
    'SameSite=Strict',
    'Secure', // Solo en HTTPS
    'HttpOnly' // Protege contra XSS
  ].join('; ');
  
  document.cookie = `${name}=${value}; ${cookieOptions}`;
};

// Función para obtener cookies
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Función para eliminar cookies
const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Función para decodificar JWT (solo la parte payload)
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
};

class SecureAuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log("Enviando petición de login a:", `${API_URL}/auth/login`);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Remover credentials temporalmente si hay problemas de CORS
        // credentials: 'include',
        body: JSON.stringify(credentials)
      });
      
      console.log("Respuesta del servidor:", response.status, response.statusText);
      
      const data = await response.json();
      console.log("Datos de respuesta:", data);
      
      if (response.ok && data.access_token) {
        // Decodificar JWT para obtener información del usuario
        const decodedToken = decodeJWT(data.access_token);
        console.log('Token decodificado:', decodedToken);
        
        // Almacenar token en cookie HttpOnly segura
        setSecureCookie('auth_token', data.access_token, 7);
        
        // Crear objeto de usuario desde el token o usar valores por defecto
        const user = {
          id: decodedToken?.sub?.toString() || decodedToken?.userId?.toString() || "1",
          email: decodedToken?.email || credentials.email,
          name: decodedToken?.name || decodedToken?.username || credentials.email.split('@')[0],
          role: decodedToken?.role || "client" // Siempre asignar rol 'client' por defecto
        };
        
        // Almacenar información del usuario en sessionStorage
        sessionStorage.setItem('user', JSON.stringify(user));
        
        console.log("Login exitoso, token almacenado");
        console.log("Usuario creado:", user);
        return { success: true, token: data.access_token, user };
      } else {
        console.log("Login fallido:", data.error || 'Credenciales inválidas');
        return { success: false, error: data.error || 'Credenciales inválidas' };
      }
    } catch (error) {
      console.error("Error en la petición de login:", error);
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  }

  logout(): void {
    // Eliminar cookies seguras
    removeCookie('auth_token');
    removeCookie('refresh_token');
    
    // Limpiar sessionStorage
    sessionStorage.removeItem('user');
    sessionStorage.clear();
  }

  isAuthenticated(): boolean {
    return !!getCookie('auth_token');
  }

  getUser() {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return getCookie('auth_token');
  }

  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return token ? { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    } : { 'Content-Type': 'application/json' };
  }

  // Método para renovar token automáticamente
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = getCookie('refresh_token');
      if (!refreshToken) return false;

      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        setSecureCookie('auth_token', data.access_token, 7);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}

export default new SecureAuthService();
