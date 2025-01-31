const express = require('express');
const sequelize = require('./config/database');
const validateRequest = require('./middlewares/validateRequest');
const User = require('./models/user');
const Products = require('./models/products');
const { createUserSchema } = require('./validations/userValidation');
const { createProducts14209140 } = require('./validations/productsValidation');
const bodyParser = require('body-parser')
// A partir de Express 4.16, no es necesario usar body-parser, 
// pues podemos usar express.json() y express.urlencoded() directamente.
const { queryInterface } = sequelize;

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


app.get('/products', async (req, res) => {

    console.log('Obtener lista de productos');
    const products = await Products.findAll({
        where: {
            isDelete: false,
        },
    });
    res.json({ message: 'Ok', data: products });
});

app.get('/products/:id', async (req, res) => {
    console.log('Obtener producto por ID');

    const { id } = req.params;

    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }

        // Lógica para buscar producto por ID en la base de datos.
        const producto = await Products.findOne({ where: { id, isDelete: false } });

        if (!producto) {
            res.status(400).json({ message: `El producto del ID :${id} no existe`, code: "ERROR" })
        }

        res.json({
            message: 'Detalles del producto',
            data: producto,
        });
    } catch (error) {
        console.log("🚀 ~ app.get ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }

});

app.post('/products', validateRequest(createProducts14209140), async (req, res) => {
    console.log('Crear un nuevo producto');

    const { name, type, stock } = req.body;

    try {
        const product = await Products.findOne({ where: { name, isDelete: false } })

        if (product) res.status(400).json({ message: `Existe un producto con el nombre ${name}` })

        const newProducts = await Products.create({ name, type, stock });

        res.json({
            message: 'Creado correctamente',
            data: newProducts,

        });
    } catch (error) {
        console.log("🚀 ~ app.post ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }

});

app.put('/products/:id', validateRequest(createProducts14209140), async (req, res) => {
    console.log('Actualizar un producto por ID');

    const { id } = req.params;
    const { name, type, stock } = req.body;


    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }

        // Lógica para buscar produxto por ID en la base de datos.
        const products = await Products.findByPk(id);

        if (!products) {
            res.status(400).json({ message: `El producto del ID :${id} no existe`, code: "ERROR" })
        }

        await Products.update({ name, type, stock }, { where: { id } });

        res.json({
            message: 'Actualizado correctamente',
        });

    } catch (error) {
        console.log("🚀 ~ app.put ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }
});

app.delete('/products/:id', async (req, res) => {
    console.log('Eliminar un producto por ID');

    const { id } = req.params;
    // // Lógica para eliminar el producto de la base de datos.
    // // Ejemplo: await User.destroy({ where: { id } });
    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }

        // Lógica para buscar producto por ID en la base de datos.
        const product = await Products.findOne({ where: { id, isDelete: false } });

        if (!product) {
            res.status(400).json({ message: `El producto del ID :${id} no existe`, code: "ERROR" })
        }

        await Products.update({ isDelete: true }, { where: { id } });

        res.json({
            message: 'Eliminado correctamente',
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
// sequelize.sync({ alter: true })
    .then(() => {
        console.log('Base de datos sincronizada correctamente');
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al sincronizar la base de datos:', error);
    });
