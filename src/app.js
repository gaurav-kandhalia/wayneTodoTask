import express from "express";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import listRoutes from './routes/list.routes.js'
import todoRoutes from "./routes/todo.routes.js";


import { errorHandler } from "./middlewares/error.middleware.js";


const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({
  extended: true,
  limit: "16kb",
}));

app.use(express.static("public"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/lists",listRoutes)
app.use("/api/v1/todos", todoRoutes);
// ERROR HANDLER
app.use(errorHandler);

export { app };