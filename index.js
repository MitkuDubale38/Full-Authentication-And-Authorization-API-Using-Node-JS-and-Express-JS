const http = require("http");
const app = require("./app");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// server listening
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Authentication API Using Node JS and Express",
        version: "0.1.0",
        description: "This Is Authentication API Using Node JS and Express",
        contact: {
          name: "Mitku Dubale",
          email: "mitkudubale3864@email.com",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
    apis: ["./routes/*.js"],
  };

  const specs = swaggerJsdoc(options);
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
  );
});
