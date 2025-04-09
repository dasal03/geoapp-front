import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Validator from "../../../../utils/formValidator";
import { useAddressData } from "../../../../hooks";
import { NoData } from "../../../../components";
import { InputField, Button } from "../../../../components/ui";
import { AddressAutofill } from "@mapbox/search-js-react";
import "./AddressesForm.scss";

const SkeletonLoader = () => (
  <div className="addresses-form-container">
    <div className="skeleton-form">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="skeleton-field">
          <div className="skeleton-label"></div>
          <div className="skeleton-input"></div>
        </div>
      ))}
      <div className="skeleton-buttons">
        <div className="skeleton-btn"></div>
        <div className="skeleton-btn"></div>
      </div>
    </div>
  </div>
);

const AddressesForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user_id");
  const addressId = searchParams.get("address_id");
  const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

  const { addAddress, updateAddress, addressesData, loading } = useAddressData(
    userId,
    addressId
  );
  const [formData, setFormData] = useState({
    address_id: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postcode: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const addressInputRef = useRef(null);

  useEffect(() => {
    if (addressId && addressesData.length > 0) {
      setFormData(addressesData[0]);
    }
  }, [addressId, addressesData]);

  useEffect(() => {
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      el?.focus();
    }
  }, [errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() ? undefined : prevErrors[name],
    }));
  };

  const validateAndSubmit = async (e) => {
    e.preventDefault();
    if (!userId || saving) return;

    const validator = new Validator(formData);
    const validationResults = validator.validateSection([
      { name: "address", required: true, label: "Dirección" },
      { name: "apartment", required: true, label: "Apartamento" },
      { name: "city", required: true, label: "Ciudad" },
      { name: "state", required: true, label: "Departamento" },
      { name: "postcode", required: true, label: "Código postal" },
      { name: "description", required: true, label: "Descripción" },
    ]);

    if (!validationResults.isValid) {
      setErrors(validationResults.errors);
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        user_id: userId,
        full_address: `${formData.address} - ${formData.apartment}`,
      };
      delete payload.id;

      formData.address_id
        ? await updateAddress(payload)
        : await addAddress(payload);
      navigate("/profile/addresses");
    } catch (error) {
      console.error("❌ Error al guardar la dirección", error);
    } finally {
      setSaving(false);
    }
  };

  if (addressId && loading) return <SkeletonLoader />;

  return (
    <div className="addresses-form-container">
      {addressId && loading ? (
        <SkeletonLoader />
      ) : addressId && !loading && addressesData.length === 0 ? (
        <NoData
          title="Dirección no encontrada"
          message="No pudimos recuperar la información de esta dirección. Es posible que haya sido eliminada o no esté disponible."
          icon="fas fa-map-marker-alt bounce"
        >
          <Button
            text="Volver"
            icon="fas fa-arrow-left"
            styleType="cancel-btn outlined"
            onClick={() => navigate("/profile/addresses")}
          />
        </NoData>
      ) : (
        <form onSubmit={validateAndSubmit}>
          <div className="address-autofill full-width field-wrapper">
            <label htmlFor="address" className="field-label">
              Dirección
            </label>
            <AddressAutofill
              accessToken={MAPBOX_ACCESS_TOKEN}
              onRetrieve={(result) => {
                const {
                  address_line1,
                  address_level1,
                  address_level2,
                  postal_code,
                } = result.features[0].properties;
                setFormData((prev) => ({
                  ...prev,
                  address: address_line1 || prev.address,
                  state: address_level1 || prev.state,
                  city: address_level2 || prev.city,
                  postcode: postal_code || prev.postcode,
                }));
              }}
            >
              <InputField
                id="address"
                ref={addressInputRef}
                name="address"
                placeholder="Dirección"
                autoComplete="address-line1"
                onChange={handleChange}
                value={formData.address}
              />
            </AddressAutofill>
            {errors.address && (
              <span className="error-message">{errors.address}</span>
            )}
          </div>

          {[
            {
              name: "apartment",
              placeholder: "Número de apartamento",
              autoComplete: "address-line2",
            },
            {
              name: "state",
              placeholder: "Departamento",
              autoComplete: "address-level1",
              disabled: true,
            },
            {
              name: "city",
              placeholder: "Ciudad",
              autoComplete: "address-level2",
              disabled: true,
            },
            {
              name: "postcode",
              placeholder: "Código postal",
              autoComplete: "postal-code",
              disabled: true,
            },
            { name: "description", placeholder: "Descripción" },
          ].map(({ name, placeholder, autoComplete, disabled }) => (
            <div
              key={name}
              className={`field-wrapper ${errors[name] ? "error" : ""}`}
            >
              <label htmlFor={name} className="field-label">
                {placeholder}
              </label>
              <InputField
                name={name}
                placeholder={placeholder}
                autoComplete={autoComplete}
                onChange={handleChange}
                value={formData[name]}
                disabled={disabled}
              />
              {errors[name] && (
                <span className="error-message">{errors[name]}</span>
              )}
            </div>
          ))}

          <div className="buttons full-width">
            <Button
              type="submit"
              text={
                saving
                  ? "Guardando..."
                  : formData.address_id
                  ? "Actualizar"
                  : "Guardar"
              }
              icon="fas fa-save"
              styleType="save-btn"
              onClick={validateAndSubmit}
              disabled={saving}
            />

            <Button
              type="button"
              text="Cancelar"
              icon="fas fa-times"
              styleType="cancel-btn"
              onClick={() => navigate("/profile/addresses")}
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default AddressesForm;
