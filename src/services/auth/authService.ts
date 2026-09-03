import { User } from '../../types';

export interface AuthSession {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export class AuthService {
  private activeSession: AuthSession = {
    user: null,
    token: null,
    isAuthenticated: false,
  };

  private generatedOtps: Map<string, { code: string; expiresAt: number }> = new Map();

  async requestOTP(phone: string): Promise<{ success: boolean; message: string; testCode?: string }> {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, message: 'Please enter a valid phone number.' };
    }

    // Generate 4-digit OTP (1234 for easy demonstration, valid for 2 minutes)
    const code = '1234';
    const expiresAt = Date.now() + 2 * 60 * 1000;
    this.generatedOtps.set(cleanPhone, { code, expiresAt });

    return {
      success: true,
      message: `OTP sent successfully to ${cleanPhone}. (Demo Code: 1234)`,
      testCode: code,
    };
  }

  async verifyOTP(phone: string, inputCode: string): Promise<{ success: boolean; user?: User; token?: string; message: string }> {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const entry = this.generatedOtps.get(cleanPhone);

    // Allow demo code '1234' for seamless showcase
    if (inputCode === '1234' || (entry && entry.code === inputCode && entry.expiresAt > Date.now())) {
      const user: User = {
        id: 'usr-' + Date.now().toString().slice(-6),
        name: 'Ummah Brother',
        phone: cleanPhone,
        role: 'customer',
        savedAddresses: [
          {
            fullName: 'Ummah Brother',
            phone: cleanPhone,
            address: 'House 12, Road 4, Sector 3, Uttara',
            city: 'Dhaka',
            zone: 'inside_dhaka',
          },
        ],
      };

      const token = 'jwt_mock_session_' + Date.now();
      this.activeSession = { user, token, isAuthenticated: true };
      return { success: true, user, token, message: 'Login successful!' };
    }

    if (entry && entry.expiresAt <= Date.now()) {
      return { success: false, message: 'OTP has expired. Please request a new one.' };
    }

    return { success: false, message: 'Invalid OTP code. Please enter 1234 for demo.' };
  }

  async loginWithGoogle(): Promise<{ success: boolean; user: User; token: string }> {
    const user: User = {
      id: 'usr-google-' + Date.now().toString().slice(-4),
      name: 'Abdullah Al-Mamun',
      email: 'abdullah.mamun@gmail.com',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      savedAddresses: [
        {
          fullName: 'Abdullah Al-Mamun',
          phone: '01901165090',
          address: 'Plot 15, Block C, Banani',
          city: 'Dhaka',
          zone: 'inside_dhaka',
        },
      ],
    };

    const token = 'google_oauth_token_' + Date.now();
    this.activeSession = { user, token, isAuthenticated: true };
    return { success: true, user, token };
  }

  async loginWithFacebook(): Promise<{ success: boolean; user: User; token: string }> {
    const user: User = {
      id: 'usr-fb-' + Date.now().toString().slice(-4),
      name: 'Zubair Hossain',
      email: 'zubair.hossain@facebook.com',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      savedAddresses: [],
    };

    const token = 'fb_oauth_token_' + Date.now();
    this.activeSession = { user, token, isAuthenticated: true };
    return { success: true, user, token };
  }

  async loginAsAdmin(): Promise<{ success: boolean; user: User; token: string }> {
    const user: User = {
      id: 'admin-001',
      name: 'OUBD Store Manager',
      email: 'admin@oneummahbd.shop',
      phone: '+8801901165090',
      role: 'admin',
      savedAddresses: [],
    };

    const token = 'admin_jwt_secret_token_' + Date.now();
    this.activeSession = { user, token, isAuthenticated: true };
    return { success: true, user, token };
  }

  logout(): void {
    this.activeSession = {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }

  getSession(): AuthSession {
    return this.activeSession;
  }
}

export const authService = new AuthService();
