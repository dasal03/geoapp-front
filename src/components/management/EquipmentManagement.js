import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../auth/AuthContext";
import { ReactComponent as SearchIcon } from "../../assets/search-icon.svg";
import "./EquipmentManagement.css";
import { FileInput } from "../fileInput/FileInput";

const EquipmentManagement = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedCard, setExpandedCard] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    description: "",
    serial: "",
    model: "",
    image: "",
  });
  const { token } = useAuth();

  const handleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/dev/get_equipment?${filter}=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

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
    }
  };

  const fetchEquipmentDetails = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/dev/get_equipment?all_info=true&equipment_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
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
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/dev/update_equipment",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            equipment_id: selectedEquipment.equipment_id,
            description: selectedEquipment.description,
            serial: selectedEquipment.serial,
            model: selectedEquipment.model,
            image: selectedEquipment.image 
              ? await convertImageToBase64(selectedEquipment.image)
              : "",
            maintenance_status_id: selectedEquipment.maintenance_status_id,
          }),
        }
      );
      const data = await response.json();

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
    }
  };

  const handleDelete = async (id) => {
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
        const response = await fetch(
          `http://localhost:3000/dev/delete_equipment?equipment_id=${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (response.status === 200) {
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
    }
  };

  const handleAddEquipment = async () => {
    const equipmentData = {
      description: newEquipment.description,
      serial: newEquipment.serial,
      model: newEquipment.model,
      image: newEquipment.image
        ? await convertImageToBase64(newEquipment.image)
        : "",
    };

    try {
      const response = await fetch(
        "http://localhost:3000/dev/create_equipment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(equipmentData),
        }
      );

      const data = await response.json();

      if (response.status === 200 || response.status === 201) {
        const equipmentId = data.data?.equipment_id;

        if (equipmentId) {
          try {
            const maintenanceResponse = await fetch(
              "http://localhost:3000/dev/equipment_maintenance_status",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  equipment_id: equipmentId,
                  maintenance_status_id: 1,
                }),
              }
            );

            const maintenanceData = await maintenanceResponse.json();

            if (maintenanceResponse.status === 200) {
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
            } else {
              Swal.fire({
                icon: "warning",
                title: "Advertencia",
                text:
                  maintenanceData.message ||
                  "Equipo añadido, pero no se pudo actualizar el estado de mantenimiento.",
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
            text: data.message || "Equipo añadido correctamente.",
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
          text: data.data || "Hubo un error al añadir el equipo.",
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
    }
  };

  const convertImageToBase64 = (imageFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/dev/get_equipment",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (data.responseCode === 200) {
          setEquipmentList(data.data);
        } else {
          setEquipmentList([]);
        }
      } catch {
        setEquipmentList([]);
      }
    };
    fetchEquipment();
  }, [token]);

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
            <option value="all">Todos</option>
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
                    value={selectedEquipment}
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
      )}
    </div>
  );
};

export default EquipmentManagement;
