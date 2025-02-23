import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import FormSection from "../../../components/formSection/FormSection";
import Loader from "../../../components/ui/loader/Loader";

const AccountInfo = () => {
  const { profileData, updateProfile } = useOutletContext();
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
        name: "alternative_email",
        label: "Correo Electrónico Alternativo",
        type: "text",
        placeholder: "Correo Electrónico Alternativo",
      },
    ],
  };

  const handleSave = async (finalData) => {
    setIsLoading(true);
    try {
      await updateProfile(finalData);
    } catch (error) {
      console.error("Error en updateProfile", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-section">
      {isLoading ? (
        <Loader />
      ) : (
        <FormSection
          section={sectionConfig}
          initialData={profileData}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AccountInfo;
