import { memo, useState, useCallback, useRef, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { Button } from "../ui";
import "./GenericSection.scss";

const SkeletonLoader = () => (
  <div className="skeleton-item">
    <div className="skeleton-left">
      <div className="skeleton-icon" />
      <div className="skeleton-switch" />
    </div>
    <div className="skeleton-info">
      <div className="skeleton-line" />
      <div className="skeleton-line" />
      <div className="skeleton-line" />
    </div>
    <div className="skeleton-options" />
  </div>
);

const GenericSection = memo(
  ({
    title,
    data = [],
    loading,
    onCheckChange,
    onAddItem,
    onEditItem,
    onDeleteItem,
    icon: Icon,
    getInfoLines,
    idKey = "id",
    sectionClass = "",
    cardClass = "",
    noDataText = "No hay datos disponibles.",
  }) => {
    const [loadingItems, setLoadingItems] = useState({});
    const [openMenuId, setOpenMenuId] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);
    const dropdownRefs = useRef({});

    const handleCheckChange = useCallback(
      async (item, newValue) => {
        const id = item[idKey];
        setLoadingItems((prev) => ({ ...prev, [id]: true }));
        await onCheckChange?.(item, newValue);
        setLoadingItems((prev) => ({ ...prev, [id]: false }));
      },
      [onCheckChange, idKey]
    );

    const toggleMenu = (id) => {
      setOpenMenuId((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
      if (!loading) setHasFetched(true);
    }, [loading]);

    useEffect(() => {
      const handleClickOutside = (e) => {
        const ref = dropdownRefs.current[openMenuId];
        if (ref && !ref.contains(e.target)) setOpenMenuId(null);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [openMenuId]);

    return (
      <section className={`generic-section ${sectionClass}`}>
        <h3 className="section-title">{title}</h3>

        <div className="generic-list">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <SkeletonLoader key={index} />
              ))
            : data.length > 0
            ? data.map((item) => {
                const id = item[idKey];
                const infoLines = getInfoLines(item);
                return (
                  <div className={`generic-card ${cardClass}`} key={id}>
                    {loadingItems[id] ? (
                      <div className="card-loading">
                        <span className="loader" />
                        <p>Cambiando estado...</p>
                      </div>
                    ) : (
                      <>
                        <div className="card-main">
                          <div className="icon-container">
                            <Icon className="item-icon" />
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={item.is_principal}
                                disabled={loadingItems[id]}
                                onChange={() =>
                                  handleCheckChange(item, !item.is_principal)
                                }
                              />
                              <span className="slider" />
                            </label>
                          </div>
                          <div className="info">
                            {infoLines.map((line, i) => (
                              <p key={i}>{line}</p>
                            ))}
                          </div>
                        </div>

                        <div
                          className="card-options"
                          ref={(el) => {
                            if (el) dropdownRefs.current[id] = el;
                          }}
                        >
                          <button
                            className="menu-button"
                            onClick={() => toggleMenu(id)}
                          >
                            <FaEllipsisV />
                          </button>

                          {openMenuId === id && (
                            <ul className="dropdown-menu">
                              <li
                                className="dropdown-item"
                                onClick={() => {
                                  onEditItem?.(item);
                                  setOpenMenuId(null);
                                }}
                              >
                                Editar
                              </li>
                              <li
                                className="dropdown-item"
                                onClick={() => {
                                  onDeleteItem?.(id);
                                  setOpenMenuId(null);
                                }}
                              >
                                Eliminar
                              </li>
                            </ul>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            : null}

          {!loading && hasFetched && data.length === 0 && (
            <div className="no-data">
              <i className="fas fa-box-open" />
              {noDataText}
            </div>
          )}
        </div>

        <div className="add-button-container">
          <Button
            text={`Agregar ${title}`}
            icon="fa fa-plus"
            onClick={() => onAddItem?.()}
            styleType="add-item-btn"
          />
        </div>
      </section>
    );
  }
);

export default GenericSection;
