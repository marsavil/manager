const { DataTypes, Sequelize } = require('sequelize');


// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('affiliate_link', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_users: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    affiliate_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    creation_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  });
}