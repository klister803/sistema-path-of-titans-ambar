import { PonteRcon } from './ponte_rcon';
import { RespostaRcon } from '../tipos/rcon';
import { tentarNovamente } from '../utils/tentativas';
import axios from 'axios';

export class ServicoRcon {
  private static ponteRcon: PonteRcon | null = null;
  private static tentativasReconexao = 0;
  private static readonly MAX_TENTATIVAS = 3;
  private static readonly RCON_API_URL = 'http://localhost:8000/rcon';

  private static obterPonte(): PonteRcon {
    if (!this.ponteRcon) {
      this.ponteRcon = PonteRcon.obterInstancia();
    }
    return this.ponteRcon;
  }

  static async enviarComando(comando: string): Promise<RespostaRcon> {
    console.log('ServicoRcon: Iniciando envio de comando:', comando);
    try {
      const resposta = await tentarNovamente(
        async () => {
          console.log('ServicoRcon: Obtendo ponte RCON...');
          const ponte = this.obterPonte();
          console.log('ServicoRcon: Enviando comando através da ponte...');
          const apiResponse = await ponte.enviarComando(comando);
          console.log('ServicoRcon: Resposta da API:', apiResponse);
          return apiResponse;
        },
        {
          maxTentativas: this.MAX_TENTATIVAS,
          aoErro: async (erro) => {
            console.error('ServicoRcon: Erro na tentativa', this.tentativasReconexao + 1, ':', erro);
            this.tentativasReconexao++;
          }
        }
      );

      console.log('ServicoRcon: Resposta recebida:', resposta);
      return resposta;
    } catch (erro) {
      console.error('ServicoRcon: Erro fatal:', erro);
      return {
        sucesso: false,
        erro: erro instanceof Error ? erro.message : 'Falha na comunicação com servidor',
        timestamp: new Date().toISOString()
      };
    }
  }

  static async enviarCodigoVerificacao(usuario: string, codigo: string): Promise<void> {
    const comando = `whisper ${usuario} Seu código de verificação é: ${codigo}`;
    const resposta = await this.enviarComando(comando);
    if (!resposta.sucesso) {
      throw new Error(resposta.erro || 'Falha ao enviar código de verificação');
    }
  }

  static async verificarUsuarioExiste(usuario: string): Promise<boolean> {
    try {
      const command = `whisper ${usuario} Verificando se você existe`;
      const response = await axios.post(`${this.RCON_API_URL}/whisper`, { command });
      console.log('ServicoRcon: Resposta da API para verificar usuário:', response.data);
      if (!response.data.success) return false;
      return !response.data.response?.includes('não encontrado');
    } catch (erro) {
      console.error('Erro ao verificar usuário:', erro);
      return false;
    }
  }

  static gerarCodigoVerificacao(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}
