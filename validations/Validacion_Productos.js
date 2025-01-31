const yup = require('yup');

// Esquema de validación del producto
const createProductoSchema = yup
    .object({
        Nombre: yup
            .string()
            .required('El nombre del producto es obligatorio')
            .min(3, 'El nombre debe tener al menos 3 caracteres'),
        Precio: yup
            .number()
            .required('El precio es obligatorio')
            .positive('El precio debe ser un número positivo')
            .typeError('El precio debe ser un número válido'),
    })
    .strict()
    .noUnknown(true, 'Solo se permiten los campos "Nombre" y "Precio"');

module.exports = {
    createProductoSchema
};