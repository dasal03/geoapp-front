import { Link } from "react-router-dom";
import "./Footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-copyright">
          © 2024 GeoApp. Todos los derechos reservados.
        </p>
        <p className="footer-links">
          <Link to="/contact-us">Contáctanos</Link> |{" "}
          <Link to="/privacy-policy">Política de privacidad</Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
