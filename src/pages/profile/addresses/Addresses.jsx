import { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import apiFetch from "../../../utils/apiClient";
import { showAlert } from "../../../utils/generalTools";
import useAddressData from "../../../hooks/UseAddressData";
import EditableListSection from "../../../components/editableListSection/EditableListSection";
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
  const [selectedState, setSelectedState] = useState(null);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await apiFetch("/get_states");
        if (response.responseCode === 200) {
          setStates(
            response.data.map(({ state_id, state_name }) => ({
              value: state_id,
              label: state_name,
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
          response.data.map(({ city_id, city_name }) => ({
            value: city_id,
            label: city_name,
          }))
        );
      }
    } catch {
      showAlert("error", "Error", "Error al obtener ciudades.");
    } finally {
      setLoadingCities(false);
    }
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchCities(selectedState);
    }
  }, [selectedState, fetchCities]);

  const sectionConfig = [
    {
      id: "state_id",
      name: "state_name",
      label: "Departamento",
      type: "select",
      options: states,
      onChange: (e) => setSelectedState(e.target.value),
    },
    {
      id: "city_id",
      name: "city_name",
      label: "Ciudad",
      type: "select",
      options: cities,
      disabled: loadingCities || !selectedState,
    },
    {
      id: "address",
      name: "address",
      label: "Dirección",
      type: "text",
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="profile-section">
      <EditableListSection
        title="Direcciones"
        sectionData={addressData}
        sectionConfig={sectionConfig}
        onCheckChange={setAsPrimary}
        onAddItem={addAddress}
        onEditItem={updateAddress}
        onDeleteItem={deleteAddress}
        userId={userId}
      />
    </div>
  );
};

export default Addresses;
