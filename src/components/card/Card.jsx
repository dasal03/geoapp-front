import "./Card.scss";

const Card = ({ image, title, description, link }) => (
  <a href={link} className="card">
    <div className="card-image">
      <img src={image} alt={title} />
    </div>
    <div className="card-content">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  </a>
);

export default Card;
