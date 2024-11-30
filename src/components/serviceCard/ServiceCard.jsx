import React from "react";
import "./ServiceCard.scss";

const ServiceCard = ({ image, title, description, link }) => (
  <a href={link} className="card">
    <img src={image} alt={title} />
    <h3>{title}</h3>
    <p>{description}</p>
  </a>
);

export default ServiceCard;
