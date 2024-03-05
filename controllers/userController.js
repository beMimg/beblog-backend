const User = require("../models/user");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.get_users = async (req, res) => {
  try {
    const usernames = await User.find(
      {},
      "first_name last_name username"
    ).exec();
    res.status(200).json({ users: usernames });
  } catch (err) {
    return next(err);
  }
};

exports.post_user = [
  body("first_name").trim().isLength({ min: 1 }).escape(),
  body("last_name").trim().isLength({ min: 1 }).escape(),
  body("email").trim().escape().isEmail(),
  body("username").trim().isLength({ min: 1 }).escape(),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must have at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .escape(),
  body("password_confirmation")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords didn't match."),

  async function (req, res) {
    const errors = validationResult(req);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      creation: Date.now(),
    });

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existsUser = await User.findOne({ username: req.body.username });

    if (existsUser) {
      return res.status(409).json({ message: "This user already exists" });
    } else {
      await user.save();
      return res.status(201).json({ message: "User created", user });
    }
  },
];
