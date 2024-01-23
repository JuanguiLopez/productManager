const express = require("express");

const ProductManager = require("./ProductManager");
const prodManager = new ProductManager("./ProductsJG.json");

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/consigna", (req, res) => {
  res.send(
    "<h1>Desarrollar un servidor basado en express donde podamos hacer consultas a nuestro archivo de productos</h1>"
  );
});

server.get("/products", async (req, res) => {
  let resultado = await prodManager.getProducts();
  const limit = req.query.limit; //Permite definir un límite de productos a mostrar

  if (limit) {
    resultado = resultado.slice(0, limit);
  }

  res.send({ productos: resultado });
});

server.get("/products/:productId", async (req, res) => {
  let productos = await prodManager.getProducts();
  const id = req.params.productId;
  const product = productos.find((prod) => prod.id == id);
  if (!product) {
    res.send("producto no encontrado");
  }

  res.send({ producto: product });
});

//-----------------------
server.listen(8080, () =>
  console.log("El servidor está corriendo el puerto 8080")
);
