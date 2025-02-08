const yup = require('yup');

const createProductsSchema = yup
    .object({
        name: yup
            .string()
            .required('El nombre es obligatorio')
            .min(3, 'El nombre debe tener al menos 3 caracteres'),
        description: yup
            .string()
            .required('Debe ser un descripcion válido')
            .min(10,'La descripcion es obligatoria'),
        price: yup
            .number()
            .positive('El precio debe ser un número positivo')
            .integer('El precio debe ser un número entero')
            .optional()
    })
    // Forzamos el modo estricto
    .strict()
    // Prohibimos campos no definidos
    .noUnknown(true, 'Solo se permiten los campos "name", "description" y "price"');


module.exports = {
    createProductsSchema
};

