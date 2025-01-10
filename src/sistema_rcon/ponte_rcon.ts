import { RespostaRcon } from '../tipos/rcon';

declare global {
  interface Window {
    pyodide: any;
  }
}

export class PonteRcon {
  private static instancia: PonteRcon;
  private pyodidePronto: boolean = false;
  private promessaConexao: Promise<void> | null = null;

  private constructor() {
    this.inicializarPyodide();
  }

  static obterInstancia(): PonteRcon {
    if (!PonteRcon.instancia) {
      PonteRcon.instancia = new PonteRcon();
    }
    return PonteRcon.instancia;
  }

  private async inicializarPyodide() {
    if (this.promessaConexao) return this.promessaConexao;

    this.promessaConexao = new Promise(async (resolve) => {
      const verificarPyodide = setInterval(() => {
        if (window.pyodide) {
          clearInterval(verificarPyodide);
          this.configurarClienteRcon().then(resolve);
        }
      }, 100);
    });

    return this.promessaConexao;
  }

  private async configurarClienteRcon() {
    await window.pyodide.runPython(`
      import micropip
      await micropip.install('mcrcon')
      from mcrcon import MCRcon
      
      def criar_conexao():
          return MCRcon('140.238.185.252', 'Ambar@3', 7779)

      def enviar_comando_rcon(comando):
          try:
              with criar_conexao() as mcr:
                  resposta = mcr.command(comando)
                  return {
                      "sucesso": True,
                      "dados": resposta,
                      "erro": None
                  }
          except Exception as e:
              return {
                  "sucesso": False,
                  "dados": None,
                  "erro": str(e)
              }
    `);

    this.pyodidePronto = true;
  }

  async enviarComando(comando: string): Promise<RespostaRcon> {
    if (!this.pyodidePronto) {
      await this.promessaConexao;
    }

    try {
      const resultado = await window.pyodide.runPython(`
        try:
          enviar_comando_rcon("${comando}")
        except Exception as e:
          {"dados": str(e)}
      `);

      console.log('Resultado do comando:', resultado);
      return resultado;
    } catch (erro) {
      console.error('Erro ao executar comando:', erro);
      return {
        dados: erro instanceof Error ? erro.message : 'Erro desconhecido'
      };
    }
  }
}
