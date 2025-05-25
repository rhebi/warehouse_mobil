import Product from "../models/ProductModel.js";

export const getProducts = async (req, res) => {
  try {
    const cars = await Product.findAll();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const car = await Product.findByPk(req.params.id);
    if (!car) return res.status(404).json({ message: "Not found" });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, model, price, imageName, description, stock } = req.body;
    const newCar = await Product.create({ name, model, price, imageName, description, stock });
    res.status(201).json(newCar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    await product.update(req.body);
    return res.json({ msg: "Product updated by manager" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Gagal update produk" });
  }
};

export const updateProductStock = async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock == null) {
      return res.status(400).json({ msg: "Field 'stock' diperlukan" });
    }

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Produk tidak ditemukan" });
    }

    await product.update({ stock });
    return res.json({ msg: "Stock updated by staff" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Gagal update stok produk" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const car = await Product.findByPk(req.params.id);
    if (!car) return res.status(404).json({ message: "Not found" });

    await car.destroy();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
