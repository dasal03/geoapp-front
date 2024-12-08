import React from "react";
import "./Button.scss";

const Button = ({
  type = "button",
  text,
  icon,
  onClick,
  styleType = "default",
  disabled = false,
  hideText = false,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn ${styleType}`}
    >
      <i className={icon}></i>
      {!hideText && <span>{text}</span>}
    </button>
  );
};

export default Button;
