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
    const { name, model, price, imageUrl, description, stock } = req.body;
    const newCar = await Product.create({ name, model, price, imageUrl, description, stock });
    res.status(201).json(newCar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
    try {
      const car = await Product.findByPk(req.params.id);
      if (!car) return res.status(404).json({ message: "Product not found" });
      await car.update(req.body);
      res.json(car);
    } catch (err) {
      res.status(400).json({ message: err.message });
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
