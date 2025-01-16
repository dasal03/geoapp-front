import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import useAddressData from "../../../hooks/UseAddressData";
import Loader from "../../../components/loading/LoadingSpinner";
import EditableListSection from "../../../components/editableListSection/EditableListSection";

const Addresses = () => {
  const { profileData } = useOutletContext();

  const {
    addressData,
    loading,
    updateAddress,
    addAddress,
    deleteAddress,
    setAsPrimary,
  } = useAddressData(profileData?.user_id);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (Array.isArray(addressData) && addressData.length > 0) {
      setStates([{ state_id: 1, state_name: "Atlántico" }]);
      setCities([{ city_id: 1, city_name: "Barranquilla" }]);
    }
  }, [addressData]);

  if (!profileData?.user_id) {
    return <Loader />;
  }

  const sectionConfig = [
    {
      label: "Departamento",
      name: "state_name",
      type: "select",
      options: states.map((state) => ({
        value: state.state_id,
        label: state.state_name,
      })),
    },
    {
      label: "Ciudad",
      name: "city_name",
      type: "select",
      options: cities.map((city) => ({
        value: city.city_id,
        label: city.city_name,
      })),
    },
    {
      label: "Dirección",
      name: "address",
      type: "text",
    },
  ];

  const formattedAddressData = Array.isArray(addressData)
    ? addressData.map((address) => ({
        ...address,
        state_name: address.state_name || "",
        city_name: address.city_name || "",
      }))
    : [];

  return (
    <div className="profile-section">
      <EditableListSection
        title="Direcciones"
        sectionData={formattedAddressData}
        sectionConfig={sectionConfig}
        loading={loading}
        onAddItem={addAddress}
        onEditItem={updateAddress}
        onDeleteItem={deleteAddress}
        onSetPrimaryItem={setAsPrimary}
      />
    </div>
  );
};

export default Addresses;
