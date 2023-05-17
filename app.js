require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./docs/swagger_output.json");
var cors = require("cors");

app.use(cors());
app.use(express.json());

//registering routes
app.use("/api/register", require("./routes/register"));
app.use("/api/login", require("./routes/login"));
app.use("/api/refreshToken", require("./routes/refresh_token"));
app.use("/api/changePassword", require("./routes/change_password"));
app.use("/api/forgotPassword", require("./routes/forget_password"));
app.use("/api/resetPassword", require("./routes/reset_password"));
app.use("/api/home", require("./routes/protected_route_example"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;
