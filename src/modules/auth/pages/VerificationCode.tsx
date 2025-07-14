import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ButtonComponent, InputComponent, FormComponent, Toast } from "../../../shared/components";
import Utils from "../../../shared/utils/Utils";
import verificationService from "../services/AuthVerificationCode";

const EmptyString = "";

const VerificationCode = () => {
  // Eliminar esta línea si navigate no se usa en el componente
  // const navigate = useNavigate();
  const [code, setCode] = useState(EmptyString);
  const [email, setEmail] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);

  // Obtener email del localStorage o de la URL al cargar el componente
  useEffect(() => {
    // Intentar obtener email del localStorage 
    const storedEmail = localStorage.getItem('forgot_password_email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
    // También se puede obtener de los parámetros de la URL si es necesario
  }, []);

  const [toastMessage, setToastMessage] = useState(EmptyString);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const isFormValid = Utils.validateVerificationCode(code);

  const showToast = (message: string, type: 'success' | 'error') => {
    Utils.showToastUtil(setToastMessage, setToastType, setIsToastVisible, message, type);
  };

  const hideToast = () => {
    Utils.hideToastUtil(setIsToastVisible);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showToast("Error: No se encontró el email. Vuelve a solicitar el código.", "error");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await verificationService.verifyOTP(email, code);
      
      if (response.success && response.isValid) {
        showToast("¡Código verificado exitosamente! Ahora puedes cambiar tu contraseña.", "success");
        setTimeout(() => {
          // Aquí puedes redirigir a la página de cambio de contraseña
          // navigate("/reset-password");
          setCode(EmptyString);
        }, 2000);
      } else {
        showToast(response.error || "Código inválido. Vuelva a solicitar el código de verificación.", "error");
      }
    } catch (error) {
      console.error("Error al verificar código:", error);
      showToast("Error al conectar con el servidor. Intente nuevamente.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setCode(value);
    }
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
                Verificar Código
              </h2>
              <p className="text-center text-black font-semibold text-base mb-6">
                Hemos enviado un código de verificación a tu correo electrónico. Por favor, ingrésalo a continuación.
              </p>
            </div>

            <FormComponent onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <InputComponent
                type="text"
                id="code"
                value={code}
                onChange={handleCodeChange}
                placeholder="Ingresa el código recibido"
                label="Código de verificación"
                required
                maxLength={6}
              />
              
              <ButtonComponent 
                type="submit" 
                disabled={!isFormValid || isLoading}
                className={`btn-theme text-lg mt-2 ${(!isFormValid || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {isLoading ? "Verificando..." : "Verificar Código"}
              </ButtonComponent>
              
              <div className="flex items-center mt-2 gap-4 flex-col">
                <Link to="/forgot-password" className="text-sm text-forgetpassword hover:underline cursor-pointer">
                  Volver a solicitar código
                </Link>
                
                <Link to="/login" className="text-sm text-forgetpassword hover:underline cursor-pointer">
                  Volver a iniciar sesión
                </Link>
              </div>
            </FormComponent>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationCode;
