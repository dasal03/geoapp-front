import { useSearchParams } from "react-router-dom";
import { useProfileData } from "../../../hooks";
import { FormSection } from "../../../components";
import { Loader } from "../../../components/ui";
import { useAlert } from "../../../context/alertProvider";

const PersonalInfo = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const { profileData, updateProfile, loading } = useProfileData(userId);
  const { showAlert } = useAlert();

  if (!profileData && !loading) return <Loader />;

  const sectionConfig = {
    title: "Información Personal",
    fields: [
      {
        name: "full_name",
        label: "Nombre Completo",
        type: "text",
        disabled: true,
      },
      {
        name: "phone_number",
        label: "Número Telefonico",
        type: "phone",
        required: true,
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
        options: profileData?.gender_name,
        disabled: true,
      },
      {
        name: "document_type",
        label: "Tipo de Documento",
        type: "select",
        options: profileData?.document_type,
        disabled: true,
      },
      {
        name: "document_number",
        label: "Número de Documento",
        type: "text",
        disabled: true,
      },
      {
        name: "state_of_issue",
        label: "Departamento de Expedición",
        type: "select",
        options: profileData?.state_of_issue,
        disabled: true,
      },
      {
        name: "city_of_issue",
        label: "Ciudad de Expedición",
        type: "select",
        options: profileData?.city_of_issue,
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

  const handleSave = async (finalData) => {
    try {
      await updateProfile(finalData);
      showAlert("success", "Éxito", "Información actualizada exitosamente");
    } catch (error) {
      console.error("Error en updateProfile", error);
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

export default PersonalInfo;
