// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// // Crear el esquema antes de definir el modelo
// async function createSchema() {
//   try {
//     await sequelize.query('CREATE SCHEMA IF NOT EXISTS products14209140');
//     console.log('Esquema creado o ya existía');
//   } catch (error) {
//     console.error('Error al crear el esquema:', error);
//   }
// }

// createSchema().then(() => {
//   // Definir el modelo después de asegurarse de que el esquema esté creado
//   const Products = sequelize.define('Products', {
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     type: {
//       type: DataTypes.STRING,
//       allowNull: true,
//       unique: false,
//     },
//     stock: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//     isDelete: {
//       type: DataTypes.BOOLEAN,
//       allowNull: true,
//       defaultValue: false,
//     },
//   }, 
//   {
//     schema: 'products14209140', // Especifica el esquema aquí
//     tableName: 'products',
//     timestamps: false,
//   });

//   module.exports = Products;
// });

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Products = sequelize.define('Products', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    isDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, 

{
    schema: 'products14209140',
    tableName: 'products',
    timestamps: false,
});

module.exports = Products;
