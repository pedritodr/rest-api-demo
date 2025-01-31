const yup = require('yup');

// Esquema de validación del producto
const createProductSchema = yup
    .object({
        name: yup
            .string()
            .required('El nombre del producto es obligatorio')
            .min(3, 'El nombre debe tener al menos 3 caracteres'),
        price: yup
            .number()
            .required('El precio es obligatorio')
            .positive('El precio debe ser un número positivo')
            .typeError('El precio debe ser un número válido'),
    })// Forzamos el modo estricto
    .strict()
    // Prohibimos campos no definidos
    .noUnknown(true, 'Solo se permiten los campos "name" y "price"');

module.exports = {
    createProductSchema
};