import React from "react";
import "./Button.scss";

const Button = ({ className, type, text, icon, onClick }) => {
  return (
    <button className={className} type={type} onClick={onClick}>
      {text} <i className={icon}></i>
    </button>
  );
};

export default Button;
