class FormValidator {
    static validateFields(fields, formValues) {
        for (const field of fields) {
            const value = formValues[field.name];

            if (field.required && (!value || value.toString().trim() === "")) {
                return {
                    isValid: false,
                    message: `${field.label} es requerido.`,
                    field: field.name,
                };
            }

            if (field.name === "confirm_password") {
                const confirmPasswordValue = formValues.confirm_password || "";
                const passwordValue = formValues.password || "";
                if (confirmPasswordValue.trim() !== "" && confirmPasswordValue !== passwordValue) {
                    return {
                        isValid: false,
                        message: "Las contraseñas no coinciden.",
                        field: field.name,
                    };
                }
            }
        }
        return { isValid: true, message: "", field: null };
    }
}

export default FormValidator;
