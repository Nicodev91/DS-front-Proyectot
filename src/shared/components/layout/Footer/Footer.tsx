import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="admin-footer">
      <div className="footer-content">
        <div className="footer-copyright">
          <p>&copy; {currentYear} Admin Panel. Todos los derechos reservados.</p>
          <p className="footer-version">Versión 1.0.0</p>
        </div>
        <div className="footer-links">
          <a href="#" className="footer-link">Términos y Condiciones</a>
          <a href="#" className="footer-link">Política de Privacidad</a>
          <a href="#" className="footer-link">Contacto</a>
          <a href="#" className="footer-link">Ayuda</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;