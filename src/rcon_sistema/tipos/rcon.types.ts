export interface RespostaRcon {
  sucesso: boolean;
  dados?: string;
  erro?: string;
  timestamp: string;
}

export interface ComandoRcon {
  comando: string;
  resposta: string;
  timestamp: string;
}

export interface EstadoConexaoRcon {
  conectando: boolean;
  autenticado: boolean;
  ultimoErro: string | null;
  tentativasReconexao: number;
}
