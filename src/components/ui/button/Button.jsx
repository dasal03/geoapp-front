import "./Button.scss";

const Button = ({
  type = "button",
  text,
  icon,
  onClick,
  disabled = false,
  hideText = false,
  styleType = "default",
}) => {
  return (
    <button
      type={type}
      className={styleType}
      disabled={disabled}
      onClick={onClick}
    >
      {!hideText && <span>{text}</span>}
      <i className={icon}></i>
    </button>
  );
};

export default Button;
