const express = require("express");

const infoRoutes = require("./info-router");
const userRoutes = require("./user-routes");
const router = express.Router();
router.use("/info", infoRoutes);
router.use("/user", userRoutes);
module.exports = router;
