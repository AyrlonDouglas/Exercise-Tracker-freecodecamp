const User = require("../models/user.model");
const Exercise = require("../models/exercise.model");
const { default: mongoose } = require("mongoose");

module.exports = {
  async newUser(req, res) {
    try {
      const { username } = req.body;
      console.log(username);
      const user = await User.create({ username });

      return res.json({ username: user.username, _id: user._id });
    } catch (error) {
      console.error(error.message);
      return res.json("Deu ruim em newUser");
    }
  },
  async getUsers(req, res) {
    try {
      const users = await User.find();
      const result = users.map((user, index) => {
        return { username: user.username, _id: user._id };
      });
      return res.json(result);
    } catch (error) {
      console.error(error.message);
      return res.json("Deu ruim em getUsers");
    }
  },
  async saveExercise(req, res) {
    try {
      const { id } = req.params;
      let { description, duration, date } = req.body;

      if (!date) {
        date = new Date();
      } else {
        date = new Date(date);
      }
      await Exercise.create({
        description,
        duration,
        date,
        provider: id,
      })
        .then((response) => {
          return res.json({
            description: response.description,
            duration: response.duration,
            date: new Date(response.date).toLocaleString("pt-br", {
              weekday: "short",
              month: "short",
              day: "2-digit",
              year: "numeric",
            }),
            _id: response._id,
          });
        })
        .catch((error) => {
          return res.json("DEU MUITO RUIM!!");
        });
    } catch (error) {
      console.error(error.message);
      return res.json("Deu ruim em saveExercise");
    }
  },
  async getExercises(req, res) {
    try {
      console.log("entrou abigo");
      const { id } = req.params;
      let { from, to, limit } = req.query;
      console.log(req.params, req.query);
      let user = User.findById(id);
      let logs;

      if (!to) {
        to = new Date();
      }
      if (from) {
        from = new Date(from);
      }

      if (!from) {
        logs = Exercise.find({
          provider: id,
        });
      } else if (limit && from) {
        logs = Exercise.find({
          provider: id,
          date: { $gte: from, $lte: to },
        }).limit(limit);
      } else {
        logs = Exercise.find({
          provider: id,
          date: { $gte: from, $lte: to },
        });
      }
      // let countDocs = Exercise.countDocuments({}, (err, count) => {
      //   return count;
      // });
      await Promise.all([
        logs,
        user,
        // , countDocs
      ]).then((response) => {
        logs = response[0];
        user = response[1];
        // countDocs = response[2];
      });

      // logs = logs.forEach((log) => {
      //   log.date = new Date(log.date).toLocaleString();
      // });

      return res.json({
        username: user.username,
        count: logs.length,
        _id: user._id,
        logs,
      });
    } catch (error) {
      console.error(error.message);
      return res.json("Deu ruim em getExercises");
    }
  },
};
