const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Products = sequelize.define('Products', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isDelete: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
}, {
    tableName: 'products29921053',
    timestamps: false,
});

module.exports = Products;
