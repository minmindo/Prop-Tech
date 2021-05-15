const express = require("express");
const app = express();
const routesUrls = require("./router");
const database = require("./database");
const databaseRouter = require("./database_router");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const config = require("./config.json");

// For local testing and development
// app.use(cors({ credentials: true, origin: "http://localhost:3001" }));

// For build
app.use(cors({ credentials: true, origin: `http://${config.server_ip}` }));

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use("", routesUrls);
app.use("", databaseRouter);
app.listen(3000, () => {
  console.log("server is running");
  database.establishDatabaseConnection();
});
