const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// require('dotenv/config');

const { registerValidation, loginValidation } = require("../utils/validation");

router.post("/", async (req, res) => {
  // Registering new user data validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking for duplicate email
  const existingEmail = await User.findOne({ email: req.body.email });
  if (existingEmail) return res.status(400).send("Email already exists");

  // password hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Register new user
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    password: hashedPassword
  });

  try {
    const savedUser = await user.save();
    res.send({ userId: savedUser._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  // Registering user data validation
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Checking if user using email or mobile number
  const { email, phone, password } = req.body;
  let user;
  if (email && email !== "" && email !== undefined) {
    // Checking if user email exists
    user = await User.findOne({ email: email });
    if (!user)
      return res.status(400).send("Email, mobile number or Password is wrong");
  } else if (phone && phone !== "" && phone !== undefined) {
    // Checking if user phone exists
    user = await User.findOne({ phone: phone });
    if (!user)
      return res.status(400).send("Email, mobile number or Password is wrong");
  } else {
    return res.status(400).send("Please enter an email or mobile number");
  }

  // Checking if password is correct
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).send("Email, mobile number or Password is wrong");

  // Creat and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth_token", token).send(token);
});

module.exports = router;
