const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const keys = require("../config/keys");

module.exports.login = async (req, res) => {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    const password = req.body.pwd;
    const passwordResult = bcrypt.compareSync(password, candidate.password);
    if (passwordResult) {
      const token = jwt.sign(
        {
          email: candidate.email,
          userId: candidate._id,
        },
        keys.jwt,
        { expiresIn: 60 * 60 }
      );

      res.status(200).send({
        token: `Bearer ${token}`,
      });
    } else {
      res.status(401).send({
        message: "Wrong password",
      });
    }
  } else {
    res.status(401).send({
      message: "The email address you entered is not registered",
    });
  }
};

module.exports.register = async (req, res) => {
  const candidate = await User.findOne({ email: req.body.email });

  if (candidate) {
    res.status(409).send({
      message: "Email address already exists",
    });
  } else {
    const salt = bcrypt.genSaltSync(10);
    const password = req.body.pwd;
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(password, salt),
    });

    try {
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      res.status(500).send(error);
    }
  }
};
