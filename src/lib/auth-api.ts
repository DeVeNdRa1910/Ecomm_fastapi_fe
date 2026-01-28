import { api } from './api';

export interface RegisterUserRequest {
  name: string;
  email: string;
  role: 'buyer' | 'seller';
  password: string;
}

export interface RegisterUserResponse {
  message: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}
 
export interface VerifyEmailResponse {
  message: string;
}

export interface ResendOtpResponse {
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UserInfo {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface GetForgotPasswordOtpRequest {
  email: string;
}

export interface GetForgotPasswordOtpResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export const authApi = {
  register: async (data: RegisterUserRequest): Promise<RegisterUserResponse> => {
    return api.post<RegisterUserResponse>('/auth/register', data);
  },
  verifyEmail: async (data: VerifyEmailRequest): Promise<VerifyEmailResponse> => {
    return api.post<VerifyEmailResponse>('/auth/verify_email', data);
  },
  resendOtp: async (email: string): Promise<ResendOtpResponse> => {
    // GET request with email as query parameter
    return api.get<ResendOtpResponse>(`/auth/resend_otp?email=${encodeURIComponent(email)}`);
  },
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/login', data);
  },
  getMe: async (): Promise<UserInfo> => {
    return api.get<UserInfo>('/auth/me');
  },
  changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    return api.post<ChangePasswordResponse>('/auth/change-password', data);
  },
  getForgotPasswordOtp: async (data: GetForgotPasswordOtpRequest): Promise<GetForgotPasswordOtpResponse> => {
    return api.post<GetForgotPasswordOtpResponse>('/auth/get_forgot_password_otp', data);
  },
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    return api.post<ForgotPasswordResponse>('/auth/forgot-password', data);
  },
};

