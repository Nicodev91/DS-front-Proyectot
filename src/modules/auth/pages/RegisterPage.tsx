import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ButtonComponent, InputComponent, FormComponent, Toast } from "../../../shared/components";
import Utils from "../../../shared/utils/Utils";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<'success' | 'error'>('success'); 
  const [isToastVisible, setIsToastVisible] = useState(false);  
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 
  const [rut, setRut] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false); 

  const isRegisterValid = Utils.validateLoginCredentials(email, password) && 
                         name.trim() !== "" && 
                         rut.trim() !== "" &&
                         address.trim() !== "" &&
                         phone.trim() !== "" &&
                         password === confirmPassword &&
                         !email.toLowerCase().includes("@admin.com");

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setIsToastVisible(true);
  };

  const hideToast = () => {
    setIsToastVisible(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegisterLoading(true);

    // Validación simple local
    if (!name || !email || !rut || !address || !phone || !password || !confirmPassword) {
      showToast("Por favor, completa todos los campos.", "error");
      setIsRegisterLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      showToast("Las contraseñas no coinciden.", "error");
      setIsRegisterLoading(false);
      return;
    }

    try {
      // Crear datos de registro según el tipo RegisterData
      const registerData = {
        email: email,
        password: password,
        name: name,
        rut: rut,
        address: address,
        phoneNumber: phone
      };
      
      // Registrar usuario usando el contexto de autenticación
      await register(registerData);
      
      showToast("¡Registro exitoso! Redirigiendo al catálogo...", "success");
      setTimeout(() => {
        navigate("/catalog");
      }, 1500);
    } catch (error) {
       console.error('Registration error:', error);
       showToast("Error en el registro. Inténtalo de nuevo.", "error");
    } finally {
      setIsRegisterLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    // Verificar si el correo contiene @admin.com
    if (value.toLowerCase().includes("@admin.com")) {
      showToast("No se permite el registro con correos @admin.com", "error");
    } else if (isToastVisible && toastMessage === "No se permite el registro con correos @admin.com") {
      hideToast();
    }
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRut(value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddress(value);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
                Registrarse
              </h2>
              <p className="text-center text-back font-semibold text-base mb-6">
                Crea tu cuenta y obtén un 5% de descuento en todas tus compras.
              </p>
            </div>
            
            <FormComponent onSubmit={handleRegister} className="w-full flex flex-col gap-4">
              <InputComponent
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Ingrese su nombre completo"
                label="Nombre completo"
                required
              />

              <InputComponent
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Ingrese su correo electrónico"
                label="Correo electrónico"
                required
              />

              <InputComponent
                type="text"
                id="rut"
                value={rut}
                onChange={handleRutChange}
                placeholder="Ej: 12345678-9"
                label="RUT"
                required
              />

              <InputComponent
                type="text"
                id="address"
                value={address}
                onChange={handleAddressChange}
                placeholder="Ingrese su dirección completa"
                label="Dirección"
                required
              />

              <InputComponent
                type="tel"
                id="phone"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="Ej: +56 9 1234 5678"
                label="Teléfono"
                required
              />

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

              <InputComponent
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirme su contraseña"
                label="Confirmar contraseña"
                showPasswordToggle={true}
                onPasswordToggle={toggleConfirmPasswordVisibility}
                showPassword={showConfirmPassword}
                required
              />

              <ButtonComponent 
                type="submit" 
                disabled={!isRegisterValid || isRegisterLoading}
                className={`btn-theme text-lg mt-2 ${(!isRegisterValid || isRegisterLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isRegisterLoading ? "Registrando..." : "Registrarse"}
              </ButtonComponent>

              <div className="text-center mt-4">
                <span className="text-gray-600">¿Ya tienes una cuenta? </span>
                <Link to="/login" className="text-green-600 hover:underline font-medium">
                  Iniciar sesión
                </Link>
              </div>
            </FormComponent>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;