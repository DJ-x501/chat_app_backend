const { prisma } = require("../config/database");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
//register user function
async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(403)
      .json({ status: false, message: "all the fields are required!!" });
  }
  try {
    const existingUser = await prisma.users.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      return res
        .status(403)
        .json({ status: false, message: "email already accquired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });
    const token = await generateToken(user.id);
    return res.status(201).json({
      status: true,
      message: "user registered successfully",
      data: user,
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "internal server error",
      error: err.message,
    });
  }
}

//lgin user function

async function login(req, res) {
  console.log("req.body=>>>>>>>>", req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ status: false, message: "Enter login email and passowrd" });
  }
  try {
    const user = await prisma.users.findUnique({ where: { email: email } });
    if (!user) {
      return res.status(403).json({ status: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(403)
        .json({ status: false, message: "login credientials Invalid" });
    }
    const token = await generateToken(user.id);
    return res.status(200).json({
      status: true,
      message: "Login Successfully",
      data: user,
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
}

module.exports = { register, login };
