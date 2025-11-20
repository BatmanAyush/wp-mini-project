const User = require("../models/User");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const JWT_SECRET = "123456";

const authController = require("express").Router();

authController.post("/register", async (req, res) => {
  try {
    console.log("Attempting register with:", req.body); // Log the incoming data

    const isExisting = await User.findOne({ email: req.body.email });
    if (isExisting) {
      console.log("Email already exists");
      return res.status(404).json({ msg: "User already registered" });
    }

    // ADDED: Check if Username exists too
    const isExistingUsername = await User.findOne({ username: req.body.username });
    if (isExistingUsername) {
      console.log("Username already exists");
      return res.status(500).json({ msg: "Username already taken" });
    }

    if (req.body.username === "" || req.body.email === "" || req.body.password === "") {
      console.log("Empty fields detected");
      return res.status(500).json({ msg: "All fields must be populated" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({ ...req.body, password: hashedPassword });
    await user.save();

    const {password, ...others} = user._doc
    const token = createToken(user);

    console.log("Register Success!");
    return res.status(201).json({ others, token });
  } catch (error) {
    console.log("REGISTER ERROR:", error); // <--- THIS IS KEY
    return res.status(500).json(error);
  }
});
authController.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    return res.status(500).json({ msg: "All fields must be populated" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Invalid credentials" });
    }
    const comparePass = await bcrypt.compare(req.body.password, user.password);
    if (!comparePass) {
      return res.status(404).json({ msg: "Invalid credentials" });
    }

    const {password, ...others} = user._doc
    const token = createToken(user);

    return res.status(200).json({ others, token });
  }catch (error) {
    console.log(error); // <--- ADD THIS LINE
    return res.status(500).json({ msg: error.message }); // <--- OPTIONAL: helps frontend see it too
  }
});

const createToken = (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
  };

  const token = jwt.sign(payload, JWT_SECRET);

  return token;
};

module.exports = authController 
