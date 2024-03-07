const User = require("../models/user");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { invalidateToken } = require("../config/authenticate");
const getRandomColor = require("../config/randomColor");

exports.get_users = async (req, res) => {
  try {
    const users = await User.find({}, "first_name last_name username").exec();
    res.status(200).json({ users: users });
  } catch (err) {
    return next(err);
  }
};

exports.post_user = [
  body("first_name").trim().isLength({ min: 1 }).escape(),
  body("last_name").trim().isLength({ min: 1 }).escape(),
  body("email").trim().escape().isEmail().withMessage("This email is invalid"),
  body("username").trim().isLength({ min: 4 }).escape(),
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
      admin: false,
      color: getRandomColor(),
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

exports.get_user = async (req, res, next) => {
  try {
    const user = await User.findById(
      req.params.id,
      "first_name last_name username"
    );
    return res.status(200).json({ user: user });
  } catch (err) {
    return res.status(404).json({ message: "This user doesn't exists" });
  }
};

exports.put_user = [
  body("first_name").trim().isLength({ min: 1 }).escape(),
  body("last_name").trim().isLength({ min: 1 }).escape(),
  body("email").trim().escape().isEmail(),
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
  body("color").trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    try {
      // So can only modify itself
      if (req.params.id !== req.user.user._id) {
        return res
          .status(403)
          .json({ message: "You are not allowed to modify other users" });
      }
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const existsUsername = await User.findOne({
        username: req.body.username,
      });

      if (existsUsername) {
        return res.status(409).json({ message: "This user already exists" });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = new User({
        _id: req.user.user._id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        username: req.user.user.username,
        password: hashedPassword,
        creation: req.user.user.creation,
        admin: false,
        color: req.body.color,
      });

      await User.findByIdAndUpdate(req.user.user._id, user, {});
      res.status(200).json({ user: user });
    } catch (err) {
      return next(err);
    }
  },
];

exports.delete_user = async (req, res, next) => {
  try {
    if (req.params.id !== req.user.user._id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to modify other users" });
    }
    await User.findByIdAndDelete(req.user.user._id);
    const token = req.headers.authorization;
    invalidateToken(token);
    res.status(200).json({ message: "user deleted" });
  } catch (err) {
    return next(err);
  }
};

exports.get_user_self = async (req, res, next) => {
  try {
    const user = await User.findById(
      req.user.user._id,
      "first_name last_name email username"
    ).exec();

    return res.status(200).json({ user: user });
  } catch (err) {
    return next(err);
  }
};
