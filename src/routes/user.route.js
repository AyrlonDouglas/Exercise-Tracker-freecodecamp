const express = require("express");
const routes = express.Router();
const exerciseControllers = require("../controllers/user.controller");

routes.post("/", exerciseControllers.newUser);
routes.get("/", exerciseControllers.getUsers);
routes.post("/:id/exercises", exerciseControllers.saveExercise);
routes.get("/:id/logs", exerciseControllers.getExercises);
module.exports = routes;
