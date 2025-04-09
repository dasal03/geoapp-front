/**
 * Validator class for form validation.
 */
class Validator {
  /**
   * Constructor for the Validator class.
   * @param {Object} formValues - Current form values.
   */
  constructor(formValues) {
    this.formValues = formValues;

    this.regex = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^\+\d{1,3}\d{1,14}$/,
      username: /^[a-zA-Z0-9_]+$/,
    };

    this.messages = {
      required: (label) => `El campo ${label} es requerido.`,
      email: "Ingrese un correo electrónico válido.",
      phone: "Ingrese un número de teléfono válido.",
      username:
        "El nombre de usuario solo puede contener letras, números y guiones bajos (_).",
      passwordMatch: "Las contraseñas no coinciden.",
    };
  }

  /**
   * Validates a single form field.
   * @param {Object} field - Object representing a form field.
   * @param {string} field.name - Field name.
   * @param {string} [field.type] - Field type (e.g., "text", "email", "password", "phone", "date", "select").
   * @param {boolean} [field.required=false] - Whether the field is required.
   * @param {string} [field.label] - Field label for custom error messages.
   * @returns {Object} Validation result.
   * @returns {boolean} isValid - Indicates whether the field is valid.
   * @returns {string} message - Error message if the field is invalid.
   * @returns {string|null} field - Name of the field with an error, or null if the field is valid.
   */
  validateField(field) {
    const value = this.formValues[field.name]?.toString().trim() || "";

    if (field.required && !value) {
      return {
        isValid: false,
        message: this.messages.required(field.label || field.name),
        field: field.name,
      };
    }

    if (field.name === "confirm_password") {
      const confirmPasswordValue = this.formValues.confirm_password || "";
      const passwordValue = this.formValues.password || "";
      if (confirmPasswordValue && confirmPasswordValue !== passwordValue) {
        return {
          isValid: false,
          message: this.messages.passwordMatch,
          field: field.name,
        };
      }
    }

    if (field.type === "email" && !this.regex.email.test(value)) {
      return {
        isValid: false,
        message: this.messages.email,
        field: field.name,
      };
    }

    if (field.type === "phone" && !this.regex.phone.test(value)) {
      return {
        isValid: false,
        message: this.messages.phone,
        field: field.name,
      };
    }

    if (field.name === "username" && !this.regex.username.test(value)) {
      return {
        isValid: false,
        message: this.messages.username,
        field: field.name,
      };
    }

    return { isValid: true, message: "", field: null };
  }

  /**
   * Validates an entire form section.
   * @param {Array<Object>} sectionFields - List of objects representing the fields in the section.
   * @returns {Object} Validation result for the section.
   * @returns {boolean} isValid - Indicates wheter the section is valid.
   * @returns {string} message - Error message if any field in the section is invalid.
   * @returns {string|null} field - Name of the field with an error, or null if the section is valid.
   */
  validateSection(sectionFields) {
    let errors = {};
    let messages = [];

    for (const field of sectionFields) {
      const result = this.validateField(field);
      if (!result.isValid) {
        errors[field.name] = result.message;
        messages.push(result.message);
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      message: messages.join(" | "),
    };
  }

  /**
   * Validates a list of form sections.
   * @param {Array<Array<Object>>} fieldsList - List of sections, where each section is an array of fields.
   * @returns {Object} Validation result for the list.
   * @returns {boolean} isValid - Indicates whether all sections in the list are valid.
   * @returns {Array<Object>} errors - List of encountered validation errors.
   */
  validateList(fieldsList) {
    const errors = fieldsList
      .map((fields) => this.validateSection(fields))
      .filter((res) => !res.isValid);

    return errors.length > 0
      ? { isValid: false, errors }
      : { isValid: true, errors: [] };
  }
}

export default Validator;
