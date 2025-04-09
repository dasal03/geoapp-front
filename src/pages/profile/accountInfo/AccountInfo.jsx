import { useSearchParams } from "react-router-dom";
import { useProfileData } from "../../../hooks";
import { FormSection } from "../../../components";
import { Loader } from "../../../components/ui";
import { useAlert } from "../../../context/alertProvider";

const AccountInfo = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const { profileData, updateProfile, loading } = useProfileData(userId);
  const { showAlert } = useAlert();

  if (!profileData && !loading) return <Loader />;

  const sectionConfig = {
    title: "Datos de tu Cuenta",
    fields: [
      {
        name: "username",
        label: "Nombre de Usuario",
        type: "text",
        required: true,
      },
      {
        name: "email",
        label: "Correo Electrónico",
        type: "text",
        required: true,
      },
      {
        name: "alternative_email",
        label: "Correo Electrónico Alternativo",
        type: "text",
      },
    ],
  };

  const handleSave = async (finalData) => {
    try {
      console.log("Enviando datos:", finalData);

      const response = await updateProfile(finalData);

      if (response?.success) {
        showAlert("success", "Éxito", "Información actualizada exitosamente");
      } else {
        throw new Error(response?.message || "Error en la actualización");
      }
    } catch (error) {
      console.error("Error en updateProfile", error);
      showAlert(
        "error",
        "Error",
        error.message || "No se pudo actualizar la información"
      );
    }
  };

  return (
    <div className="profile-section">
      <FormSection
        section={sectionConfig}
        initialData={profileData}
        onSave={handleSave}
        loading={loading}
      />
    </div>
  );
};

export default AccountInfo;
