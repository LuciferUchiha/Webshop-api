const express = require("express");
const router = express.Router();
const getConnection = require("../db.js");

/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management
 */

/**
 * @swagger
 * /product:
 *    get:
 *      description: Use to return all product
 *      tags: [Product]
 *      responses:
 *        '200':
 *          description: Successfully returned all product
 *        '500':
 *          description: Failed to query for product
 *    post:
 *      description: Use to insert a new product
 *      tags: [Product]
 *      parameters:
 *        - name: title
 *          in: body
 *          description: Title of the product
 *          required: string
 *          schema:
 *            type: string
 *        - name: image
 *          in: body
 *          description: Image of the product
 *          required: true
 *          schema:
 *            type: string
 *        - name: price
 *          in: body
 *          description: Price of the product
 *          required: true
 *          schema:
 *            type: double
 *        - name: company
 *          in: body
 *          description: Company of the product
 *          required: true
 *          schema:
 *            type: string
 *        - name: info
 *          in: body
 *          description: Info of the product
 *          required: true
 *          schema:
 *            type: string
 *        - name: inCart
 *          in: body
 *          description: InCart of the product
 *          required: true
 *          schema:
 *            type: string
 *        - name: count
 *          in: body
 *          description: Count of the product
 *          required: true
 *          schema:
 *            type: int
 *        - name: total
 *          in: body
 *          description: Total of the product
 *          required: true
 *          schema:
 *            type: double
 *      responses:
 *        '200':
 *          description: Successfully inserted a product
 *        '500':
 *          description: Failed to insert a product
 */
router
  .route("/product")
  .get((req, res) => getAllProducts(req, res))
  .post((req, res) => insertProduct(req, res));

/**
 * @swagger
 * /product/{id}:
 *    get:
 *      description: Use to return a product
 *      tags: [Product]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Id of the product
 *          required: true
 *          schema:
 *            type: int
 *      responses:
 *        '200':
 *          description: Successfully returned the product
 *        '404':
 *          description: Product with the given Id couldn't be found
 *        '500':
 *          description: Failed to query for product
 *    put:
 *      description: Use to update a product
 *      tags: [Product]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Id of the product
 *          required: true
 *          schema:
 *            type: int
 *        - name: title
 *          in: body
 *          description: Title of the product
 *          required: string
 *          schema:
 *            type: string
 *        - name: image
 *          in: body
 *          description: Image of the product
 *          required: true
 *          schema:
 *            type: string
 *        - name: price
 *          in: body
 *          description: Price of the product
 *          required: true
 *          schema:
 *            type: double
 *        - name: company
 *          in: body
 *          description: Company of the product
 *          required: true
 *          schema:
 *            type: string
 *        - name: info
 *          in: body
 *          description: Info of the product
 *          required: true
 *          schema:
 *            type: string
 *        - name: inCart
 *          in: body
 *          description: InCart of the product
 *          required: true
 *          schema:
 *            type: string
 *        - name: count
 *          in: body
 *          description: Count of the product
 *          required: true
 *          schema:
 *            type: int
 *        - name: total
 *          in: body
 *          description: Total of the product
 *          required: true
 *          schema:
 *            type: double
 *      responses:
 *        '200':
 *          description: Successfully returned the product
 *        '404':
 *          description: Product with the given Id couldn't be found
 *        '500':
 *          description: Failed to update for product
 *    delete:
 *      description: Use to delete a product
 *      tags: [Product]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Id of the product
 *          required: true
 *          schema:
 *            type: int
 *      responses:
 *        '200':
 *          description: Successfully deleted the product
 *        '404':
 *          description: Product with the given Id couldn't be found
 *        '500':
 *          description: Failed to delete the product
 */

router
  .route("/product/:id")
  .get((req, res) => getProductById(req, res))
  .put((req, res) => updateProduct(req, res))
  .delete((req, res) => deleteProductById(req, res));

const getAllProducts = (req, res) => {
  const connection = getConnection();

  const queryString = "SELECT * FROM product";
  connection.query(queryString, (err, results, fields) => {
    if (err) {
      console.log("Failed to query for products: " + err);
      res.sendStatus(500);
      return;
    }
    res.json(results);
  });
};

const insertProduct = (req, res) => {
  const connection = getConnection();

  const title = req.body.title;
  const image = req.body.image;
  const price = req.body.price;
  const company = req.body.company;
  const info = req.body.info;
  const inCart = req.body.inCart;
  const count = req.body.count;
  const total = req.body.total;

  const queryString =
    "INSERT INTO product (title, image, price, company, info, inCart, count, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  connection.query(
    queryString,
    [title, image, price, company, info, inCart, count, total],
    (err, results, fields) => {
      if (err) {
        console.log("Failed to insert new product: " + err);
        res.sendStatus(500);
        return;
      }
      console.log("Inserted a new product with id: ", results.insertId);
      const product = {
        id: results.insertId,
        title: title,
        image: image,
        price: price,
        company: company,
        info: info,
        inCart: inCart,
        count: count,
        total: total
      };
      res.json(product);
    }
  );
};

const getProductById = (req, res) => {
  const connection = getConnection();

  const idProduct = req.params.id;
  const queryString = "SELECT * FROM product WHERE id = ?";
  connection.query(queryString, [idProduct], (err, results, fields) => {
    console.log(results);
    if (err) {
      console.log("Failed to query for products: " + err);
      res.sendStatus(500);
      return;
    } else if (results.length < 1) {
      console.log("Product with id: " + idProduct + "couldn't be found");
      res.status(404).send("No product found");
      return;
    }
    const product = results.map(row => {
      return {
        title: row.title,
        image: row.image,
        price: row.price,
        company: row.company,
        info: row.info,
        inCart: row.inCart,
        count: row.count,
        total: row.total
      };
    });

    res.json(product);
  });
};

const updateProduct = (req, res) => {
  const connection = getConnection();

  const idProduct = req.params.id;
  const title = req.body.title;
  const image = req.body.image;
  const price = req.body.price;
  const company = req.body.company;
  const info = req.body.info;
  const inCart = req.body.inCart;
  const count = req.body.count;
  const total = req.body.total;

  const queryString =
    "UPDATE product SET title = ?, image = ?, price = ?, company = ?" +
    ", info = ?, inCart = ?, count = ?, total = ? WHERE id = ?";

  connection.query(
    queryString,
    [title, image, price, company, info, inCart, count, total, idProduct],
    (err, results, fields) => {
      if (err) {
        console.log("Failed to update product: " + err);
        res.sendStatus(500);
        return;
      } else if (results.length < 1) {
        console.log("Product with id: " + idProduct + "couldn't be found");
        res.status(404).send("No product found");
        return;
      }
      console.log("Updated product with id: ", idProduct);
      const product = {
        id: idProduct,
        title: title,
        image: image,
        price: price,
        company: company,
        info: info,
        inCart: inCart,
        count: count,
        total: total
      };
      res.json(product);
    }
  );
};

const deleteProductById = (req, res) => {
  const connection = getConnection();

  const idProduct = req.params.id;
  const queryString = "DELETE FROM product WHERE id = ?";
  connection.query(queryString, [idProduct], (err, results, fields) => {
    if (err) {
      console.log("Failed to delete product: " + err);
      res.sendStatus(500);
      return;
    } else if (results.length < 1) {
      console.log("Product with id: " + idProduct + "couldn't be found");
      res.status(404).send("No product found");
      return;
    }
    console.log("Deleted product with id: ", idProduct);
    res.end();
  });
};

module.exports = router;
