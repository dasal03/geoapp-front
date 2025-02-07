import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import apiFetch from "../../../utils/apiClient";
import { showAlert } from "../../../utils/generalTools";
import useAddressData from "../../../hooks/UseAddressData";
import EditableListSection from "../../../components/editableListSection/EditableListSection";
import AddressModal from "../../../components/modals/AddressModal";
import Loader from "../../../components/ui/loader/Loader";

const Addresses = () => {
  const { profileData } = useOutletContext();
  const userId = profileData?.user_id;

  const {
    loading,
    addressData,
    updateAddress,
    addAddress,
    deleteAddress,
    setAsPrimary,
  } = useAddressData(userId);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await apiFetch("/get_states");
        if (response.responseCode === 200) {
          setStates(
            response.data.map((state) => ({
              value: state.state_id,
              label: state.state_name,
            }))
          );
        }
      } catch {
        showAlert("error", "Error", "Error al conectar con el servidor.");
      }
    };
    fetchStates();
  }, []);

  const fetchCities = useCallback(async (stateId) => {
    setLoadingCities(true);
    try {
      const response = await apiFetch(`/get_cities?state_id=${stateId}`);
      if (response.responseCode === 200) {
        setCities(
          response.data.map((city) => ({
            value: city.city_id,
            label: city.city_name,
          }))
        );
      }
    } catch {
      showAlert("error", "Error", "Error al obtener ciudades.");
    } finally {
      setLoadingCities(false);
    }
  }, []);

  const sectionConfig = [
    {
      name: "state_name",
      label: "Departamento",
      type: "select",
      options: states,
    },
    {
      name: "city_name",
      label: "Ciudad",
      type: "select",
      options: cities,
      disabled: loadingCities,
    },
    {
      name: "address",
      label: "Dirección",
      type: "text",
      placeholder: "Dirección",
    },
  ];

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setIsModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="profile-section">
      <EditableListSection
        title="Direcciones"
        sectionData={addressData}
        sectionConfig={sectionConfig}
        onCheckChange={setAsPrimary}
        onEditItem={handleEditAddress}
        onDeleteItem={deleteAddress}
        handleAddItem={handleAddAddress}
      />

      <AddressModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        address={selectedAddress}
        onSave={(newAddress) => {
          if (selectedAddress) {
            updateAddress({
              ...newAddress,
              address_id: selectedAddress.address_id,
            });
          } else {
            addAddress(newAddress);
          }
          setIsModalOpen(false);
        }}
        states={states}
        cities={cities}
        fetchCities={fetchCities}
        userId={userId}
      />
    </div>
  );
};

export default Addresses;
