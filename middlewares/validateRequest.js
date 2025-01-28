
const validateRequest = (schema) => async (req, res, next) => {
    try {
        console.log("🚀 ~ validateRequest ~ req.body:", req.body)
        // "abortEarly: false" hace que Yup retorne todos los errores y no se detenga en el primero
        await schema.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        console.log("🚀 ~ validateRequest ~ error:", error)
        return res.status(400).json({
            message: 'Errores de validación',
            errors: error.errors
        });
    }
};

module.exports = validateRequest;
