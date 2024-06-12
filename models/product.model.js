const { Sequelize, DataTypes, Model } = require("sequelize");

const sequelize = new Sequelize("mydatabase", "root", "", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Conexion a la base de datos exitosa");
  } catch (error) {
    console.error("No fue posible conectarse a la base de datos :( ", error);
  }
}

testConnection();

class Product extends Model {}

// Definir la estructura en sequelize. Si la tabla no existe, la crea.
Product.init(
  {
    idproduct: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize, modelName: "Product" }
);

// Exporta el modelo para usarlo en otras partes de la aplicación
module.exports = Product;
