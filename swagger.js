const swaggerAutogen = require("swagger-autogen")();
const doc = {
  info: {
    title: "Authentication And Autorization API Using NodeJs and Express",
    description: "Authentication And Autorization API Using NodeJs and Express",
  },
  host: "3nrfsw-8080.csb.app",
  schemes: ["https"],
};
const outputFile = "./docs/swagger_output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
