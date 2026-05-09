import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { bookRoutes } from "./express/routes/book-routes";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";

export const app = express();

app.use((request, response, next) => {
  const requestOrigin = request.headers.origin;
  const allowedOrigin = process.env.CORS_ORIGIN ?? requestOrigin ?? "*";

  response.header("Access-Control-Allow-Origin", allowedOrigin);
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  response.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (requestOrigin) {
    response.header("Vary", "Origin");
  }

  if (request.method === "OPTIONS") {
    response.sendStatus(204);
    return;
  }

  next();
});

app.use(express.json());

app.get("/health", (_request, response) => {
  response.status(200).json({
    data: {
      status: "ok"
    }
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", bookRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
