const express = require("express");

const { AuthRequestMiddleware } = require("../../middlewares");
const infoRoutes = require("./info-router");
const userRoutes = require("./user-routes");
const router = express.Router();
router.use("/info", AuthRequestMiddleware.checkAuth, infoRoutes);
router.use("/user", userRoutes);
module.exports = router;
