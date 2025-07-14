// Tipos para recuperación de contraseña
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  email?: string;
  expiresIn?: number;
  error?: string;
}


import apiService from '../../../shared/services/api';

class ForgotPasswordService {
  async sendOTP(email: string): Promise<ForgotPasswordResponse> {
    try {
      const response = await apiService.post('/otp/send', { email });
      
      if (response.status === 200 && response.data) {
        return { 
          success: true, 
          message: 'Código de verificación enviado exitosamente', 
          email: (response.data as { email?: string }).email || email,
          expiresIn: (response.data as { expiresIn?: number }).expiresIn || 300
        };
      } else {
        return { 
          success: false, 
          error: response.error || 'Error al enviar el código OTP'
        };
      }
    } catch {
      return { 
        success: false, 
        error: 'Error de conexión con el servidor'
      };
    }
  }

  async verifyEmail(email: string): Promise<boolean> {
    try {
      const response = await this.sendOTP(email);
      return response.success;
    } catch {
      return false;
    }
  }
}

export default new ForgotPasswordService();