export interface RespostaRcon {
  dados?: string;
}

export interface ConfiguracaoRcon {
  host: string;
  porta: number;
  senha: string;
  timeout?: number;
  maxTentativas?: number;
}

export interface ComandoRcon {
  comando: string;
  resposta: string;
  timestamp: string;
}
