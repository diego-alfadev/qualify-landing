import type { UserSignupPayload } from '../types/api';

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

  /**
   * Registers a new user/agency.
   * @param payload Strict API payload
   */
  public async signup(payload: UserSignupPayload): Promise<any> {
    // Filter empty tracking info to keep payload clean
    const cleanTracking = Object.fromEntries(
      Object.entries(payload.tracking_info).filter(([_, v]) => v != null && v !== '')
    );

    const finalPayload = {
      ...payload,
      tracking_info: cleanTracking
    };

    console.log('🚀 [API] Signup Request:', JSON.stringify(finalPayload, null, 2));

    return this.post('/api/v1/auth/signup', finalPayload);
  }

  private async post(endpoint: string, data: any): Promise<any> {
     // Simulation of API call
     // In a real scenario:
     // const response = await fetch(`${this.apiHost}${endpoint}`, {
     //   method: 'POST',
     //   headers: { 'Content-Type': 'application/json' },
     //   body: JSON.stringify(data)
     // });
     // return response.json();

     await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency
     return Promise.resolve({ success: true, message: "User registered successfully (Mock)" });
  }
}

export const apiService = ApiService.getInstance();
