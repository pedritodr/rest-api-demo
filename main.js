const express = require('express')
const bodyParser = require('body-parser')//ques es esto????
const app = express()
const port = 3000 //puerto servidor

app.use(bodyParser.json());//que es un middleware

//que es la request y el response en rest
//Status de reponse en rest
app.get('/version', (req, res) => {
    res.send({
        name: 'rest-server',
        version: '0.0.1',
        description: "rest-server  for demo"
    })
})
app.get('/user/', (req, res) => {
    console.log("lista los usuarios...")
    res.send({
        "users": [
            {
                "id": 1,
                "firstName": "Emily",
                "lastName": "Johnson",
                "maidenName": "Smith",
                "age": 28,
                "gender": "female",
                "email": "emily.johnson@x.dummyjson.com",
                "phone": "+81 965-431-3024",
                "username": "emilys",
                "password": "emilyspass",
                "birthDate": "1996-5-30",
                "image": "...",
                "bloodGroup": "O-",
                "height": 193.24,
                "weight": 63.16,
                "eyeColor": "Green",
                "hair": {
                    "color": "Brown",
                    "type": "Curly"
                },
                "ip": "42.48.100.32",
                "address": {
                    "address": "626 Main Street",
                    "city": "Phoenix",
                    "state": "Mississippi",
                    "stateCode": "MS",
                    "postalCode": "29112",
                    "coordinates": {
                        "lat": -77.16213,
                        "lng": -92.084824
                    },
                    "country": "United States"
                },
                "macAddress": "47:fa:41:18:ec:eb",
                "university": "University of Wisconsin--Madison",
                "bank": {
                    "cardExpire": "03/26",
                    "cardNumber": "9289760655481815",
                    "cardType": "Elo",
                    "currency": "CNY",
                    "iban": "YPUXISOBI7TTHPK2BR3HAIXL"
                },
                "company": {
                    "department": "Engineering",
                    "name": "Dooley, Kozey and Cronin",
                    "title": "Sales Manager",
                    "address": {
                        "address": "263 Tenth Street",
                        "city": "San Francisco",
                        "state": "Wisconsin",
                        "stateCode": "WI",
                        "postalCode": "37657",
                        "coordinates": {
                            "lat": 71.814525,
                            "lng": -161.150263
                        },
                        "country": "United States"
                    }
                },
                "ein": "977-175",
                "ssn": "900-590-289",
                "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36",
                "crypto": {
                    "coin": "Bitcoin",
                    "wallet": "0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a",
                    "network": "Ethereum (ERC20)"
                },
                "role": "admin" // or "moderator", or "user"
            }
        ]
    })
})
app.post('/user/', (request, response) => {
    console.log("agrega los usuarios");
    response.send(`contenido de request: ${JSON.stringify(request.body)})}`);
})

app.get('/user/:id', (request, response) => {
    console.log("busca un usuario por id")
    response.send(`contenido de request: ${JSON.stringify(request.body)})}`);
})

app.delete('/user/:id', (request, response) => {
    console.log("elimina un usuario por id")
    response.send(`contenido de request: ${JSON.stringify(request.body)})}`);
})

app.put('/user/:id', (request, response) => {
    console.log("actualiza un usuario por id")
    response.send(`contenido de request: ${JSON.stringify(request.body)})}`);
})

app.post('/', (request, response) => {
    response.send(`contenido de request: ${JSON.stringify(request.body)})}`);
})

app.get('/clima', async (request, resp) => {

    try {
        const response = await fetch("https://freetestapi.com/api/v1/weathers");
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        resp.send(json)
        console.log(json);
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
