import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ButtonComponent, InputComponent, FormComponent, Toast } from "../../../shared/components";
import Utils from "../../../shared/utils/Utils";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/AuthService";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'error'>('success'); 
  const [isToastVisible, setIsToastVisible] = useState(false);  
  
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false); 

  const isLoginValid = Utils.validateLoginCredentials(email, password);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setIsToastVisible(true);
  };

  const hideToast = () => {
    setIsToastVisible(false);
  };

  // En la función handleLogin, después del login exitoso:
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoginLoading(true);
  
    // Validación simple local
    if (!email || !password) {
      showToast("Por favor, ingresa tu correo y contraseña.", "error");
      setIsLoginLoading(false);
      return;
    }
  
    try {
      // Usar el contexto de autenticación
      await login({ email, password });
      
      // Login exitoso - el usuario se obtiene del contexto
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        showToast(`Bienvenido ${currentUser.name}`, "success");
        
        // Redirigir según el rol del usuario
        setTimeout(() => {
          if (currentUser.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/catalog');
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error en login:', error);
      showToast("Error de conexión con el servidor", "error");
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={isToastVisible}
        onClose={hideToast}
        duration={5000}
      />
      
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="w-full h-1/2 md:h-screen md:w-1/2">
          <img
            src="./MarketImage.jpg"
            alt="background-image"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center bg-white">
          <div className="w-full max-w-md flex flex-col items-center px-4 py-8 md:py-0">
            
            <div className="mb-3 mt-0">
              <div className="mx-auto mb-6 flex items-center justify-center">
                <span className="tracking-widest bg- font-bold rounded-xl border-2 px-6 py-2 text-sm">
                  Supermercado San Nicolás
                </span>
              </div>
              <h2 className="text-4xl font-bold text-center mb-4">
                Iniciar Sesión
              </h2>
              <p className="text-center text-back font-semibold text-base mb-6">
                Si ya eres miembro, puedes iniciar sesión con tu dirección de correo electrónico y contraseña.
              </p>
            </div>
            
            <FormComponent onSubmit={handleLogin} className="w-full flex flex-col gap-4">
              <InputComponent
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Ingrese su correo electrónico"
                label="Correo electrónico"
                required
              />

              <div>
                <InputComponent
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Ingrese su contraseña"
                  label="Contraseña"
                  showPasswordToggle={true}
                  onPasswordToggle={togglePasswordVisibility}
                  showPassword={showPassword}
                  required
                />
                <div className="flex justify-end mb-2">
                  <Link to="/forgot-password" className="text-sm text-forgetpassword hover:underline cursor-pointer mt-5">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              <ButtonComponent 
                type="submit" 
                disabled={!isLoginValid || isLoginLoading}
                className={`btn-theme text-lg mt-2 ${(!isLoginValid || isLoginLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoginLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </ButtonComponent>
              
              {/* Dashboard link removed */}
            </FormComponent>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
