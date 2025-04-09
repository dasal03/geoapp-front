import { memo, useState, useCallback, useRef, useEffect } from "react";
import { FaHouseUser, FaEllipsisV } from "react-icons/fa";
import { Button } from "../ui";
import "./AddressSection.scss";

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

const AddressSection = memo(
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
        setLoadingItems((prev) => ({ ...prev, [item.address_id]: true }));
        await onCheckChange?.(item, newValue);
        setLoadingItems((prev) => ({ ...prev, [item.address_id]: false }));
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
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [openMenuId]);

    return (
      <section className="address-section">
        <h3 className="section-title">{title}</h3>

        <div className="address-list">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <SkeletonLoader key={index} />
              ))
            : sectionData.length > 0
            ? sectionData.map((item) => (
                <div className="address-card" key={item.address_id}>
                  {loadingItems[item.address_id] ? (
                    <div className="card-loading">
                      <span className="loader" />
                      <p>Cambiando estado...</p>
                    </div>
                  ) : (
                    <>
                      <div className="address-main">
                        <div className="icon-container">
                          <FaHouseUser className="house-icon" />
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={item.is_principal}
                              disabled={loadingItems[item.address_id]}
                              onChange={() =>
                                handleCheckChange(item, !item.is_principal)
                              }
                            />
                            <span className="slider" />
                          </label>
                        </div>

                        <div className="address-info">
                          <p className="address-name">
                            {`${item.address} - ${item.apartment}`}
                          </p>
                          <p className="address-location">
                            {`${item.state} - ${item.city}`}
                          </p>
                          <p className="address-description">
                            {item.description}
                          </p>
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
                          onClick={() => toggleMenu(item.address_id)}
                        >
                          <FaEllipsisV />
                        </button>

                        {openMenuId === item.address_id && (
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
                                onDeleteItem?.(item.address_id);
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
              No hay domicilios disponibles.
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

export default AddressSection;
