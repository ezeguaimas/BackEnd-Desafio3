import fs from "fs";
const { readFileSync, writeFileSync } = fs;

const path = "./data/productos.json";

export default class ProductManager {
  constructor() {
    this.path = path;
    this.products = this.getProducts();
  }
  getProducts() {
    try {
      const data = readFileSync(this.path, "utf8");
      this.products = JSON.parse(data);
      return this.products;
    } catch (error) {
      return "Error cargando productos";
    }
  }

  saveProducts() {
    try {
      writeFileSync(this.path, JSON.stringify(this.products, null, 2));
      return this.products;
    } catch (error) {
      throw new Error("Error guardando producto");
    }
  }

  addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      return "Error: Todos los campos son obligatorios";
    }

    const codeRepeat = this.products.find((p) => p.code === product.code);
    if (codeRepeat) {
      return "Error: El código del producto ya existe";
    }

    const lastProductId =
      this.products.length > 0 ? this.products[this.products.length - 1].id : 0;
    product.id = lastProductId + 1;

    this.products.push(product);
    this.saveProducts();
    return;
  }

  getProductById(idProduct) {
    const reqProduct = this.products.find(
      (product) => product.id === idProduct
    );
    if (reqProduct) {
      console.log(reqProduct);
      return reqProduct;
    } else {
      return "Not found";
    }
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex !== -1) {
      const updatedProduct = {
        ...this.products[productIndex],
        ...updatedFields,
      };
      this.products[productIndex] = updatedProduct;
      this.saveProducts();
    } else {
      return "Error: Producto no encontrado";
    }
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex !== -1) {
      this.products.splice(productIndex, 1);
      this.saveProducts();
      return "Producto eliminado exitosamente";
    } else {
      return "Error: Producto no encontrado";
    }
  }
}

