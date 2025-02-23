import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AddressAutofill } from "@mapbox/search-js-react";
import useAddressData from "../../../hooks/UseAddressData";
import InputField from "../../../components/ui/inputField/InputField";
import Loader from "../../../components/ui/loader/Loader";
import "./AddressesForm.scss";

const AddressesForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const addressId = searchParams.get("address_id");

  const { addAddress, updateAddress, fetchAddressData } = useAddressData(
    userId,
    addressId
  );
  const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

  const [isFetching, setIsFetching] = useState(false);

  const [formData, setFormData] = useState({
    address_id: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postcode: "",
    description: "",
  });

  const addressInputRef = useRef(null);

  useEffect(() => {
    if (addressId) {
      setIsFetching(true);
      fetchAddressData(addressId)
        .then((data) => {
          const addressData = Array.isArray(data) ? data[0] : data;
          setFormData({
            address_id: addressData.address_id,
            address: addressData.address,
            apartment: addressData.apartment,
            city: addressData.city,
            state: addressData.state,
            postcode: addressData.postcode,
            description: addressData.description,
          });
        })
        .catch((error) =>
          console.error("Error al cargar la dirección para editar:", error)
        )
        .finally(() => setIsFetching(false));
    }
  }, [addressId, fetchAddressData]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name.includes("address-search")) {
      name = "address";
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) return;

    const payload = { ...formData, user_id: userId };

    try {
      if (!formData.address_id) {
        await addAddress(payload);
      } else {
        await updateAddress(payload);
      }
      navigate("/profile/addresses");
    } catch (error) {
      console.error("❌ Error al guardar la dirección", error);
    }
  };

  useEffect(() => {
    if (window && window.mapbox && addressInputRef.current) {
    }
  }, []);

  if (isFetching) return <Loader />;

  return (
    <div className="addresses-form-container">
      <form onSubmit={handleSubmit}>
        <div className="address-autofill-wrapper full-width">
          <AddressAutofill accessToken={MAPBOX_ACCESS_TOKEN}>
            <InputField
              ref={addressInputRef}
              name="address"
              placeholder="Dirección"
              autoComplete="address-line1"
              onChange={handleChange}
              value={formData.address}
            />
          </AddressAutofill>
        </div>

        <InputField
          name="apartment"
          placeholder="Número de apartamento"
          autoComplete="address-line2"
          onChange={handleChange}
          value={formData.apartment}
        />
        <InputField
          name="state"
          placeholder="Departamento"
          autoComplete="address-level1"
          onChange={handleChange}
          value={formData.state}
          disabled={true}
        />
        <InputField
          name="city"
          placeholder="Ciudad"
          autoComplete="address-level2"
          onChange={handleChange}
          value={formData.city}
          disabled={true}
        />
        <InputField
          name="postcode"
          placeholder="Código postal"
          autoComplete="postal-code"
          onChange={handleChange}
          value={formData.postcode}
          disabled={true}
        />

        <InputField
          name="description"
          placeholder="Descripción"
          onChange={handleChange}
          value={formData.description}
        />

        <div className="buttons full-width">
          <button type="submit" className="save-btn">
            {formData.address_id ? "Actualizar" : "Guardar"}
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/profile/addresses")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressesForm;
