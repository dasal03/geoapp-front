import { useState, useEffect } from "react";
import apiFetch from "../../utils/apiClient";
import { Loader } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useAlert } from "../../context/alertProvider";
import { ReactComponent as SearchIcon } from "../../assets/search-icon.svg";
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

  const { showAlert } = useAlert();

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
      showAlert("error", "Error", "Error al obtener los mantenimientos.");
    } finally {
      setIsLoading(false);
    }
  };

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
        showAlert("error", "Error", "Error al obtener los equipos.");
      }
    } catch (error) {
      showAlert("error", "Error", "Error al obtener los equipos.");
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
      showAlert("error", "Error", "Error al obtener los equipos.");
    }
  };

  const openChangeStateModal = () => {
    setNewState(null);
    setShowManageModal(false);
    setShowChangeStateModal(true);
    setShowMaintenanceModal(false);
  };

  const openMaintenanceModal = () => {
    setShowManageModal(false);
    setShowChangeStateModal(false);
    setShowMaintenanceModal(true);
  };

  const handleStateChange = async () => {
    if (!newState) {
      showAlert("warning", "Seleccionar estado", "Debe seleccionar un estado.");
      return;
    }

    if (newState === 3 && !scheduledDate) {
      showAlert("warning", "Seleccionar fecha", "Debe seleccionar una fecha.");
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
        showAlert("success", "Éxito", "Estado cambiado exitosamente");
        setShowChangeStateModal(false);
        fetchMaintenances();
      } else {
        showAlert("error", "Error", data.description);
      }
    } catch (error) {
      showAlert("error", "Error", "Error al cambiar el estado.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setScheduledDate(date);
  };

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
      showAlert("warning", "No hay mantenimientos", "No hay mantenimientos.");
    }
  };

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
        <Loader />
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
