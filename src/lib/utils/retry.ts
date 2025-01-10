interface RetryOptions {
  maxAttempts: number;
  onError?: (error: Error) => Promise<void>;
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let attempt = 0;
  
  while (attempt < options.maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      
      if (attempt === options.maxAttempts) {
        throw error;
      }

      if (options.onError) {
        await options.onError(error as Error);
      }

      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retry attempts reached');
}
