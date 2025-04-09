import { memo, useState, useCallback, useRef, useEffect } from "react";
import { FaCreditCard, FaEllipsisV } from "react-icons/fa";
import { Button } from "../ui";
import "./PaymentCardSection.scss";

const SkeletonLoader = () => (
  <div className="skeleton-item">
    <div className="skeleton-left">
      <div className="skeleton-icon"></div>
      <div className="skeleton-switch"></div>
    </div>

    <div className="skeleton-info">
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line"></div>
    </div>

    <div className="skeleton-options"></div>
  </div>
);

const formatCardNumber = (number = "") =>
  number
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();

const PaymentCardSection = memo(
  ({
    title,
    sectionData = [],
    onCheckChange,
    onAddItem,
    onEditItem,
    onDeleteItem,
    loading,
  }) => {
    const [loadingItems, setLoadingItems] = useState({});
    const [openMenuId, setOpenMenuId] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);
    const dropdownRefs = useRef({});

    const handleCheckChange = useCallback(
      async (item, newValue) => {
        setLoadingItems((prev) => ({ ...prev, [item.id]: true }));
        await onCheckChange?.(item, newValue);
        setLoadingItems((prev) => ({ ...prev, [item.id]: false }));
      },
      [onCheckChange]
    );

    const toggleMenu = (id) => {
      setOpenMenuId((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
      if (!loading) {
        setHasFetched(true);
      }
    }, [loading]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        const currentRef = dropdownRefs.current[openMenuId];
        if (currentRef && !currentRef.contains(event.target)) {
          setOpenMenuId(null);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [openMenuId]);

    return (
      <section className="payment-card-section">
        <h3 className="section-title">{title}</h3>

        <div className="payment-card-list">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <SkeletonLoader key={index} />
              ))
            : sectionData.length > 0
            ? sectionData.map((item) => (
                <div className="payment-card-card" key={item.id}>
                  {loadingItems[item.id] ? (
                    <div className="card-loading">
                      <span className="loader" />
                      <p>Cambiando estado...</p>
                    </div>
                  ) : (
                    <>
                      <div className="payment-card-main">
                        <div className="icon-container">
                          <FaCreditCard className="card-icon" />
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={item.is_principal}
                              disabled={loadingItems[item.id]}
                              onChange={() =>
                                handleCheckChange(item, !item.is_principal)
                              }
                            />
                            <span className="slider" />
                          </label>
                        </div>

                        <div className="payment-card-info">
                          <p className="payment-card-name">{item.name}</p>
                          <p className="payment-card-number">
                            {formatCardNumber(item.number)}
                          </p>
                          <p className="payment-card-expiry">{item.expiry}</p>
                        </div>
                      </div>

                      <div
                        className="card-options"
                        ref={(el) => {
                          if (el) dropdownRefs.current[item.id] = el;
                        }}
                      >
                        <button
                          className="menu-button"
                          onClick={() => toggleMenu(item.id)}
                        >
                          <FaEllipsisV />
                        </button>

                        {openMenuId === item.id && (
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
                                onDeleteItem?.(item.id);
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
              ))
            : null}

          {!loading && hasFetched && sectionData.length === 0 && (
            <div className="no-data">
              <i className="fas fa-box-open" />
              No hay medios de pago disponibles.
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

export default PaymentCardSection;
