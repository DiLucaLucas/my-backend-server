const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const Product = require("../models/product.model.js");

// GET
router.get("/", async (req, res) => {
  const { query } = req;
  try {
    const productos = await Product.findAll();
    res.status(200).json({
      success: true,
      result: productos,
      message: "Productos obtenidos con exito",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      result: "productos",
      message: "Error al obtener los productos.",
    });
  }
});

//POST
router.post("/", async (req, res) => {
  const { body } = req;
  console.log(body, "Contenido del body: ");
  try {
    await Product.sync();
    const nuevoProducto = await Product.create({
      nombre: body.nombre,
      precio: body.precio,
      cantidad: body.cantidad,
      categoria: body.categoria,
    });
    res.status(201).json({
      success: true,
      result: nuevoProducto,
      message: "Producto creado con exito",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Cuerpo vacio",
    });
  }
});

router.put("/:idproduct", async (req, res) => {
  const { body } = req;
  const { idproduct } = req.params;

  try {
    const product = await Product.findByPk(idproduct);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Producto no encontrado" });
    }

    const updatedProduct = await product.update(body);
    res.status(200).json({
      success: true,
      result: updatedProduct,
      message: "Producto actualizado con exito",
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error al actualizar el producto" });
  }
});

// DELETE
router.delete("/:idproduct", async (req, res) => {
  const { idproduct } = req.params;
  try {
    const product = await Product.findByPk(idproduct);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "No se encontro el producto" });
    }

    await product.destroy();
    res.status(200).json({
      success: true,
      result: product,
      message: "El producto fue eliminado con exito",
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "El producto no fue eliminado" });
  }
});

// FILTRAR
router.get("/filtrados", async (req, res) => {
  const { categoria, precioMin, precioMax } = req.query;

  let where = {};

  if (categoria) {
    where.categoria = categoria;
  }

  if (precioMin) {
    where.precio = { ...where.precio, [Op.gte]: precioMin };
  }

  if (precioMax) {
    where.precio = { ...where.precio, [Op.lte]: precioMax };
  }

  try {
    const productos = await Product.findAll({ where });
    res.status(200).json({
      success: true,
      result: productos,
      message: "Productos filtrados con éxito.",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "Error al obtener los productos filtrados.",
    });
  }
});

// ORDENADOS
router.get("/ordenados", async (req, res) => {
  const { criterio } = req.query;
  if (!criterio || !["nombre", "precio", "cantidad"].includes(criterio)) {
    return res.status(400).json({
      success: false,
      message:
        'Criterio de ordenación no válido. Use "nombre", "precio" o "cantidad".',
    });
  }
  try {
    const productos = await Product.findAll({
      order: [[criterio, "ASC"]],
    });
    res.status(200).json({
      success: true,
      result: productos,
      message: "Productos ordenados con éxito.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al obtener los productos ordenados.",
      error: error.message,
    });
  }
});

module.exports = router;
