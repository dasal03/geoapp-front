import { Link } from "react-router-dom";
import "./SectionCards.scss";

const SectionCards = ({ cards }) => {
  return (
    <ul className="section-cards">
      {cards.map(({ path, icon, title, description }) => (
        <li key={path} className="section-card">
          <Link to={path}>
            <div className="section-icon-container">{icon}</div>
            <div className="section-text">
              <span>{title}</span>
              <p>{description}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SectionCards;
