const express = require('express');
const sequelize = require('./config/database');
const validateRequest = require('./middlewares/validateRequest');
const User = require('./models/user')
const { createUserSchema } = require('./validations/userValidation')
const Product = require("./models/product")
const { createProductSchema } = require('./validations/productValidation')
const bodyParser = require('body-parser')
// A partir de Express 4.16, no es necesario usar body-parser, 
// pues podemos usar express.json() y express.urlencoded() directamente.

const app = express();


// =======================
// Middlewares
// =======================

/**
 * Un middleware es básicamente una función que se ejecuta entre la recepción de la solicitud (request)
 * y el envío de la respuesta (response). Tiene acceso a la solicitud, la respuesta y a la siguiente 
 * función de middleware en la cadena. 
 *
 * Aquí, express.json() se encarga de tomar el cuerpo (body) de las peticiones con formato JSON 
 * y convertirlo en un objeto JavaScript accesible desde req.body.
 */
app.use(express.json());
app.use(bodyParser.json());

// =======================
// Rutas
// =======================
/**
 * Las rutas controlan la lógica de negocio para cada endpoint.
 * Por convención, muchos APIs usan rutas en plural (ej. /users) en lugar de /user.
 * Dependerá del criterio o las buenas prácticas de tu proyecto.
 */

app.get('/users', async (req, res) => {
    console.log('Obtener lista de usuarios');
    // Aquí iría la lógica para obtener la lista de usuarios desde la base de datos.
    const users = await User.findAll({
        where: {
            isDelete: false,
        },
    });
    res.json({ message: 'Ok', data: users });
});

app.post('/users', validateRequest(createUserSchema), async (req, res) => {
    console.log('Crear un nuevo usuario');

    // Extraemos datos desde req.body
    const { name, email, age } = req.body;

    try {
        const user = await User.findOne({ where: { email, isDelete: false } })

        if (user) res.status(400).json({ message: `Existe un usuario con el email ${email}` })

        const newUser = await User.create({ name, email, age });

        res.json({
            message: 'Usuario creado exitosamente',
            data: newUser,

        });
    } catch (error) {
        console.log("🚀 ~ app.post ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }

});

app.get('/users/:id', async (req, res) => {
    console.log('Obtener usuario por ID');

    const { id } = req.params;

    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }

        // Lógica para buscar usuario por ID en la base de datos.
        const user = await User.findOne({ where: { id, isDelete: false } });

        if (!user) {
            res.status(400).json({ message: `El usuario del ID :${id} no existe`, code: "ERROR" })
        }

        res.json({
            message: 'Detalles del usuario',
            data: user,
        });
    } catch (error) {
        console.log("🚀 ~ app.get ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }

});

app.put('/users/:id', validateRequest(createUserSchema), async (req, res) => {
    console.log('Actualizar un usuario por ID');

    const { id } = req.params;
    const { name, email, age } = req.body;


    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }

        // Lógica para buscar usuario por ID en la base de datos.
        const user = await User.findByPk(id);

        if (!user) {
            res.status(400).json({ message: `El usuario del ID :${id} no existe`, code: "ERROR" })
        }

        await User.update({ name, email, age }, { where: { id } });

        res.json({
            message: 'Usuario actualizado exitosamente',
        });

    } catch (error) {
        console.log("🚀 ~ app.put ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }
});

app.delete('/users/:id', async (req, res) => {
    console.log('Eliminar un usuario por ID');

    const { id } = req.params;
    // Lógica para eliminar el usuario de la base de datos.
    // Ejemplo: await User.destroy({ where: { id } });
    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }

        // Lógica para buscar usuario por ID en la base de datos.
        const user = await User.findOne({ where: { id, isDelete: false } });

        if (!user) {
            res.status(400).json({ message: `El usuario del ID :${id} no existe`, code: "ERROR" })
        }

        await User.update({ isDelete: true }, { where: { id } });

        res.json({
            message: 'Usuario eliminado exitosamente',
            data: { id },
        });

    } catch (error) {
        console.log("🚀 ~ app.put ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }


});

// =======================
// Rutas Products - Jesús
// =======================

// Obtener lista de productos
app.get('/products', async (req, res) => {
    console.log('Obtener lista de productos');
    // Parte Logica para el get
    const products = await Product.findAll({
        where: {
            isDelete: false,
        },
    });
    res.json({ message: 'Ok', data: products });
});

// Crear un nuevo producto
app.post('/products', validateRequest(createProductSchema), async (req, res) => {
    console.log('Crear un nuevo producto');

    const { name, price} = req.body;
    // Parte Logica para el post
    try {

        const existeProduct = await Product.findOne({ where: {name} });

        if (existeProduct) {
            return res.status(400).json({ error: "El nombre del producto ya existe" });
        }

        const newProduct = await Product.create({ name, price});

        res.json({
            message: 'Producto creado exitosamente',
            data: newProduct,

        });
    } catch (error) {
        console.log("🚀 ~ app.post ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }

});

// Obtener un solo producto por su ID
app.get('/products/:id', async (req, res) => {
    console.log('Obtener producto por ID');

    const { id } = req.params;
    // Parte Logica para el get
    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }

        const product = await Product.findOne({ where: { id, isDelete: false } });

        if (!product) {
            res.status(400).json({ message: `El producto del ID :${id} no existe`, code: "ERROR" })
        }

        res.json({
            message: 'Detalles del producto',
            data: product,
        });
    } catch (error) {
        console.log("🚀 ~ app.get ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }

});

// Actualizar un producto por su ID
app.put('/products/:id', validateRequest(createProductSchema), async (req, res) => {
    console.log('Actualizar un producto por ID');

    const { id } = req.params;

    const { name, price } = req.body;
    // Parte Logica para el update
    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }

        const product = await Product.findByPk(id);

        if (!product) {
            res.status(400).json({ message: `El producto del ID :${id} no existe`, code: "ERROR" })
        }

        await Product.update({ name, price}, { where: { id } });

        res.json({
            message: 'Producto actualizado exitosamente',
        });

    } catch (error) {
        console.log("🚀 ~ app.put ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }
});

// Eliminar un solo producto por ID pero sin sacarlo de la DB
app.delete('/products/:id', async (req, res) => {

    console.log('Eliminar un producto por ID');

    const { id } = req.params;
    //Parte Logica para el delete
    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }

        const product = await Product.findOne({ where: { id, isDelete: false } });

        if (!product) {
            res.status(400).json({ message: `El producto del ID :${id} no existe`, code: "ERROR" })
        }

        await Product.update({ isDelete: true }, { where: { id } });

        res.json({
            message: 'Producto eliminado exitosamente',
            data: { id },
        });

    } catch (error) {
        console.log("🚀 ~ app.put ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }

});

// =======================
// Inicializar servidor
// =======================

// Podemos usar una variable de entorno para el puerto, o un valor por defecto (ej. 3000).
const PORT = process.env.PORT_APP || 3000;

/**
 * Sincronizar la base de datos significa que Sequelize revisará tus modelos
 * y creará (o modificará) las tablas necesarias en la base de datos.
 * Luego, iniciamos el servidor Express escuchando en el puerto definido.
 */
sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada correctamente');
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al sincronizar la base de datos:', error);
    });
