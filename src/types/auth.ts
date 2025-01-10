import { z } from 'zod';
import { loginSchema, registerSchema } from '../lib/validations/auth';

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginAttempts: number;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  role: 'user' | 'admin';
  isAdmin: boolean;
  preferences: Record<string, unknown>;
  activityLog: Array<{
    type: string;
    timestamp: string;
    details: Record<string, unknown>;
  }>;
}
