import "reflect-metadata"
import express from "express";
import AppDataSource from "./config/db";
import UserRoutes from "./routes/UserRoutes";
import TaskRoutes from "./routes/TaskRoutes";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

// Initialize DB and start server only after successful DB connection
AppDataSource.initialize().then(() => {
  console.log("Database connected successfully");
  app.use("/user", UserRoutes);
  app.use("/task",TaskRoutes)
  app.listen(3000, () => console.log("Server running on port 3000"));
})