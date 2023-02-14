import supertest from "supertest";
import dotenv from "dotenv";
import mongoose from "mongoose";
import server from "../src/server.js";
import ProductsModel from "../src/api/products/model.js";
import productsRouter from "../src/api/products/index.js";

dotenv.config();
const client = supertest(server);

const validProduct = {
  name: "A valid product",
  description: "balllablalblabl",
  price: 100,
};

const notValidProduct = {
  name: "A not valid product",
  price: 100,
};
const validId = "63eb8c08aab87eec75e726c0";
const notvalidId = "63eb8c08aab87eec75e626c0";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL_TEST);
  const product = new ProductsModel({
    name: "test",
    description: "blalblabla",
    price: 20,
  });
  await product.save();
});

afterAll(async () => {
  await ProductsModel.deleteMany();
  await mongoose.connection.close();
});

describe("Test APIs", () => {
  it("Should test that the env vars are set correctly", () => {
    expect(process.env.MONGO_URL_TEST).toBeDefined();
  });

  it("Should test that POST /products returns a valid _id and 201", async () => {
    const response = await client
      .post("/products")
      .send(validProduct)
      .expect(201);
    expect(response.body._id).toBeDefined();
  });

  it("Should test that GET /products returns a success status and a body", async () => {
    const response = await client.get("/products").expect(200);
    console.log(response.body);
  });

  it("Should test that POST /products with a not valid product returns a 400", async () => {
    await client.post("/products").send(notValidProduct).expect(400);
  });
  it("Should test that GET /products/productId returns a success status and a body", async () => {
    const response = await client.get("/products").expect(200);
    console.log(response.body[0]._id);
    const resp = await client
      .get(`/products/${response.body[0]._id}`)
      .expect(200);
    console.log(resp.body);
    const notfoundResponse = await client
      .get("/products/63eb8c08aab87eec75e626c0")
      .expect(404);
  });

  it("Should test that PUT /products/:productId updates a product and returns a success status and the updated product", async () => {
    const newProduct = {
      name: "An updated product",
      description: "Updated description",
      price: 50,
    };
    const response = await client
      .post("/products")
      .send(validProduct)
      .expect(201);
    const productId = response.body._id;
    const updatedResponse = await client
      .put(`/products/${productId}`)
      .send(newProduct)
      .expect(200);

    expect(updatedResponse.body).toMatchObject(newProduct);
    console.log(updatedResponse.body);

    const notfoundResponse = await client
      .put("/products/63eb8c08aab87eec75e626c0")
      .send(newProduct)
      .expect(404);
  });
  it("Should test that delete /products/:productId delete a product and returns a success status and the updated product", async () => {
    const newProduct = {
      name: "An updated product",
      description: "Updated description",
      price: 50,
    };
    const response = await client
      .post("/products")
      .send(validProduct)
      .expect(201);
    const productId = response.body._id;
    const updatedResponse = await client
      .delete(`/products/${productId}`)
      .send(newProduct)
      .expect(200);
    const notfoundResponse = await client
      .delete("/products/63eb8c08aab87eec75e626c0")
      .send(newProduct)
      .expect(404);
  });
});
