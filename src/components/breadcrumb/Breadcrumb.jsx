import { Link, useLocation } from "react-router-dom";
import "./Breadcrumb.scss";

const Breadcrumbs = ({ breadcrumbItems }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const activeBreadcrumbs = breadcrumbItems.filter((item) =>
    currentPath.includes(item.path)
  );

  return (
    <nav className="breadcrumb">
      <ul className="breadcrumb-list">
        {activeBreadcrumbs.map((item, index) => (
          <li key={item.path} className="breadcrumb-item">
            {index < activeBreadcrumbs.length - 1 ? (
              <>
                <Link to={item.path} className="breadcrumb-link">
                  {item.label}
                </Link>
                <span className="breadcrumb-separator"> &gt; </span>
              </>
            ) : (
              <span className="breadcrumb-current">{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
