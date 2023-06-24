const { DataTypes, Sequelize } = require('sequelize');


// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('sales_log', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_referral: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_channel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chat_rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });
  
}