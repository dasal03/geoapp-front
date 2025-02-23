import { useState, useCallback } from "react";
import useManagementData from "../../hooks/UseManagementData";
import SectionActions from "../../components/sectionActions/SectionActions";
import Button from "../../components/ui/button/Button";
import DynamicModal from "../../components/modals/DynamicModal";
import Loader from "../../components/ui/loader/Loader";
import "./Management.scss";

function Management() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedManagement, setSelectedManagement] = useState(null);
  const {
    loading,
    managementData,
    addManagement,
    updateManagement,
    deleteManagement,
  } = useManagementData();

  const openModal = useCallback((management = null) => {
    setSelectedManagement(management);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedManagement(null);
  }, []);

  const handleSave = useCallback(
    (newData) => {
      if (selectedManagement) {
        updateManagement?.({ ...selectedManagement, ...newData });
      } else {
        addManagement?.(newData);
      }
      closeModal();
    },
    [addManagement, updateManagement, selectedManagement, closeModal]
  );

  if (loading) return <Loader />;

  return (
    <section
      className={`management-container ${
        managementData.length > 0 ? "has-items" : "empty"
      }`}
    >
      <h3 className="section-title">Gestión de Equipos</h3>
      <div className="managements-list">
        {managementData.length > 0 ? (
          managementData.map((management) => (
            <div
              key={management.id || management.name}
              className="management-item"
            >
              <div className="item-info">
                <span>{management.name}</span>
              </div>
              <SectionActions
                onEdit={() => openModal(management)}
                onDelete={() => deleteManagement?.(management.id)}
                hideText
              />
            </div>
          ))
        ) : (
          <p className="no-data">No hay equipos registrados.</p>
        )}
        <Button
          text="Nuevo Equipo"
          icon="fa fa-plus"
          onClick={() => openModal()}
          styleType="add-item-btn"
        />
      </div>

      {isModalOpen && (
        <DynamicModal
          open={isModalOpen}
          onClose={closeModal}
          data={selectedManagement}
          onSave={handleSave}
          fields={managementData}
          title={selectedManagement ? "Editar Equipo" : "Crear Equipo"}
        />
      )}
    </section>
  );
}

export default Management;
