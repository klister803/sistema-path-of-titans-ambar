import { Rcon } from 'rcon-srcds';
import { RespostaRcon } from '../tipos/rcon.types';
import { tentarNovamente } from '../utils/tentativas';
import { RconLogger } from '../utils/RconLogger';
import { RCON_CONFIG } from '../config/rcon.config';

export class RconCliente {
  private static instancia: RconCliente;
  private rcon: Rcon | null = null;
  private tentativasReconexao = 0;

  private constructor() {}

  static obterInstancia(): RconCliente {
    if (!RconCliente.instancia) {
      RconCliente.instancia = new RconCliente();
    }
    return RconCliente.instancia;
  }

  private async conectar(): Promise<void> {
    if (this.rcon?.authenticated) return;

    try {
      RconLogger.info('Conectando ao servidor RCON...');
      
      this.rcon = new Rcon({
        host: RCON_CONFIG.host,
        port: RCON_CONFIG.port,
        password: RCON_CONFIG.password,
        timeout: RCON_CONFIG.timeout,
      });

      await this.rcon.connect();
      RconLogger.info('Conexão RCON estabelecida');
    } catch (erro) {
      RconLogger.error('Falha na conexão RCON', erro);
      throw erro;
    }
  }

  async enviarComando(comando: string): Promise<RespostaRcon> {
    try {
      await tentarNovamente(
        async () => {
          if (!this.rcon?.authenticated) {
            await this.conectar();
          }
        },
        {
          maxTentativas: RCON_CONFIG.maxReconexoes,
          aoErro: async (erro) => {
            RconLogger.error('Tentativa de conexão falhou', erro);
            this.tentativasReconexao++;
            if (this.rcon) {
              await this.rcon.disconnect();
              this.rcon = null;
            }
          }
        }
      );

      if (!this.rcon?.authenticated) {
        throw new Error('Falha ao estabelecer conexão');
      }

      RconLogger.debug('Enviando comando', { comando });
      const resposta = await this.rcon.execute(comando);
      RconLogger.debug('Resposta do comando', { comando, resposta });

      return {
        sucesso: true,
        dados: resposta,
        timestamp: new Date().toISOString()
      };

    } catch (erro) {
      const mensagemErro = erro instanceof Error ? erro.message : 'Erro desconhecido';
      RconLogger.error('Falha na execução do comando', { comando, erro: mensagemErro });
      
      return {
        sucesso: false,
        erro: mensagemErro,
        timestamp: new Date().toISOString()
      };
    }
  }

  async desconectar(): Promise<void> {
    if (this.rcon) {
      try {
        await this.rcon.disconnect();
      } finally {
        this.rcon = null;
        this.tentativasReconexao = 0;
      }
    }
  }
}
