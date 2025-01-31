const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Producto = sequelize.define('Producto', {
  Nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:{
      Nombre: 'Producto Unico',
      msg: 'El nombre del producto ya existe. Elija uno diferente.'
    }
  },
  Precio: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  isDelete: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
}
}, {

    tableName: 'Producto',
    timestamps: false,
});

module.exports = Producto;