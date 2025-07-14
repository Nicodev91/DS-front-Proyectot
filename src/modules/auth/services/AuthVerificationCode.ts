// Tipos para verificación de código OTP
export interface VerificationRequest {
  email: string;
  code: string;
}

export interface VerificationResponse {
  success: boolean;
  message?: string;
  isValid?: boolean;
  error?: string;
}

// Configuración
import { getApiBaseUrl } from '../../../shared/utils/config';
const API_URL = getApiBaseUrl();

// Servicio para verificación de código OTP
class VerificationCodeService {
  async verifyOTP(email: string, code: string): Promise<VerificationResponse> {
    try {
      const response = await fetch(`${API_URL}/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return { 
          success: true, 
          message: 'Código verificado exitosamente',
          isValid: data.isValid
        };
      } else {
        return { 
          success: false, 
          error: data.message || 'Código inválido'
        };
      }
    } catch (error: unknown) {
      console.error('OTP verification error:', error);
      return { 
        success: false, 
        error: 'Error de conexión con el servidor'
      };
    }
  }

  // Función para validar formato del código (opcional)
  validateCodeFormat(code: string): boolean {
    return /^\d{4,6}$/.test(code);
  }
}

// Exportar instancia
export default new VerificationCodeService();