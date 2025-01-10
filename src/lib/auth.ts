import { supabase } from './supabase';
import { AuthError } from '@supabase/supabase-js';

export class AuthService {
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  }

  static async signUp(email: string, password: string, username: string) {
    console.log('Starting signup process...');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    
    if (error) {
      console.error('Signup error:', error);
      if (error.message.includes('Password should be')) {
        throw new Error('weak_password');
      }
      throw error;
    }
    console.log('Signup successful');
    return data;
  }

  static async signOut() {
    console.log('Starting signout process...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Signout error:', error);
      throw error;
    }
    console.log('Signout successful');
  }

  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
  }

  static async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) throw error;
  }

  static async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  static async resetLoginAttempts(userId: string) {
    const { error } = await supabase.rpc('reset_failed_login_attempts', {
      user_id: userId
    });
    
    if (error) throw error;
  }
}
