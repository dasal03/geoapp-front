import React, { useState, useEffect } from "react";
import { ReactComponent as SearchIcon } from "../../assets/search-icon.svg";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/loading/LoadingSpinner";
import apiFetch from "../../utils/apiClient";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Swal from "sweetalert2";
import "./Maintenance.scss";

function Maintenance() {
  const { user: authUser } = useAuth();
  const [selectedDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
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
  const [isLoading, setIsLoading] = useState(false);

  // Fetches the maintenance list
  const fetchMaintenances = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch("/equipment_maintenance_status");
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
    } finally {
      setIsLoading(false);
    }
  };

  // Fetches the equipment list
  const fetchEquipment = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filter) queryParams.append(filter, search);

      const data = await apiFetch(
        `/get_equipment?all_info=true&${queryParams.toString()}`
      );
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
    } finally {
      setIsLoading(false);
    }
  };

  const openManageModal = async () => {
    try {
      setShowManageModal(true);
      setShowChangeStateModal(false);
      setShowMaintenanceModal(false);

      setNoResultsMessage("");
      setEquipmentList([]);

      await fetchEquipment();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al cargar los equipos.",
      });
    }
  };

  // Opens the change state modal
  const openChangeStateModal = () => {
    setNewState(null);
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

    if (newState === 3 && !scheduledDate) {
      Swal.fire({
        icon: "warning",
        title: "Seleccionar fecha",
        text: "Debe seleccionar una fecha para 'mantenimiento programado'.",
      });
      return;
    }

    const maintenanceData = {
      user_id: authUser.user_id,
      equipment_id: equipmentId,
      maintenance_status_id: newState,
      scheduled_date: scheduledDate
        ? scheduledDate.toISOString().split("T")[0]
        : null,
    };

    setIsLoading(true);
    try {
      const data = await apiFetch("/equipment_maintenance_status", {
        method: "POST",
        body: JSON.stringify(maintenanceData),
      });

      if (data.responseCode === 201) {
        Swal.fire({
          icon: "success",
          title: "Estado cambiado",
          text: "El estado ha sido actualizado.",
        });
        setShowChangeStateModal(false);
        fetchMaintenances();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.description || "Hubo un error al cambiar el estado.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error al conectarse con el servidor.",
      });
    } finally {
      setIsLoading(false);
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

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {noMaintenanceMessage && (
            <p className="no-maintenance-message">{noMaintenanceMessage}</p>
          )}

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
                    onChange={(e) =>
                      setFilter(e.target.value === filter ? "" : e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Selecciona un estado...
                    </option>
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

          {showChangeStateModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Cambiar Estado</h2>
                <select
                  value={newState || ""}
                  onChange={(e) => setNewState(Number(e.target.value))}
                >
                  <option value="" disabled>
                    Selecciona un estado
                  </option>
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
        </>
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
