import express from "express";
import cors from "cors";
import config from "./config/config.js";
import bookRoutes from "./routes/bookRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
