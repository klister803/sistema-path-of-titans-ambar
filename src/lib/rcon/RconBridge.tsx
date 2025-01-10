import React, { useEffect, useRef } from 'react';
import { RconResponse } from '../../types/rcon';

declare global {
  interface Window {
    rconClient: any;
  }
}

export class RconBridge {
  private static instance: RconBridge;
  private pyodideReady: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {
    this.initializePyodide();
  }

  static getInstance(): RconBridge {
    if (!RconBridge.instance) {
      RconBridge.instance = new RconBridge();
    }
    return RconBridge.instance;
  }

  private async initializePyodide() {
    if (this.connectionPromise) return this.connectionPromise;

    this.connectionPromise = new Promise(async (resolve) => {
      // Load PyScript
      const script = document.createElement('script');
      script.src = 'https://pyscript.net/latest/pyscript.js';
      script.defer = true;
      document.head.appendChild(script);

      script.onload = async () => {
        await this.loadPythonCode();
        this.pyodideReady = true;
        resolve();
      };
    });

    return this.connectionPromise;
  }

  private async loadPythonCode() {
    const response = await fetch('/src/lib/rcon/rcon_client.py');
    const pythonCode = await response.text();
    
    // Initialize PyScript with our RCON client
    await window.pyodide.runPython(`
      ${pythonCode}
      
      rcon = RconClient('140.238.185.252', 7779, 'Ambar@3')
    `);
  }

  async sendCommand(command: string): Promise<RconResponse> {
    if (!this.pyodideReady) {
      await this.connectionPromise;
    }

    try {
      const result = await window.pyodide.runPython(`
        try:
          if not rcon.authenticated:
            rcon.connect()
          response = rcon.send_command("${command}")
          {"success": True, "data": response}
        except Exception as e:
          {"success": False, "error": str(e)}
      `);

      return {
        ...result,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }
}
