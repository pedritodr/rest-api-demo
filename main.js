const express = require('express');
const sequelize = require('./config/database');
const validateRequest = require('./middlewares/validateRequest');
const User = require('./models/user')
const { createUserSchema } = require('./validations/userValidation')
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

app.get("/products",(request, response) => {
    const allProducts = {
        "products":[
           {
              "id":1,
              "title":"Essence Mascara Lash Princess",
              "description":"The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.",
              "category":"beauty",
              "price":9.99,
              "discountPercentage":7.17,
              "rating":4.94,
              "stock":5,
              "tags":[
                 "beauty",
                 "mascara"
              ],
              "brand":"Essence",
              "sku":"RCH45Q1A",
              "weight":2,
              "dimensions":{
                 "width":23.17,
                 "height":14.43,
                 "depth":28.01
              },
              "warrantyInformation":"1 month warranty",
              "shippingInformation":"Ships in 1 month",
              "availabilityStatus":"Low Stock",
              "reviews":[
                 {
                    "rating":2,
                    "comment":"Very unhappy with my purchase!"
                 },
                 {
                    "rating":5,
                    "comment":"Very satisfied!"
                 }
              ]
           }
        ],
        "total":1,
        "skip":0,
        "limit":30
     }
    response.send(JSON.stringify(allProducts))
})

app.get("/products/:id",(request, response) => {
    const productById = {
        "product":{
           "id":1,
           "title":"Essence Mascara Lash Princess",
           "description":"The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects.",
           "category":"beauty",
           "price":9.99,
           "discountPercentage":7.17,
           "rating":4.94,
           "stock":5
        }
     }
    response.send(JSON.stringify(productById))
})

app.post("/products",(request, response) => {

    response.send("Creado correctamente" )
})

app.put("/products",(request, response) => {

    response.send("Actualizado correctamente" )
})

app.delete("/products",(request, response) => {

    response.send("Eliminado correctamente" )
})

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
