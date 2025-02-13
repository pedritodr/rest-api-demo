const express = require('express');
const sequelize = require('./config/database');
const validateRequest = require('./middlewares/validateRequest');
const User = require('./models/user')
const Products = require('./models/products')
const { createUserSchema } = require('./validations/userValidation')
const { createProductsSchema } = require('./validations/productsvalidation')
const bodyParser = require('body-parser')
// A partir de Express 4.16, no es necesario usar body-parser, 
// pues podemos usar express.json() y express.urlencoded() directamente.

const app = express();

// =======================
// Middlewares
// =======================

app.use(express.json());
app.use(bodyParser.json());

// =======================
// Rutas
// =======================

//==============================================================================//
// ------------------------------productos ------------------------------------//
//=============================================================================//

// 5.1 lista de productos 
app.get('/products', async (req, res) => {
    console.log('Obtener lista de procutos ');
    
    const products = await Products.findAll({
        where: {
            isDelete: false,
        },
    });
    res.json({ message: 'Ok', data: products });
});

// 5.2 productos por id 
app.get('/products/:id', async (req, res) => {
    console.log('Obtener producto por ID');

    const { id } = req.params;

    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }

        // Lógica para buscar usuario por ID en la base de datos.
        const Product = await Products.findOne({ where: { id, isDelete: false } });

        if (!Product) {
            res.status(400).json({ message: `El producto del ID :${id} no existe`, code: "ERROR" })
        }

        res.json({
            message: 'Detalles del producto',
            data: Product,
        });
    } catch (error) {
        console.log("🚀 ~ app.get ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }

});


//5.3 crear productos 
app.post('/products', validateRequest(createProductsSchema), async (req, res) => {
    console.log('Crear un nuevo producto');

    // Extraemos datos desde req.body
    const { name, description, price } = req.body;

    try {
        const products = await Products.findOne({ where: { description, isDelete: false } })

        if (products) res.status(400).json({ message: `Existe un producto con la descripcion ${description}` })

        const newProducts = await Products.create({ name, description, price });

        res.json({
            message: 'Producto creado exitosamente',
            data: newProducts,

        });
    } catch (error) {
        console.log("🚀 ~ app.post ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }

});

// 5.4 actualizar producto
app.put('/products/:id', validateRequest(createProductsSchema), async (req, res) => {
    console.log('Actualizar un producto por ID');

    const { id } = req.params;
    const { name, description, price } = req.body;


    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }

        // Lógica para buscar usuario por ID en la base de datos.
        const products = await Products.findByPk(id);

        if (!products) {
            res.status(400).json({ message: `El producto del ID :${id} no existe`, code: "ERROR" })
        }

        await Products.update({ name, description, price }, { where: { id } });

        res.json({
            message: 'actualizado exitosamente',
        });

    } catch (error) {
        console.log("🚀 ~ app.put ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }
});

// 5.5 eliminar productos 
app.delete('/products/:id', async (req, res) => {
    console.log('Eliminar un usuario por ID');

    const { id } = req.params;
    // Lógica para eliminar el usuario de la base de datos.
    // Ejemplo: await User.destroy({ where: { id } });
    try {
        if (!id) {
            res.status(400).json({ message: 'El ID es requerido', code: "ERROR" })
        }

        // Lógica para buscar usuario por ID en la base de datos.
        const products = await Products.findOne({ where: { id, isDelete: false } });

        if (!products) {
            res.status(400).json({ message: `El prducto del ID :${id} no existe`, code: "ERROR" })
        }

        await Products.update({ isDelete: true }, { where: { id } });

        res.json({
            message: 'eliminado exitosamente',
            data: { id },
        });

    } catch (error) {
        console.log("🚀 ~ app.put ~ error:", error)
        res.status(400).json({ message: error.message, code: "ERROR" })
    }


});

///================================================================================================//
/// -------------------------------------- usuarios ----------------------------------------------//
///===============================================================================================//


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


// ========================================================================================================
//                                 Inicializar servidor
// ==========================================================================================================

// Podemos usar una variable de entorno para el puerto, o un valor por defecto (ej. 3000).
const PORT = process.env.PORT_APP || 3000;

//

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

