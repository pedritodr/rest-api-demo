const yup = require('yup');

const createProductsSchema = yup
    .object({
        name: yup
            .string()
            .required('el nombre es obligatorio')
            .min(3, 'El nombre debe tener al menos 3 caracteres'),
        description: yup
            .string()
            .required('Debe ser una descripcion válido')
            .min(10,'la descripcion es obligatoria'),
        price: yup
            .number()
            .positive('el precio debe ser un número positivo')
            .optional()
    })
    // Forzamos el modo estricto
    .strict()
    // Prohibimos campos no definidos
    .noUnknown(true, 'Solo se permiten los campos "name", "description" y "price"');


module.exports = {
    createProductsSchema
};
