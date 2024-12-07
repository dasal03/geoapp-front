import React from "react";
// import "./Button.scss";

const Button = ({ type, text, icon, onClick }) => {
  return (
    <button type={type} onClick={onClick}>
      {text} <i className={icon}></i>
    </button>
  );
};

export default Button;
