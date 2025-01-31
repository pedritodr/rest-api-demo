const yup = require('yup');

const createUserSchema = yup
    .object({
        name: yup
            .string()
            .required('El nombre es obligatorio')
            .min(3, 'El nombre debe tener al menos 3 caracteres'),
        email: yup
            .string()
            .email('Debe ser un correo electrónico válido')
            .required('El correo electrónico es obligatorio'),
        age: yup
            .number()
            .positive('La edad debe ser un número positivo')
            .integer('La edad debe ser un número entero')
            .optional()
    })
    // Forzamos el modo estricto
    .strict()
    // Prohibimos campos no definidos
    .noUnknown(true, 'Solo se permiten los campos "name", "email" y "age"');

module.exports = {
    createUserSchema
};
