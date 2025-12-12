
export class ApiService {
  private static instance: ApiService;
  private apiHost: string;

  private constructor() {
    this.apiHost = import.meta.env.PUBLIC_API_HOST;
    if (!this.apiHost) {
      console.warn("PUBLIC_API_HOST is not defined in environment variables.");
    }
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  public getApiHost(): string {
    return this.apiHost;
  }

  // Placeholder for future methods
  public async post(endpoint: string, data: any): Promise<any> {
     // TODO: Implement actual POST request logic
     console.log(`POST to ${this.apiHost}${endpoint} with data:`, data);
     return Promise.resolve({ success: true, fake: true });
  }
}

export const apiService = ApiService.getInstance();
