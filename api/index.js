const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MongoDB (esto NO usa listen, por eso Vercel lo permite)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectada"))
  .catch(err => console.error("Error al conectar MongoDB:", err));

// Rutas
const authRoutes = require("../routes/auth.js");
const todoRoutes = require("../routes/todos.js");

// Nota: en Vercel NO necesitas /api aquí porque ya estás dentro de /api
app.use("/auth.js", authRoutes);
app.use("/todos.js", todoRoutes);

// Exportar el server para Vercel
module.exports = app;
