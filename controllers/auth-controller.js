var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const User = require("../models/User");
const { HttpError } = require("../helpers");
const { ctrlWrapper } = require("../decorators");

const { JWT_SECRET } = process.env;

const avatarsPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { protocol: "https", s: "250" });
  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json({
    user: {
      email: `${result.email}`,
      subscription: `${result.subscription}`,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const { _id: id } = user;
  const payload = {
    id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, { token });
  res.json({
    token: `${token}`,
    user: {
      email: `${user.email}`,
      subscription: `${user.subscription}`,
    },
  });
};
const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email: `${email}`,
    subscription: `${subscription}`,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
};

const updateSubscription = async (req, res, next) => {
  const { _id, email } = req.user;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(_id, { subscription });
  res.json({
    _id,
    email: `${email}`,
    subscription: `${subscription}`,
  });
};

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);

  await Jimp.read(oldPath).then((image) => {
    return image.resize(250, 250).writeAsync(oldPath);
  });

  fs.rename(oldPath, newPath);
  const avatar = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL: `${avatar}` });
  res.json({
    avatarURL: avatar,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar)
};
