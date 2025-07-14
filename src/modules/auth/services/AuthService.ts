import type { User, AuthCredentials, RegisterData, AuthService as IAuthService, AuthTokens } from '../domain/User';
import { getApiBaseUrl } from '../../../shared/utils/config';

const API_URL = getApiBaseUrl();
const TOKEN_KEY = 'datasentinel_access_token';
const REFRESH_TOKEN_KEY = 'datasentinel_refresh_token';
const USER_KEY = 'datasentinel_user';

class AuthService implements IAuthService {
  private currentUser: User | null = null;

  constructor() {
    this.loadUserFromStorage();
  }

  async login(credentials: AuthCredentials): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      const { user, accessToken } = data;

      this.saveTokens({
        accessToken: accessToken,
        refreshToken: ""
      });
      this.saveUser(user);
      this.currentUser = user;

      // Obtener el perfil completo del usuario
      try {
        const fullUser = await this.getProfile();
        return fullUser;
      } catch (error) {
        console.warn('Error al obtener el perfil completo, usando datos del login:', error);
        return user;
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      throw new Error('Error al iniciar sesión');
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      const result = await response.json();
      const { user, accessToken } = result;

      this.saveTokens({
        accessToken: accessToken,
        refreshToken: ""
      });
      this.saveUser(user);
      this.currentUser = user;

      return user;
    } catch (error: unknown) {
      console.error('Registration error:', error);
      throw new Error('Error al registrar usuario');
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
          credentials: 'include',
        });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      this.clearStorage();
      this.currentUser = null;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null && this.getAccessToken() !== null;
  }

  async getProfile(): Promise<User> {
    try {
      const response = await fetch(`${API_URL}/v1/auth/profile`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener el perfil');
      }

      const user = await response.json();
      this.saveUser(user);
      this.currentUser = user;

      return user;
    } catch (error: unknown) {
      console.error('Profile error:', error);
      throw new Error('Error al obtener el perfil del usuario');
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
      });

      if (!response.ok) {
        this.clearStorage();
        return false;
      }

      const { tokens } = await response.json();
      this.saveTokens(tokens);
      return true;
    } catch (error: unknown) {
      console.error('Token refresh error:', error);
      this.clearStorage();
      return false;
    }
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  }

  private getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  private saveTokens(tokens: AuthTokens): void {
    localStorage.setItem(TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  private saveUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private loadUserFromStorage(): void {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      this.clearStorage();
    }
  }

  private clearStorage(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

export const authService = new AuthService();