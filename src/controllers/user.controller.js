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
      let user = await User.findById(id);
      await Exercise.create({
        description,
        duration,
        date,
        provider: id,
      })
        .then((response) => {
          return res.json({
            _id: user._id,
            username: user.username,
            date: new Date(response.date).toDateString(),
            duration: response.duration,
            description: response.description,
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
        }).lean();
      } else if (limit && from) {
        logs = Exercise.find({
          provider: id,
          date: { $gte: from, $lte: to },
        })
          .limit(limit)
          .lean();
      } else {
        logs = Exercise.find({
          provider: id,
          date: { $gte: from, $lte: to },
        }).lean();
      }

      await Promise.all([logs, user]).then((response) => {
        logs = response[0].map((log) => {
          delete log._id;
          delete log.provider;
          delete log.__v;
          return {
            ...log,
            date: log.date.toDateString(),
          };
        });
        user = response[1];
      });

      return res.json({
        _id: user._id,
        username: user.username,
        count: logs.length,
        log: logs,
      });
    } catch (error) {
      console.error(error.message);
      return res.json("Deu ruim em getExercises");
    }
  },
};
