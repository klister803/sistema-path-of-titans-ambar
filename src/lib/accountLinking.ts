import { supabase } from './supabase';
import { ServicoRcon } from '../sistema_rcon/servico_rcon';

export class AccountLinkingService {
  static async checkExistingLink(gameUsername: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('account_links')
      .select('id')
      .eq('game_username', gameUsername)
      .eq('verified', true)
      .single();

    if (error) {
      console.error('Error checking existing link:', error);
      return false;
    }

    return !!data;
  }

  static async createLinkingAttempt(userId: string, gameUsername: string): Promise<string> {
    // Verificar se a conta já está vinculada
    const isLinked = await this.checkExistingLink(gameUsername);
    if (isLinked) {
      throw new Error('Esta conta do jogo já está vinculada a outro usuário');
    }

    const code = ServicoRcon.gerarCodigoVerificacao();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const { error } = await supabase
      .from('linking_attempts')
      .insert({
        user_id: userId,
        game_username: gameUsername,
        verification_code: code,
        expires_at: expiresAt.toISOString(),
      });

    if (error) throw error;

    try {
      await ServicoRcon.enviarCodigoVerificacao(gameUsername, code);
      return code;
    } catch (error) {
      // Log the error but don't throw it, as the attempt was created
      console.error('Error sending verification code:', error);
      return code; // Return the code even if sending fails
    }
  }

  static async verifyAndLink(
    userId: string,
    gameUsername: string,
    code: string
  ): Promise<void> {
    // Verificar tentativa existente
    const { data: attempt, error } = await supabase
      .from('linking_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('game_username', gameUsername)
      .eq('verification_code', code)
      .eq('status', 'pending')
      .single();

    if (error || !attempt) {
      throw new Error('Código inválido ou expirado');
    }

    if (new Date(attempt.expires_at) < new Date()) {
      throw new Error('Código expirado');
    }

    if (attempt.attempts >= 3) {
      throw new Error('Número máximo de tentativas excedido');
    }

    // Criar vínculo
    const { error: linkError } = await supabase
      .from('account_links')
      .insert({
        user_id: userId,
        game_username: gameUsername,
        verified: true,
        verified_at: new Date().toISOString(),
      });

    if (linkError) {
      if (linkError.code === '23505') { // Unique constraint violation
        throw new Error('Esta conta já está vinculada');
      }
      throw linkError;
    }

    // Atualizar status da tentativa
    await supabase
      .from('linking_attempts')
      .update({ status: 'completed' })
      .eq('id', attempt.id);
  }
}
