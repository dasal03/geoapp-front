import { Link } from "react-router-dom";
import "./SectionCards.scss";

const SkeletonCard = () => (
  <li className="section-card skeleton">
    <div className="section-icon-container skeleton-box"></div>
    <div className="section-text">
      <span className="skeleton-box skeleton-title"></span>
      <p className="skeleton-box skeleton-desc"></p>
    </div>
  </li>
);

const SectionCards = ({ cards, loading }) => {
  return (
    <ul className="section-cards">
      {loading
        ? Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)
        : cards.map(({ path, icon, title, description }) => (
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
