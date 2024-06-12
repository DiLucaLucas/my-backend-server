// Importamos
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// Utilizamos
app.use(cors());
app.use(morgan());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const productRoute = require("./controllers/productController");

app.get("/", (req, res) => {
  res.status(200).json({ message: "Esta todo OK!" });
});

app.use("/products", productRoute);

app.listen(port, () => {
  console.log("Corriendo el servidor en el puerto:", port);
});
