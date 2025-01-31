const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');    

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:{
      name: 'Unico producto',
      msg: 'El nombre del producto ya existe. Por favor, elige uno diferente.'
    }
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  isDelete: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
}
}, {
    
    tableName: 'products',
    timestamps: false,
});

module.exports = Product;