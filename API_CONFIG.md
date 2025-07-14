# Configuración de la API y Autenticación (Versión Simplificada)

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración del Backend API
VITE_API_BASE_URL=https://ds-backend-proyect.vercel.app
```

**Nota:** Actualmente el servicio está configurado para usar directamente la URL del backend de Vercel.

## Endpoints del Backend

El servicio de autenticación simplificado necesita los siguientes endpoints:

### POST /v1/auth/login
**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response exitoso:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario",
    "role": "admin"
  }
}
```

**Response de error:**
```json
{
  "success": false,
  "error": "Credenciales inválidas"
}
```

### POST /v1/otp/send
**Body:**
```json
{
  "email": "usuario@ejemplo.com"
}
```

**Response exitoso:**
```json
{
  "message": "OTP code sent successfully",
  "email": "usuario@ejemplo.com",
  "expiresIn": 300
}
```

**Response de error:**
```json
{
  "message": "Email not found"
}
```

### POST /v1/otp/verify
**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "code": "123456"
}
```

**Response exitoso:**
```json
{
  "message": "OTP code verified",
  "isValid": true
}
```

**Response de error:**
```json
{
  "message": "Invalid OTP code"
}
```
**Body:**
```json
{
  "email": "usuario@ejemplo.com"
}
```

**Response exitoso:**
```json
{
  "message": "OTP code sent successfully",
  "email": "usuario@ejemplo.com",
  "expiresIn": 300
}
```

**Response de error:**
```json
{
  "message": "Email not found"
}
```

## Uso del Servicio de Autenticación

### Importar los servicios
```typescript
import authService from '../auth-service/AuthLogin';
import forgotPasswordService from '../auth-service/AuthForgotPass';
import verificationService from '../auth-service/AuthVerificationCode';
```

### Iniciar sesión
```typescript
const loginResponse = await authService.login({
  email: 'usuario@ejemplo.com',
  password: 'contraseña123'
});

if (loginResponse.success) {
  // Usuario autenticado exitosamente
  console.log('Token:', loginResponse.token);
  console.log('Usuario:', loginResponse.user);
} else {
  // Error en la autenticación
  console.error('Error:', loginResponse.error);
}
```

### Verificar autenticación
```typescript
if (authService.isAuthenticated()) {
  const user = authService.getUser();
  const token = authService.getToken();
  console.log('Usuario autenticado:', user);
}
```

### Cerrar sesión
```typescript
authService.logout();
```

### Enviar código OTP para recuperar contraseña
```typescript
const response = await forgotPasswordService.sendOTP('usuario@ejemplo.com');

if (response.success) {
  console.log('OTP enviado:', response.message);
  console.log('Expira en:', response.expiresIn, 'segundos');
} else {
  console.error('Error:', response.error);
}
```

### Verificar código OTP
```typescript
const response = await verificationService.verifyOTP('usuario@ejemplo.com', '123456');

if (response.success && response.isValid) {
  console.log('Código verificado:', response.message);
  // Redirigir a página de cambio de contraseña
} else {
  console.error('Error:', response.error);
}
```

### Obtener headers de autorización
```typescript
const headers = authService.getAuthHeaders();
// Retorna: { Authorization: 'Bearer <token>' }
```

### Ejemplo de uso en un componente React
```typescript
import { useState } from 'react';
import authService from '../auth-service/AuthLogin';
import forgotPasswordService from '../auth-service/AuthForgotPass';

const LoginComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await authService.login({ email, password });
      
      if (response.success) {
        // Redirigir o actualizar estado
        console.log('Login exitoso');
      } else {
        console.error('Error:', response.error);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    
    try {
      const response = await forgotPasswordService.sendOTP(email);
      
      if (response.success) {
        console.log('OTP enviado exitosamente');
        // Redirigir a página de verificación
      } else {
        console.error('Error:', response.error);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    // Tu JSX aquí
  );
};
```

## Características del Servicio Simplificado

- **Código simple**: Fácil de entender y mantener
- **Dos endpoints principales**: `/v1/auth/login` y `/v1/otp/send`
- **Persistencia simple**: Guarda token y usuario en localStorage
- **Funciones básicas**: login, logout, enviar OTP, verificar autenticación
- **Sin complejidad**: No maneja refresh automático ni verificación de roles
- **Uso directo**: Se usa directamente en los componentes