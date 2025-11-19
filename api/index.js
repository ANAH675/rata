const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const authRoutes = require("../routes/auth");
const todoRoutes = require("../routes/todos");

app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

module.exports = app;
