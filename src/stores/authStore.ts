import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthService } from '../lib/auth';
import { supabase } from '../lib/supabase';
import type { AuthState, User } from '../types/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loginAttempts: 0,
      
      login: async (email: string, password: string) => {
        try {
          const { session } = await AuthService.signIn(email, password);
          if (!session?.user) throw new Error('No user data');
          
          // Reset login attempts on successful login
          await AuthService.resetLoginAttempts(session.user.id);
          
          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            fullName: session.user.user_metadata.full_name,
            username: session.user.user_metadata.username,
            role: session.user.user_metadata.role || 'user',
            isAdmin: session.user.email === 'pedroevil51@gmail.com' || session.user.user_metadata.role === 'admin',
            preferences: session.user.user_metadata.preferences || {},
            activityLog: [],
          };
          
          set({ user, isAuthenticated: true });
        } catch (error) {
          set(state => ({ loginAttempts: state.loginAttempts + 1 }));
          console.error('Login error:', error);
          throw error;
        }
      },
      
      updateProfile: async (data: Partial<User>) => {
        try {
          const { error } = await supabase.auth.updateUser({
            data: {
              full_name: data.fullName,
              preferences: data.preferences,
            },
          });
          
          if (error) throw error;
          
          set(state => ({
            user: state.user ? { ...state.user, ...data } : null,
          }));
        } catch (error) {
          console.error('Update profile error:', error);
          throw error;
        }
      },
      
      logout: async () => {
        try {
          await AuthService.signOut();
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Logout error:', error);
          throw error;
        }
      },
      
      resetPassword: async (email: string) => {
        await AuthService.resetPassword(email);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loginAttempts: state.loginAttempts,
      }),
    }
  )
);
