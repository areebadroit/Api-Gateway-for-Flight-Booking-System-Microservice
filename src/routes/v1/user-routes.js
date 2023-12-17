const express = require("express");
const { UserController } = require("../../controllers");
const { AuthRequestMiddleware } = require("../../middlewares");
const router = express.Router();

router.post("/signup", UserController.signup);
router.post(
  "/signin",
  AuthRequestMiddleware.validateSigninRequest,
  UserController.signin
);
router.post(
  "/assignrole",
  AuthRequestMiddleware.checkAuth,
  AuthRequestMiddleware.isAdmin,
  UserController.addRoleToUser
);

module.exports = router;
