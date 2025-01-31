const yup = require('yup');

    const createProducts14209140 = yup
    .object({
        name: yup
            .string()
            .required('El nombre es obligatorio')
            .min(3, 'El nombre debe tener al menos 3 carácteres'),
        type: yup
            .string()
            .required('El tipo de producto es obligatorio'),
        stock: yup
            .number()
            .positive('el stock debe ser un número positivo')
            .integer('La stock debe ser un número entero')
            .optional()
    })
    // Forzamos el modo estricto
    .strict()
    // Prohibimos campos no definidos
    .noUnknown(true, 'Solo se permiten los campos "name", "type" y "stock"');

module.exports = {
    createProducts14209140
};
