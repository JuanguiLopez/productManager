const fs = require("fs");

class ProductManager {
  #id = 1;

  constructor(path) {
    this.path = path;
    this.products = [];
    this.#loadProducts();
  }

  #loadProducts() {
    try {
      let data = fs.readFileSync(this.path, "utf8");
      this.products = JSON.parse(data);

      // Se recorren todos los productos y se asigna a la variable #id el valor siguiente al máximo existente
      this.#id =
        this.products.reduce(
          (maxId, product) => Math.max(maxId, product.id),
          0
        ) + 1;
    } catch (error) {
      console.log("Error al cargar productos al inicio");
      this.products = [];
    }
  }

  async #writeFile(text) {
    await fs.promises.writeFile(this.path, text);
  }

  async #readFile() {
    let data = await fs.promises.readFile(this.path, "utf8");
    return data;
  }

  async getProducts() {
    if (!fs.existsSync(this.path)) {
      await this.#writeFile("[]");
    }

    let data = await this.#readFile();
    let products = JSON.parse(data);

    return products;
  }

  async addProduct(productIn) {
    const { title, description, price, thumbnail, code, stock } = productIn;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      return console.log("Todos los valores son obligatorios.");
    }

    if (this.products.some((product) => product.code === code)) {
      return console.log("Existe un producto con el code ingresado.");
    }

    let product = {};
    product.id = this.#id++;
    product.title = title;
    product.description = description;
    product.price = price;
    product.thumbnail = thumbnail;
    product.code = code;
    product.stock = stock;

    this.products.push(product);

    try {
      await this.#writeFile(JSON.stringify(this.products));
    } catch (error) {
      console.log(`ERROR: ${error}`);
    }

    return this.products;
  }

  async getProductById(idproduct) {
    const products = await this.getProducts();
    const product = products.find((prod) => prod.id === idproduct);

    if (!product) {
      console.log("Not found");
      return;
    }

    return product;
  }

  async updateProduct(idproduct, infoToUpdate) {
    // Buscamos el producto a actualizar y validamos que exista.
    const productToUpdate = this.products.find((prod) => prod.id === idproduct);

    if (!productToUpdate) return `No existe el producto a actualizar`;

    // Recorremos el array de productos y actualizamos
    this.products = this.products.map((product) => {
      if (product.id === idproduct) {
        return {
          ...productToUpdate,
          title: infoToUpdate.title ?? product.title,
          description: infoToUpdate.description ?? product.description,
          price: infoToUpdate.price ?? product.price,
          thumbnail: infoToUpdate.thumbnail ?? product.thumbnail,
          code: infoToUpdate.code ?? product.code,
          stock: infoToUpdate.stock ?? product.stock,
        };
      }
      return product;
    });
  }

  async deleteProduct(idprod) {
    // Se filtran los productos dejando solo los que que no coincidan con el id ingresado
    const productsFiltered = this.products.filter((prod) => prod.id !== idprod);

    // Se validan los arrays para ver si se encontró el producto con el id indicado
    if (productsFiltered.length === this.products.length)
      return `El producto con ID ${idprod} no existe`;

    // Se asignan los productos filtrados sin el producto con el id indicado
    this.products = productsFiltered;

    await this.#writeFile(JSON.stringify(this.products));

    return `Producto con ID ${idprod} eliminado correctamente`;
  }
}

module.exports = ProductManager;

/*
const manager = new ProductManager("./ProductsJG.json");

const gestionarProductos = async () => {
  const product1 = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25,
  };

  const product2 = {
    title: "producto prueba 2",
    description: "Este es otro producto prueba",
    price: 500,
    thumbnail: "Sin imagen",
    code: "def456",
    stock: 10,
  };

  const product3 = {
    title: "producto prueba 3",
    description: "Este es el tercer producto prueba",
    price: 400,
    thumbnail: "Sin imagen",
    code: "xyz321",
    stock: 45,
  };

  const product4 = {
    title: "producto prueba 4",
    description: "Este es el cuarto producto prueba",
    price: 450,
    thumbnail: "Sin imagen",
    code: "xyz123",
    stock: 55,
  };

  const product5 = {
    title: "producto prueba 5",
    description: "Este es el quinto producto prueba",
    price: 25,
    thumbnail: "Sin imagen",
    code: "src555",
    stock: 752,
  };

  const product6 = {
    title: "producto prueba 6",
    description: "Este es el sexto producto prueba",
    price: 1200,
    thumbnail: "Sin imagen",
    code: "njs999",
    stock: 8,
  };

  const product7 = {
    title: "producto prueba 7",
    description: "Este es el séptimo producto prueba",
    price: 50,
    thumbnail: "Sin imagen",
    code: "epx123",
    stock: 155,
  };

  const product8 = {
    title: "producto prueba 8",
    description: "Este es el octavo producto prueba",
    price: 300,
    thumbnail: "Sin imagen",
    code: "qwe432",
    stock: 99,
  };

  const product9 = {
    title: "producto prueba 9",
    description: "Este es el noveno producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "zxy456",
    stock: 15,
  };

  const product10 = {
    title: "producto prueba 10",
    description: "Este es el decimo producto prueba",
    price: 850,
    thumbnail: "Sin imagen",
    code: "xyz789",
    stock: 85,
  };

  await manager.addProduct(product1);
  await manager.addProduct(product2);
  await manager.addProduct(product3);
  await manager.addProduct(product4);
  await manager.addProduct(product5);
  await manager.addProduct(product6);
  await manager.addProduct(product7);
  await manager.addProduct(product8);
  await manager.addProduct(product9);
  await manager.addProduct(product10);

  console.log(await manager.getProducts());
  //console.log(await manager.getProductById(2));

  //await manager.updateProduct(1, { title: "Producto Actualizado", stock: 14 });
  //await manager.deleteProduct(2);
};

gestionarProductos();
*/
