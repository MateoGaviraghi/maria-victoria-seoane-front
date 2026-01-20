'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ChangePasswordData,
  LoginCredentials,
  RegisterData,
  UpdateProfileData,
} from '@/types/user';
import { getErrorMessage } from '@/lib/error-handler';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setAuth, updateUser, logout: storeLogout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success('Inicio de sesión exitoso');
      router.push('/cursos');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onSuccess: () => {
      // NO autenticamos al usuario hasta que verifique su email
      toast.success('Cuenta creada exitosamente. Revisa tu email para verificar tu cuenta.');
      router.push('/auth/verify-email');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    enabled: false, // Deshabilitado temporalmente para evitar loops
    retry: false,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (profileData: UpdateProfileData) => authService.updateProfile(profileData),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Perfil actualizado exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (passwordData: ChangePasswordData) => authService.changePassword(passwordData),
    onSuccess: () => {
      toast.success('Contraseña cambiada exitosamente');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: () => authService.resendVerificationEmail(),
    onSuccess: () => {
      toast.success('Email de verificación enviado');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onSuccess: () => {
      toast.success('Email verificado exitosamente');
      router.push('/auth/login');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const requestPasswordResetMutation = useMutation({
    mutationFn: (email: string) => authService.requestPasswordReset(email),
    onSuccess: () => {
      toast.success('Se ha enviado un email con las instrucciones');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authService.resetPassword(token, newPassword),
    onSuccess: () => {
      toast.success('Contraseña restablecida exitosamente');
      router.push('/auth/login');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const logout = () => {
    authService.logout();
    storeLogout();
    queryClient.clear();
    toast.success('Sesión cerrada');
    router.push('/');
  };

  return {
    user,
    profile,
    isLoadingProfile,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
    resendVerification: resendVerificationMutation.mutate,
    isResendingVerification: resendVerificationMutation.isPending,
    verifyEmail: verifyEmailMutation.mutate,
    isVerifyingEmail: verifyEmailMutation.isPending,
    requestPasswordReset: requestPasswordResetMutation.mutate,
    isRequestingPasswordReset: requestPasswordResetMutation.isPending,
    resetPassword: resetPasswordMutation.mutate,
    isResettingPassword: resetPasswordMutation.isPending,
    logout,
  };
};
