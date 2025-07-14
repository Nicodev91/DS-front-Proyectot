export interface User {
  id: string;
  email: string;
  name: string;
  rut?: string;
  address?: string;
  phone?: string;
  role: UserRole;
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    offers: boolean;
  };
}

export enum UserRole {
  CLIENT = 'client',
  ADMIN = 'admin'
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  rut?: string;
  address?: string;
  phoneNumber?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthRepository {
  login(credentials: AuthCredentials): Promise<{ user: User; tokens: AuthTokens }>;
  register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }>;
  refreshToken(refreshToken: string): Promise<AuthTokens>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export interface AuthService {
  login(credentials: AuthCredentials): Promise<User>;
  register(data: RegisterData): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
  isAuthenticated(): boolean;
  refreshToken(): Promise<boolean>;
  getAuthHeaders(): Record<string, string>;
  getProfile(): Promise<User>;
}