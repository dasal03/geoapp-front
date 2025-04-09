import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { capitalizeText } from "../utils/generalTools";
import apiFetch from "../utils/apiClient";
import Validator from "../utils/formValidator";
import { useAlert } from "../context/alertProvider";

const CE = 2,
  PPT = 3;

const useRegister = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState("first");
  const [formValues, setFormValues] = useState({});
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [genders, setGenders] = useState([]);
  const [issueCountries, setIssueCountries] = useState([]);
  const [issueStates, setIssueStates] = useState([]);
  const [issueCities, setIssueCities] = useState([]);

  const { showAlert } = useAlert();

  const mapData = (data, key, label) =>
    data.map((item) => ({
      value: item[key],
      label: item[label],
    }));

  const fetchData = useCallback(
    async (url, setData, mapper = (data) => data) => {
      try {
        const response = await apiFetch(url);
        if (response.responseCode === 200) setData(mapper(response.data));
        else if (response.responseCode === 404) setData([]);
        else showAlert("error", "Error", response.description);
      } catch {
        showAlert("error", "Error", "Error al conectar con el servidor.");
      }
    },
    [showAlert]
  );

  useEffect(() => {
    fetchData("/get_document_types", setDocumentTypes, (data) =>
      mapData(data, "document_type_id", "description")
    );
    fetchData("/get_genders", setGenders, (data) =>
      mapData(data, "gender_id", "gender_name")
    );
    fetchData("/get_countries", setIssueCountries, (data) =>
      mapData(data, "country_id", "country_name")
    );
    fetchData("/get_states", setIssueStates, (data) =>
      mapData(data, "state_id", "state_name")
    );
  }, [fetchData]);

  useEffect(() => {
    if (formValues.state_of_issue_id) {
      fetchData(
        `/get_cities?state_id=${formValues.state_of_issue_id}`,
        setIssueCities,
        (data) => mapData(data, "city_id", "city_name")
      );
      setFormValues((prev) => ({ ...prev, city_of_issue_id: "" }));
    } else {
      setIssueCities([]);
      setFormValues((prev) => ({ ...prev, city_of_issue_id: "" }));
    }
  }, [formValues.state_of_issue_id, fetchData]);

  const identityFields = useMemo(() => {
    const docType = Number(formValues.document_type_id);
    return [
      {
        label: "Tipo de Documento",
        type: "select",
        value: formValues.document_type_id || "",
        name: "document_type_id",
        options: documentTypes,
        required: true,
      },
      {
        label: "Número de Documento",
        type: "text",
        value: formValues.document_number || "",
        placeholder: "Ingrese su número de documento",
        name: "document_number",
        required: true,
      },
      ...(docType === PPT || docType === CE
        ? [
            {
              label: "País de Emisión",
              type: "select",
              value: formValues.country_of_issue_id || "",
              name: "country_of_issue_id",
              options: issueCountries,
              required: true,
            },
            {
              label: "Fecha de Expedición",
              type: "date",
              value: formValues.date_of_issue || "",
              name: "date_of_issue",
              required: true,
            },
            {
              label: "Fecha de Vencimiento",
              type: "date",
              value: formValues.date_of_expiry || "",
              name: "date_of_expiry",
              required: true,
            },
          ]
        : [
            {
              label: "Departamento de Expedición",
              type: "select",
              value: formValues.state_of_issue_id || "",
              name: "state_of_issue_id",
              options: issueStates,
              required: true,
            },
            {
              label: "Ciudad de Expedición",
              type: "select",
              value: formValues.city_of_issue_id || "",
              name: "city_of_issue_id",
              options: issueCities,
              disabled:
                isLoading ||
                !formValues.state_of_issue_id ||
                issueCities.length === 0,
              required: true,
            },
            {
              label: "Fecha de Expedición",
              type: "date",
              value: formValues.date_of_issue || "",
              name: "date_of_issue",
              required: true,
            },
          ]),
    ];
  }, [
    formValues,
    documentTypes,
    issueCountries,
    issueStates,
    issueCities,
    isLoading,
  ]);

  const formFieldsSections = useMemo(
    () => ({
      first: [
        {
          label: "Nombres",
          type: "text",
          value: formValues.first_name || "",
          placeholder: "Ingrese sus nombres",
          name: "first_name",
          required: true,
        },
        {
          label: "Apellidos",
          type: "text",
          value: formValues.last_name || "",
          placeholder: "Ingrese sus apellidos",
          name: "last_name",
          required: true,
        },
        {
          label: "Número de Teléfono",
          type: "phone",
          value: formValues.phone_number || "",
          placeholder: "Ingrese su teléfono",
          name: "phone_number",
          required: true,
        },
        {
          label: "Fecha de Nacimiento",
          type: "date",
          value: formValues.date_of_birth || "",
          name: "date_of_birth",
          required: true,
        },
        {
          label: "Género",
          type: "select",
          value: formValues.gender_id || "",
          name: "gender_id",
          options: genders,
          required: true,
        },
        {
          label: "Correo electrónico",
          type: "email",
          value: formValues.email || "",
          placeholder: "Ingrese su correo",
          name: "email",
          required: true,
        },
      ],
      second: identityFields,
      third: [
        {
          label: "Nombre de Usuario",
          type: "text",
          value: formValues.username || "",
          placeholder: "Ingrese su usuario",
          name: "username",
          required: true,
        },
        {
          label: "Contraseña",
          type: "password",
          value: formValues.password || "",
          placeholder: "Ingrese su contraseña",
          name: "password",
          required: true,
        },
        {
          label: "Confirmar Contraseña",
          type: "password",
          value: formValues.confirm_password || "",
          placeholder: "Confirme su contraseña",
          name: "confirm_password",
          required: true,
        },
      ],
    }),
    [formValues, genders, identityFields]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validator = new Validator(formValues);
    const currentFields = formFieldsSections[activeForm];
    const validation = validator.validateSection(currentFields);

    if (!validation.isValid) {
      setFormError({ field: validation.field, message: validation.message });
      return;
    }

    setIsLoading(true);
    try {
      const userResponse = await apiFetch("/create_user", {
        method: "POST",
        body: JSON.stringify(formValues),
      });

      if (userResponse.responseCode === 201) {
        showAlert("success", "Éxito", "Usuario creado exitosamente.");
        navigate("/login");
      } else {
        showAlert("error", "Error", userResponse.description);
      }
    } catch (error) {
      showAlert("error", "Error", "Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = useCallback(
    (fieldName, eventOrValue) => {
      let value = eventOrValue?.target?.value ?? eventOrValue ?? "";
      const textFields = [
        "first_name",
        "last_name",
        "email",
        "alternative_email",
        "username",
      ];
      if (textFields.includes(fieldName)) {
        value = capitalizeText(value);
      }

      setFormValues((prev) => {
        const newValues = { ...prev, [fieldName]: value };

        const allFields = Object.values(formFieldsSections).flat();
        const field = allFields.find((f) => f.name === fieldName);

        if (field?.required && !value.trim()) {
          setFormError({
            field: fieldName,
            message: `${field.label} es obligatorio`,
          });
        } else if (formError.field === fieldName) {
          setFormError({});
        }

        if (["password", "confirm_password"].includes(fieldName)) {
          if (
            newValues.confirm_password &&
            newValues.password !== newValues.confirm_password
          ) {
            setFormError({
              field: "confirm_password",
              message: "Las contraseñas no coinciden",
            });
          } else if (formError.field === "confirm_password") {
            setFormError({});
          }
        }
        return newValues;
      });

      const allFields = Object.values(formFieldsSections).flat();
      const field = allFields.find((f) => f.name === fieldName);

      if (field) {
        const fieldValidator = new Validator({ [fieldName]: value });
        const validation = fieldValidator.validateField(field);

        if (!validation.isValid) {
          setFormError({ field: fieldName, message: validation.message });
        } else if (formError.field === fieldName) {
          setFormError({});
        }
      }
    },
    [formFieldsSections, formError]
  );

  const handlePhoneChange = useCallback((value) => {
    setFormValues((prev) => ({ ...prev, phone_number: value }));
  }, []);

  const handleFormSwitch = (direction) => {
    const currentFields = Array.isArray(formFieldsSections[activeForm])
      ? formFieldsSections[activeForm]
      : [];
    const validator = new Validator(formValues);
    const validation = validator.validateSection(currentFields);

    if (!validation.isValid) {
      setFormError({ field: validation.field, message: validation.message });
      return;
    }

    if (direction === "next") {
      setActiveForm((prev) => (prev === "first" ? "second" : "third"));
    } else {
      setFormError({ field: validation.field, message: validation.message });
    }

    window.scrollTo(0, 0);
  };

  return {
    isLoading,
    activeForm,
    formValues,
    formError,
    formFieldsSections,
    handleSubmit,
    handleChange,
    handlePhoneChange,
    handleFormSwitch,
  };
};

export default useRegister;
