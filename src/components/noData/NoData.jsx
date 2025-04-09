import "./NoData.scss";

const NoData = ({
  title = "Sin resultados",
  message = "No hay información disponible.",
  icon = "fas fa-credit-card-slash",
  children,
}) => (
  <div className="no-data">
    <div className="no-data-icon-wrapper">
      <i className={`${icon} no-data-icon`} />
    </div>
    <h2 className="no-data-title">{title}</h2>
    <p className="no-data-text">{message}</p>
    {children && <div className="no-data-actions">{children}</div>}
  </div>
);

export default NoData;
