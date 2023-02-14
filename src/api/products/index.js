import express from "express";
import ProductsModel from "./model.js";
import createHttpError from "http-errors";

const productsRouter = express.Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await ProductsModel.find();
    res.send(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = new ProductsModel(req.body);
    const { _id } = await newProduct.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.productId);
    if (product) {
      res.status(204).send(product);
    } else {
      res.status(404).send(404);
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true }
    );
    if (updatedProduct) {
      res.status(200).send(updatedProduct);
    } else {
      res.status(404).send(404);
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findByIdAndDelete(req.params.productId);
    if (product) {
      res.status(204).send("Product deleted");
    } else {
      res.status(404).send(404);
    }
  } catch (error) {
    next(error);
  }
});

export default productsRouter;
