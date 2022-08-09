const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const userRoutes = require("./src/routes/user.route");

(async function connectDB() {
  try {
    console.info("Tentando conectar com o banco de dados ...");
    await mongoose.connect(process.env.URI_MONGO);
    console.log("Conectado!");
  } catch (error) {
    console.error(`Erro ao conectar com o banco de dados: ${error.message}`);
  }
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.use("/api/users", userRoutes);

const listener = app.listen(process.env.PORT || 4000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
