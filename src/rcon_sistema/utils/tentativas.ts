interface OpcoesTentativa {
  maxTentativas: number;
  aoErro?: (erro: Error) => Promise<void>;
}

export async function tentarNovamente<T>(
  fn: () => Promise<T>,
  opcoes: OpcoesTentativa
): Promise<T> {
  let tentativa = 0;
  
  while (tentativa < opcoes.maxTentativas) {
    try {
      return await fn();
    } catch (erro) {
      tentativa++;
      
      if (tentativa === opcoes.maxTentativas) {
        throw erro;
      }

      if (opcoes.aoErro) {
        await opcoes.aoErro(erro as Error);
      }

      const atraso = Math.min(1000 * Math.pow(2, tentativa), 5000);
      await new Promise(resolve => setTimeout(resolve, atraso));
    }
  }

  throw new Error('Número máximo de tentativas atingido');
}
