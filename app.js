const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const fs = require("fs");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();

const port = 3003;
const hostname = "http://localhost" + ":" + port;

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure logger
app.use(
  logger("common", {
    stream: fs.createWriteStream("./access.log", { flags: "a" })
  })
);
app.use(logger("dev"));

app.get("/", (req, res) => {
  res.send("Welcome to root!");
});

fs.readdir("./routes", (err, files) => {
  files.forEach(file => {
    app.use("/", require("./routes/" + file));
  });
});

// configure and setup swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Rest API",
      description: "A simple rest API",
      servers: [hostname]
    }
  },
  apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
  console.log("Server running on port " + port);
});
