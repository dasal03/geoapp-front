import React from "react";
import "./ServiceCard.scss";

const ServiceCard = ({ image, title, description }) => (
  <div className="card">
    <img src={image} alt={title} />
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export default ServiceCard;
