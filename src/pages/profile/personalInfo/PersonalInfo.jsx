import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { showAlert } from "../../../utils/generalTools";
import apiFetch from "../../../utils/apiClient";
import FormSection from "../../../components/formSection/FormSection";
import Loader from "../../../components/ui/loader/Loader";

const PersonalInfo = () => {
  const { profileData } = useOutletContext();
  const [isLoading, setIsLoading] = useState(false);

  if (!profileData) {
    return <Loader />;
  }

  const sectionConfig = {
    title: "Información Personal",
    fields: [
      {
        name: "full_name",
        label: "Nombre Completo",
        placeholder: "Nombre Completo",
        type: "text",
        disabled: true,
      },
      {
        name: "phone_number",
        label: "Número Telefonico",
        placeholder: "Numero Telefonico",
        type: "phone",
      },
      {
        name: "date_of_birth",
        label: "Fecha de Nacimiento",
        type: "date",
        disabled: true,
      },
      {
        name: "gender_name",
        label: "Género",
        type: "select",
        options: profileData.gender_name,
        disabled: true,
      },
      {
        name: "document_type",
        label: "Tipo de Documento",
        type: "select",
        options: profileData.document_type,
        disabled: true,
      },
      {
        name: "document_number",
        label: "Número de Documento",
        placeholder: "Numero de Documento",
        type: "text",
        disabled: true,
      },
      {
        name: "state_of_issue",
        label: "Departamento de Expedición",
        type: "select",
        options: profileData.state_of_issue,
        disabled: true,
      },
      {
        name: "city_of_issue",
        label: "Ciudad de Expedición",
        type: "select",
        options: profileData.city_of_issue,
        disabled: true,
      },
      {
        name: "date_of_issue",
        label: "Fecha de Expedición",
        type: "date",
        disabled: true,
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

export default PersonalInfo;
