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
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  password?: string;
  is_verified?: boolean;
  created_at?: string;
  updates_at?: string;
  address?: string;
  first_name?: string;
  last_name?: string;
  mobile_number?: string;
  profile_image?: string;
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

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  address?: string;
  first_name?: string;
  last_name?: string;
  mobile_number?: string;
  profile_image?: File | null;
}

export interface UpdateProfileResponse {
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
    return api.get<UserInfo>('/user/me');
  },
  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    const form = new FormData();
    // Only append defined values to avoid overwriting with empty strings unless user provided them.
    if (data.name !== undefined) form.append("name", data.name);
    if (data.email !== undefined) form.append("email", data.email);
    if (data.address !== undefined) form.append("address", data.address);
    if (data.first_name !== undefined) form.append("first_name", data.first_name);
    if (data.last_name !== undefined) form.append("last_name", data.last_name);
    if (data.mobile_number !== undefined) form.append("mobile_number", data.mobile_number);
    // API allows profile_image to be null; sending empty value removes the image.
    if (data.profile_image === null) form.append("profile_image", "");
    if (data.profile_image instanceof File) form.append("profile_image", data.profile_image);

    return api.putForm<UpdateProfileResponse>("/user/me", form);
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

