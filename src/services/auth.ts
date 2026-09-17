import { AuthUser, LoginCredentials, RegisterData, UserRole } from '../types';

const TOKEN_STORAGE_KEY = 'juniorroles_auth_token';
const USER_STORAGE_KEY = 'juniorroles_auth_user';

export class AuthService {
  private static token: string | null = null;
  private static currentUser: AuthUser | null = null;

  public static initialize(): { token: string | null; user: AuthUser | null } {
    try {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedToken && storedUser) {
        this.token = storedToken;
        this.currentUser = JSON.parse(storedUser);
      }
    } catch {
      // Storage unavailable or corrupted
      this.clearSession();
    }
    return { token: this.token, user: this.currentUser };
  }

  public static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return this.token;
  }

  public static getCurrentUser(): AuthUser | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        try {
          this.currentUser = JSON.parse(stored);
        } catch {
          this.currentUser = null;
        }
      }
    }
    return this.currentUser;
  }

  public static async login(credentials: LoginCredentials): Promise<{ user: AuthUser; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed. Please check your credentials.');
    }

    this.saveSession(data.token, data.user);
    return { user: data.user, token: data.token };
  }

  public static async register(userData: RegisterData): Promise<{ user: AuthUser; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed. Please check your inputs.');
    }

    this.saveSession(data.token, data.user);
    return { user: data.user, token: data.token };
  }

  public static async fetchCurrentUser(): Promise<AuthUser | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        this.clearSession();
        return null;
      }
      const data = await res.json();
      this.currentUser = data.user;
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      return data.user;
    } catch {
      return this.getCurrentUser();
    }
  }

  public static async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch {
      // ignore network failure on logout
    } finally {
      this.clearSession();
    }
  }

  public static saveSession(token: string, user: AuthUser) {
    this.token = token;
    this.currentUser = user;
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save session to localStorage', e);
    }
  }

  public static clearSession() {
    this.token = null;
    this.currentUser = null;
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}
