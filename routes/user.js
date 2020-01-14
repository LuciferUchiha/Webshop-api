const express = require("express");
const router = express.Router();
const getConnection = require("../db.js");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
 * @swagger
 * /user:
 *    get:
 *      description: Use to return all users
 *      tags: [User]
 *      responses:
 *        '200':
 *          description: Successfully returned all users
 *        '500':
 *          description: Failed to query for users
 *    post:
 *      description: Use to insert a new user
 *      tags: [User]
 *      parameters:
 *        - name: firstName
 *          in: body
 *          description: Firstname of the user
 *          required: true
 *          schema:
 *            type: string
 *        - name: lastName
 *          in: body
 *          description: Lastname of the user
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        '200':
 *          description: Successfully inserted a user
 *        '500':
 *          description: Failed to insert a user
 */
router
  .route("/user")
  .get((req, res) => getAllUsers(req, res))
  .post((req, res) => insertUser(req, res));

/**
 * @swagger
 * /user/{id}:
 *    get:
 *      description: Use to return a user
 *      tags: [User]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Id of the user
 *          required: true
 *          schema:
 *            type: int
 *      responses:
 *        '200':
 *          description: Successfully returned the user
 *        '404':
 *          description: User with the given Id couldn't be found
 *        '500':
 *          description: Failed to query for user
 *    put:
 *      description: Use to update a user
 *      tags: [User]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Id of the user
 *          required: true
 *          schema:
 *            type: int
 *        - name: firstName
 *          in: body
 *          description: Firstname of the user
 *          required: true
 *          schema:
 *            type: string
 *        - name: lastName
 *          in: body
 *          description: Lastname of the user
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        '200':
 *          description: Successfully returned the user
 *        '404':
 *          description: User with the given Id couldn't be found
 *        '500':
 *          description: Failed to update for user
 *    delete:
 *      description: Use to delete a user
 *      tags: [User]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Id of the user
 *          required: true
 *          schema:
 *            type: int
 *      responses:
 *        '200':
 *          description: Successfully deleted the user
 *        '404':
 *          description: User with the given Id couldn't be found
 *        '500':
 *          description: Failed to delete the user
 */

router
  .route("/user/:id")
  .get((req, res) => getUserById(req, res))
  .put((req, res) => updateUser(req, res))
  .delete((req, res) => deleteUserById(req, res));

const getAllUsers = (req, res) => {
  const connection = getConnection();

  const queryString = "SELECT * FROM user";
  connection.query(queryString, (err, results, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err);
      res.sendStatus(500);
      return;
    }
    res.json(results);
  });
};

const insertUser = (req, res) => {
  const connection = getConnection();

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const queryString = "INSERT INTO user (firstName, lastName) VALUES (?, ?)";
  connection.query(
    queryString,
    [firstName, lastName],
    (err, results, fields) => {
      if (err) {
        console.log("Failed to insert new user: " + err);
        res.sendStatus(500);
        return;
      }
      console.log("Inserted a new user with id: ", results.insertId);
      const user = {
        userid: results.insertId,
        firstName: firstName,
        lastName: lastName
      };
      res.json(user);
    }
  );
};

const getUserById = (req, res) => {
  const connection = getConnection();

  const idUser = req.params.id;
  const queryString = "SELECT * FROM user WHERE id = ?";
  connection.query(queryString, [idUser], (err, results, fields) => {
    console.log(results);
    if (err) {
      console.log("Failed to query for users: " + err);
      res.sendStatus(500);
      return;
    } else if (results.length < 1) {
      console.log("User with id: " + idUser + "couldn't be found");
      res.status(404).send("No user found");
      return;
    }
    const user = results.map(row => {
      return { firstName: row.firstName, lastName: row.lastName };
    });

    res.json(user);
  });
};

const updateUser = (req, res) => {
  const connection = getConnection();

  const idUser = req.params.id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const queryString =
    "UPDATE user SET firstName = ?, lastName = ? WHERE id = ?";
  connection.query(
    queryString,
    [firstName, lastName, idUser],
    (err, results, fields) => {
      if (err) {
        console.log("Failed to update user: " + err);
        res.sendStatus(500);
        return;
      } else if (results.length < 1) {
        console.log("User with id: " + idUser + "couldn't be found");
        res.status(404).send("No user found");
        return;
      }
      console.log("Updated user with id: ", idUser);
      const user = { userid: idUser, firstName: firstName, lastName: lastName };
      res.json(user);
    }
  );
};

const deleteUserById = (req, res) => {
  const connection = getConnection();

  const idUser = req.params.id;
  const queryString = "DELETE FROM user WHERE id = ?";
  connection.query(queryString, [idUser], (err, results, fields) => {
    if (err) {
      console.log("Failed to delete user: " + err);
      res.sendStatus(500);
      return;
    } else if (results.length < 1) {
      console.log("User with id: " + idUser + "couldn't be found");
      res.status(404).send("No user found");
      return;
    }
    console.log("Deleted user with id: ", idUser);
    res.end();
  });
};

module.exports = router;
