import { APP_CONFIG } from '../../constants/config';

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  success: boolean;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = APP_CONFIG.API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    const json = await response.json();
    return {
      data: json,
      status: response.status,
      success: response.ok,
    };
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();
    return {
      data: json,
      status: response.status,
      success: response.ok,
    };
  }
}

export const apiClient = new ApiClient();
