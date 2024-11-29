import React, { useState, useEffect } from "react";
import apiFetch from "../utils/apiClient";
import { convertImageToBase64 } from "../utils/generalTools";
import { useAuth } from "../context/AuthContext";
import { FileInput } from "../components/fileInput/FileInput";
import LoadingSpinner from "../components/loading/LoadingSpinner";
import Swal from "sweetalert2";
import { ReactComponent as SearchIcon } from "../assets/search-icon.svg";
import "../styles/pages/equipmentManagement.scss";

const EquipmentManagement = () => {
  const { user: authUser } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error] = useState(null);
  const [newEquipment, setNewEquipment] = useState({
    description: "",
    serial: "",
    model: "",
    image: "",
  });
  const [originalImage, setOriginalImage] = useState(null);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (filter) {
        queryParams.append(filter, search);
      }

      const data = await apiFetch(`/get_equipment?${queryParams.toString()}`);

      if (data.responseCode === 200) {
        setEquipmentList(data.data);
      } else if (data.responseCode === 404) {
        setEquipmentList([]);
      } else {
        setEquipmentList([]);
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
        text: error.message || "Error en la búsqueda.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEquipmentDetails = async (id) => {
    setIsLoading(true);
    try {
      const data = await apiFetch(
        `/get_equipment?all_info=true&equipment_id=${id}`
      );

      if (data.responseCode === 200) {
        setSelectedEquipment(data.data[0]);
        setInfoModalVisible(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            data.description || "No se pudo obtener la información del equipo.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error al obtener detalles del equipo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEquipment && selectedEquipment.image) {
      setOriginalImage(selectedEquipment.image);
    }
  }, [selectedEquipment]);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const bodyData = {
        equipment_id: selectedEquipment.equipment_id,
        description: selectedEquipment.description,
        serial: selectedEquipment.serial,
        model: selectedEquipment.model,
      };

      if (
        selectedEquipment.image &&
        selectedEquipment.image !== originalImage
      ) {
        bodyData.image = await convertImageToBase64(selectedEquipment.image);
      }

      const url = "/update_equipment";
      const data = await apiFetch(url, {
        method: "PUT",
        body: JSON.stringify(bodyData),
      });

      if (data.responseCode === 200) {
        Swal.fire({
          icon: "success",
          title: "Guardado",
          text: "Equipo actualizado correctamente.",
        });
        setIsEditing(false);
        setInfoModalVisible(false);
        handleSearch();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.description || "No se pudo guardar el equipo.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error al guardar los cambios.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás deshacer esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const url = `/delete_equipment?equipment_id=${id}`;
        const data = await apiFetch(url, {
          method: "DELETE",
        });

        if (data.responseCode === 200) {
          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: data.message || "Equipo eliminado correctamente.",
          }).then(() => {
            setEquipmentList((prevList) =>
              prevList.filter((equipment) => equipment.equipment_id !== id)
            );
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "Hubo un error al eliminar el equipo.",
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error en la conexión con el servidor.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEquipment = async () => {
    setIsLoading(true);
    const equipmentData = {
      description: newEquipment.description,
      serial: newEquipment.serial,
      model: newEquipment.model,
      image: newEquipment.image
        ? await convertImageToBase64(newEquipment.image)
        : "",
    };

    try {
      const url = "/create_equipment";
      const data = await apiFetch(url, {
        method: "POST",
        body: JSON.stringify(equipmentData),
      });

      if (data.responseCode === 201) {
        const equipmentId = data.data.equipment_id;
        console.log("ID del equipo:", equipmentId);

        if (equipmentId) {
          try {
            const newData = {
              user_id: authUser.user_id,
              equipment_id: equipmentId,
              maintenance_status_id: 1,
            };
            const url = "/equipment_maintenance_status";
            const maintenanceData = await apiFetch(url, {
              method: "POST",
              body: JSON.stringify(newData),
            });

            if (maintenanceData.responseCode === 201) {
              Swal.fire({
                icon: "success",
                title: "Éxito",
                text:
                  data.message ||
                  "Equipo añadido y mantenimiento actualizado correctamente.",
              }).then(() => {
                setModalVisible(false);
                setNewEquipment({
                  description: "",
                  serial: "",
                  model: "",
                  image: null,
                });
                handleSearch();
              });
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text:
                error.message ||
                "Error al actualizar el estado de mantenimiento.",
            });
          }
        } else {
          Swal.fire({
            icon: "success",
            title: "Éxito",
            text: data.message || "Equipo creado correctamente.",
          }).then(() => {
            setModalVisible(false);
            setNewEquipment({
              description: "",
              serial: "",
              model: "",
              image: null,
            });
            handleSearch();
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Hubo un error al crear el equipo.",
        }).then(() => {
          setModalVisible(true);
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error en la conexión con el servidor.",
      }).then(() => {
        setModalVisible(true);
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="equipment-management">
      <div className="content">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar equipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={filter}
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
          <button onClick={handleSearch} className="search-btn">
            <SearchIcon />
          </button>
        </div>
        <button
          className="add-equipment-btn"
          onClick={() => setModalVisible(true)}
        >
          Añadir equipo
        </button>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="equipment-list">
            {Array.isArray(equipmentList) && equipmentList.length > 0 ? (
              equipmentList.map((equipment) => (
                <div
                  key={equipment.equipment_id}
                  className={`equipment-card ${
                    expandedCard === equipment.equipment_id ? "expanded" : ""
                  }`}
                >
                  <div
                    className="card-header"
                    onClick={() => handleExpand(equipment.equipment_id)}
                  >
                    <h3>{equipment.description}</h3>
                    <p>
                      {equipment.location} - {equipment.model}
                    </p>
                  </div>
                  {expandedCard === equipment.equipment_id && (
                    <div className="card-body">
                      <p>Serial: {equipment.serial}</p>
                      <div className="card-actions">
                        <button
                          className="view-info-btn"
                          onClick={() =>
                            fetchEquipmentDetails(equipment.equipment_id)
                          }
                        >
                          Ver información
                        </button>
                        <button
                          className="delete-equipment-btn"
                          onClick={() => handleDelete(equipment.equipment_id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No hay equipos disponibles.</p>
            )}
          </div>
        )}
      </div>

      {infoModalVisible && selectedEquipment && (
        <div className={`modal-info ${infoModalVisible ? "open" : ""}`}>
          <div className="modal-content">
            <h2>Hoja de Vida del Equipo</h2>
            <div className="modal-body">
              {selectedEquipment.image && !isEditing && (
                <div className="image-container">
                  <div>
                    <img
                      src={selectedEquipment.image}
                      alt="Imagen"
                      className="equipment-image"
                    />
                  </div>
                </div>
              )}
              <p>
                Descripción:{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={selectedEquipment.description}
                    onChange={(e) =>
                      setSelectedEquipment({
                        ...selectedEquipment,
                        description: e.target.value,
                      })
                    }
                  />
                ) : (
                  selectedEquipment.description
                )}
              </p>
              <p>
                Modelo:{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={selectedEquipment.model}
                    onChange={(e) =>
                      setSelectedEquipment({
                        ...selectedEquipment,
                        model: e.target.value,
                      })
                    }
                  />
                ) : (
                  selectedEquipment.model
                )}
              </p>
              <p>
                Serial:{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={selectedEquipment.serial}
                    onChange={(e) =>
                      setSelectedEquipment({
                        ...selectedEquipment,
                        serial: e.target.value,
                      })
                    }
                  />
                ) : (
                  selectedEquipment.serial
                )}
              </p>
              {isEditing && (
                <div>
                  <p>Cargar nueva imagen:</p>
                  <FileInput
                    setValue={setSelectedEquipment}
                    accept="image/*"
                    value={selectedEquipment.image}
                  />
                </div>
              )}
            </div>
            <div className="modal-actions-hv">
              <button
                className={`edit-btn ${isEditing ? "cancel-edit-btn" : ""}`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancelar Edición" : "Editar"}
              </button>
              {!isEditing && (
                <>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(selectedEquipment.equipment_id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setInfoModalVisible(false)}
                  >
                    Cancelar
                  </button>
                </>
              )}
              {isEditing && (
                <button className="save-btn" onClick={handleSaveChanges}>
                  Guardar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {modalVisible && (
        <>
          <div
            className="modal-backdrop"
            onClick={() => setModalVisible(false)}
          ></div>

          <div className="modal-add-equipment">
            <h3>Añadir equipo</h3>
            <input
              type="text"
              placeholder="Descripción"
              value={newEquipment.description}
              onChange={(e) =>
                setNewEquipment({
                  ...newEquipment,
                  description: e.target.value,
                })
              }
            />
            <input
              type="text"
              placeholder="Serial"
              value={newEquipment.serial}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, serial: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Modelo"
              value={newEquipment.model}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, model: e.target.value })
              }
            />
            <FileInput
              setValue={setNewEquipment}
              accept="image/*"
              value={newEquipment}
            />
            <div className="modal-actions">
              <button className="add-btn" onClick={handleAddEquipment}>
                Añadir equipo
              </button>
              <button
                className="cancel-btn"
                onClick={() => setModalVisible(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EquipmentManagement;
