import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { showAlert } from "../../../utils/generalTools";
import apiFetch from "../../../utils/apiClient";
import FormSection from "../../../components/formSection/FormSection";
import Loader from "../../../components/ui/loader/Loader";

const AccountInfo = () => {
  const { profileData } = useOutletContext();
  const [isLoading, setIsLoading] = useState(false);

  if (!profileData) {
    return <Loader />;
  }

  const sectionConfig = {
    title: "Datos de tu Cuenta",
    fields: [
      {
        name: "username",
        label: "Nombre de Usuario",
        type: "text",
        placeholder: "Nombre de Usuario",
      },
      {
        name: "email",
        label: "Correo Electrónico",
        type: "text",
        placeholder: "Correo Electrónico",
      },
      {
        name: "email", // change this to "alternative_email"
        label: "Correo Electrónico Alternativo",
        type: "text",
        placeholder: "Correo Electrónico Alternativo",
      },
    ],
  };

  const handleSave = async (updatedData) => {
    setIsLoading(true);

    try {
      const response = await apiFetch("/update_user", {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });

      if (response.responseCode === 200) {
        showAlert(
          "success",
          "Actualizado",
          "Información actualizada con éxito."
        );
      } else {
        showAlert("error", "Error", response.description);
      }
    } catch (error) {
      console.error("Error al actualizar la información:", error);
      showAlert("error", "Error", "No se pudo actualizar la información.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-section">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <FormSection
            section={sectionConfig}
            initialData={profileData}
            onSave={handleSave}
            userId={profileData.user_id}
          />
        </>
      )}
    </div>
  );
};

export default AccountInfo;
