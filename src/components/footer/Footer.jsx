import { Link } from "react-router-dom";
import "./Footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <p>© 2024 GeoApp. Todos los derechos reservados.</p>
      <p>
        <Link to="/contact">Contáctanos</Link> |{" "}
        <Link to="/privacy-policy">Política de privacidad</Link>
      </p>
    </footer>
  );
}

export default Footer;
