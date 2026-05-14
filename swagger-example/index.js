//index.js
import "dotenv/config";
import swaggerUI from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const openapiSpecification = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clients API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    }
  },
  apis: ['./routes.js'],
});

import express from "express";
const app = express();

app.use(express.json());

app.use("/docs", swaggerUI.serve, swaggerUI.setup(openapiSpecification));

import router from "./routes.js";
app.use(router);

app.listen(3000, () => {
  console.log("Servidor escutando na porta 3000...");
  console.log('Swagger docs on http://localhost:3000/docs')
});
