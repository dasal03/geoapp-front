import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ReactComponent as SearchIcon } from "../../assets/search-icon.svg";
import { useAuth } from "../auth/AuthContext";
import Swal from "sweetalert2";
import "./Maintenance.css";

function Maintenance() {
  const { user: authUser } = useAuth();
  const [selectedDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [equipmentList, setEquipmentList] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showChangeStateModal, setShowChangeStateModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [noResultsMessage, setNoResultsMessage] = useState("");
  const [noMaintenanceMessage, setNoMaintenanceMessage] = useState("");
  const [currentState, setCurrentState] = useState(null);
  const [newState, setNewState] = useState(null);
  const [scheduledDate, setScheduledDate] = useState(null);
  const [equipmentId, setEquipmentId] = useState(null);

  // Fetches the maintenance list
  const fetchMaintenances = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/dev/equipment_maintenance_status",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.responseCode === 200 && data.data.length > 0) {
        setMaintenanceList(data.data);
        setNoMaintenanceMessage("");
      } else {
        setMaintenanceList([]);
        setNoMaintenanceMessage(
          "No hay mantenimientos programados en este momento."
        );
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al obtener los mantenimientos programados.",
      });
    }
  };

  // Fetches the equipment list
  const fetchEquipment = async () => {
    try {
      const url = `http://localhost:3000/dev/get_equipment?all_info=true&${filter}=${search}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      if (data.responseCode === 200) {
        setEquipmentList(data.data);
        setNoResultsMessage("");
      } else if (data.responseCode === 404) {
        setEquipmentList([]);
        setNoResultsMessage(
          "No se encontraron equipos con su criterio de búsqueda."
        );
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.description || "Error al obtener los equipos.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error al conectarse con el servidor.",
      });
    }
  };

  const openManageModal = () => {
    setShowManageModal(true);
    setShowChangeStateModal(false);
    setShowMaintenanceModal(false);

    setEquipmentList([]);
    setNoResultsMessage("");
    setSearch("");
    setFilter("all");
  };

  // Opens the change state modal
  const openChangeStateModal = () => {
    setShowManageModal(false);
    setShowChangeStateModal(true);
    setShowMaintenanceModal(false);
  };

  // Opens the maintenance modal
  const openMaintenanceModal = () => {
    setShowManageModal(false);
    setShowChangeStateModal(false);
    setShowMaintenanceModal(true);
  };

  // Handles the state change process for maintenance
  const handleStateChange = async () => {
    if (!newState) {
      Swal.fire({
        icon: "warning",
        title: "Seleccionar estado",
        text: "Por favor seleccione un estado válido.",
      });
      return;
    }

    if (newState !== 3) {
      setScheduledDate(null);
    }

    if (newState === 3 && !scheduledDate) {
      Swal.fire({
        icon: "warning",
        title: "Seleccionar fecha",
        text: "Debe seleccionar una fecha para 'mantenimiento programado'.",
      });
      return;
    }

    const data = {
      user_id: authUser.user_id,
      equipment_id: equipmentId,
      maintenance_status_id: newState,
      scheduled_date: scheduledDate
        ? scheduledDate.toISOString().split("T")[0]
        : null,
    };

    try {
      const response = await fetch(
        "http://localhost:3000/dev/equipment_maintenance_status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        Swal.fire(
          "Estado cambiado",
          "El estado ha sido actualizado.",
          "success"
        );
        setShowChangeStateModal(false);
        fetchMaintenances();
        setCurrentState(null);
        setNewState(null);
        setScheduledDate(null);
        setEquipmentId(null);
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorData.message || "Hubo un error al cambiar el estado.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al comunicarse con el servidor.",
      });
    }
  };

  // Handles calendar date changes and populates maintenance events
  const handleDateChange = (date) => {
    setScheduledDate(date);
  };

  // Fetch maintenance events for the clicked date
  const handleDateClick = (date) => {
    const today = new Date();
    const formatDate = new Date(date).toDateString();

    const events = maintenanceList.filter((maintenance) => {
      if (
        maintenance.maintenance_status_id === 2 &&
        formatDate === today.toDateString()
      ) {
        return true;
      }

      if (maintenance.maintenance_status_id === 3) {
        const scheduledDate = new Date(
          maintenance.scheduled_date + "T00:00:00"
        );
        return scheduledDate.toDateString() === formatDate;
      }

      return false;
    });

    if (events.length > 0) {
      setModalData(events);
      openMaintenanceModal();
    } else {
      Swal.fire({
        icon: "info",
        title: "Sin mantenimientos",
        text: "No hay mantenimientos programados para esta fecha.",
      });
    }
  };

  // Fetch maintenance data on component mount
  useEffect(() => {
    fetchMaintenances();
  }, []);

  return (
    <div className="maintenance-container">
      <h1 className="title">Mantenimientos Programados</h1>

      <div className="top-actions">
        <button className="manage-button small" onClick={openManageModal}>
          Gestionar
        </button>
      </div>

      {noMaintenanceMessage && (
        <p className="no-maintenance-message">{noMaintenanceMessage}</p>
      )}

      {/* Modal for managing equipment */}
      {showManageModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Gestionar Mantenimientos</h2>
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar equipo..."
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                value={filter}
                className="search-select"
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="description">Descripción</option>
                <option value="model">Modelo</option>
                <option value="serial">Serial</option>
              </select>
              <button onClick={fetchEquipment} className="search-btn">
                <SearchIcon />
              </button>
            </div>
            <div className="equipment-list">
              {equipmentList.length === 0 && noResultsMessage && (
                <p className="no-results-message">{noResultsMessage}</p>
              )}
              {equipmentList.map((equipment) => (
                <div key={equipment.id} className="equipment-card">
                  <h3>{equipment.description}</h3>
                  <p>Modelo: {equipment.model}</p>
                  <p>Serial: {equipment.serial}</p>
                  <p>Estado actual: {equipment.maintenance_status}</p>
                  <button
                    onClick={() => {
                      setCurrentState(equipment.maintenance_status_id);
                      setNewState(equipment.maintenance_status_id);
                      setEquipmentId(equipment.equipment_id);
                      openChangeStateModal();
                    }}
                  >
                    Cambiar Estado
                  </button>
                </div>
              ))}
            </div>
            <div className="close-modal-btn">
              <button
                className="close-modal"
                onClick={() => setShowManageModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for changing maintenance state */}
      {showChangeStateModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Cambiar Estado</h2>
            <select
              value={newState}
              onChange={(e) => setNewState(Number(e.target.value))}
            >
              {currentState === 1 && (
                <>
                  <option value={2}>Mantenimiento</option>
                  <option value={3}>Mantenimiento Programado</option>
                </>
              )}
              {currentState === 2 && (
                <>
                  <option value={1}>Funcionamiento</option>
                  <option value={3}>Mantenimiento Programado</option>
                </>
              )}
              {currentState === 3 && (
                <>
                  <option value={1}>Funcionamiento</option>
                  <option value={2}>Mantenimiento</option>
                  <option value={3}>Mantenimiento Programado</option>
                </>
              )}
            </select>

            {newState === 3 && (
              <>
                <h4>Fecha de Mantenimiento Programado</h4>
                <Calendar
                  onChange={handleDateChange}
                  value={scheduledDate}
                  minDate={new Date()}
                />
              </>
            )}

            <div className="modal-actions">
              <button
                onClick={() => handleStateChange(equipmentId)}
                className="confirm-btn"
              >
                Confirmar
              </button>
              <button
                onClick={() => setShowChangeStateModal(false)}
                className="cancel-btn"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for displaying scheduled maintenance */}
      {showMaintenanceModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Detalles de Mantenimiento</h2>
            {modalData.length > 0 ? (
              modalData.map((maintenance) => (
                <div key={maintenance.maintenance_id}>
                  <h3>Equipo: {maintenance.description}</h3>
                  <p>Serial: {maintenance.serial}</p>
                  <p>Modelo: {maintenance.model}</p>
                  {maintenance.maintenance_status_id === 3 && (
                    <p>Fecha Programada: {maintenance.scheduled_date}</p>
                  )}
                </div>
              ))
            ) : (
              <p>No hay mantenimientos programados para esta fecha.</p>
            )}
            <button
              onClick={() => setShowMaintenanceModal(false)}
              className="close-modal"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="calendar-container">
        <Calendar
          onClickDay={handleDateClick}
          value={selectedDate}
          minDate={new Date()}
        />
      </div>
    </div>
  );
}

export default Maintenance;
