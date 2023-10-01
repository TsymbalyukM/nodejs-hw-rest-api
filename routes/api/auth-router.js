const express = require("express");
const {
  userRegisterValidate,
  userLoginValidate,
  userUpdateSubscriptionValidate,
} = require("../../middlewares");
const upload = require("../../middlewares/upload");

const authenticate = require("../../middlewares/authenticate");
const authControllers = require("../../controllers/auth-controller");

const authRouter = express.Router();

authRouter.post("/register", userRegisterValidate, authControllers.register);

authRouter.post("/login", userLoginValidate, authControllers.login);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.patch(
  "/",
  authenticate,
  userUpdateSubscriptionValidate,
  authControllers.updateSubscription
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatarURL"),
  authControllers.updateAvatar
);

module.exports = authRouter;
