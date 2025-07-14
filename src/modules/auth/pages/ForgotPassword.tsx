import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ButtonComponent, InputComponent, FormComponent, Toast } from "../../../shared/components";
import Utils from "../../../shared/utils/Utils";
import forgotPasswordService from "../services/AuthForgotPass";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isToastVisible, setIsToastVisible] = useState(false);

  const isFormValid = Utils.validateEmail(email);

  const showToast = (message: string, type: 'success' | 'error') => {
    Utils.showToastUtil(setToastMessage, setToastType, setIsToastVisible, message, type);
  };

  const hideToast = () => {
    Utils.hideToastUtil(setIsToastVisible);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      showToast("El correo electrónico no es válido, ingrese su correo nuevamente", "error");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await forgotPasswordService.sendOTP(email);
      
      if (response.success) {
        // Guardar email en localStorage para usarlo en VerificationCode
        localStorage.setItem('forgot_password_email', email);
        
        showToast(response.message || "Código de verificación enviado exitosamente. Revisa tu correo electrónico.", "success");
        setTimeout(() => {
          navigate("/verification-code");
        }, 2000);
      } else {
        showToast(response.error || "El correo electrónico no existe, vuelve a intentarlo", "error");
      }
    } catch (error) {
      console.error("Error al enviar OTP:", error);
      showToast("Error al conectar con el servidor. Intente nuevamente.", "error");
    } finally {
      setIsLoading(false);
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
                Recuperar Contraseña
              </h2>
              <p className="text-center text-black font-semibold text-base mb-6">
                Ingresa tu correo electrónico y te enviaremos un código para reestablecer tu contraseña
              </p>
            </div>

            <FormComponent onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
              <InputComponent
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Ingrese su correo electrónico"
                label="Correo electrónico"
                required
              />
              
              <ButtonComponent 
                type="submit" 
                disabled={!isFormValid || isLoading}
                className={`btn-theme text-lg mt-2 ${(!isFormValid || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}>     
                {isLoading ? "Enviando código..." : "Enviar Código de Verificación"}
              </ButtonComponent>
              
              <div className="flex justify-center mt-2">
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

export default ForgotPassword;
