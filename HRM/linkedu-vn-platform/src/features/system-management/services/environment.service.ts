export class EnvironmentService {
  // Cloverly POS API configuration
  baseUrl: string;
  apiKey: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;

  // Feature flags
  enableAnalytics: boolean;
  enableDebugMode: boolean;
  maxConnectionRetries: number;

  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.apiKey = 'your-api-key-here';
    this.timeout = 5000;
    this.retryAttempts = 3;
    this.retryDelay = 1000;
    this.enableAnalytics = true;
    this.enableDebugMode = false;
    this.maxConnectionRetries = 5;
  }

  // Add your configuration methods here
  // For example: getApiEndpoint(), validateConfiguration(), etc.
}

export const environmentService = new EnvironmentService();
