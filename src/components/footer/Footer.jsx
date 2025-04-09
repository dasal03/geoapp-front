import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2>GeoApp</h2>
          <p>Soluciones tecnológicas para la gestión de equipos biomédicos.</p>
        </div>

        <div className="footer-section">
          <h3>Enlaces</h3>
          <ul>
            <li>
              <Link to="/contact-us">Contáctanos</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Política de privacidad</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section social-links">
          <h3>Síguenos</h3>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} GeoApp. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
