export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OWNER = 'OWNER',
  STUDENT = 'STUDENT',
}

export enum StudentStatus {
  REGISTERED = 'REGISTERED',
  IN_CART = 'IN_CART',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  dni?: string | null;
  role: Role;
  studentStatus: StudentStatus;
  authProvider: AuthProvider;
  googleId?: string | null;
  birthDate?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
