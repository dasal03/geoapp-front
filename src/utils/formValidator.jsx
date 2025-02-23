class Validator {
  constructor(formValues) {
    this.formValues = formValues;

    this.regex = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^\+\d{1,3}\d{1,14}$/,
      username: /^[a-zA-Z0-9_]+$/,
    };

    this.messages = {
      required: () => "Este campo es obligatorio.",
      email: "Ingrese un correo electrónico válido.",
      phone: "Ingrese un número de teléfono válido.",
      username:
        "El nombre de usuario debe contener solo letras, números y guiones bajos (_).",
      passwordMatch: "Las contraseñas no coinciden.",
    };
  }

  validateField(field) {
    const value = this.formValues[field.name]?.toString().trim() || "";

    if (field.required && !value) {
      return {
        isValid: false,
        message: this.messages.required(field.label),
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

  validateSection(sectionFields) {
    for (const field of sectionFields) {
      const result = this.validateField(field);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true, message: "", field: null };
  }
}

export default Validator;
