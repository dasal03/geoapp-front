import { useNavigate, useOutletContext } from "react-router-dom";
import EditableListSection from "../../../components/editableListSection/EditableListSection";
import Loader from "../../../components/ui/loader/Loader";
import useAddressData from "../../../hooks/UseAddressData";

const Addresses = () => {
  const navigate = useNavigate();
  const { profileData } = useOutletContext();
  const userId = profileData?.user_id;

  const { loading, addressData, deleteAddress, setAsPrimary } =
    useAddressData(userId);

  if (loading) return <Loader />;

  const sectionConfig = [
    {
      name: "state",
      label: "Departamento",
    },
    {
      name: "city",
      label: "Ciudad",
    },
    {
      name: "full_address",
      label: "Dirección",
    },
    {
      name: "postcode",
      label: "Código Postal",
    },
    {
      name: "description",
      label: "Descripción",
    },
  ];

  return (
    <div className="profile-section">
      <EditableListSection
        title="Direcciones"
        sectionData={addressData}
        sectionConfig={sectionConfig}
        onCheckChange={setAsPrimary}
        onAddItem={() => navigate(`/profile/addresses-form?user_id=${userId}`)}
        onEditItem={(item) =>
          navigate(
            `/profile/addresses-form?user_id=${userId}&address_id=${item.id}`
          )
        }
        onDeleteItem={deleteAddress}
      />
    </div>
  );
};

export default Addresses;
