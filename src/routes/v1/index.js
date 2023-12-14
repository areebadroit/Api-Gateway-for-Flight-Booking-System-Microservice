const express = require("express");

const infoRoutes = require("./info-router");
const router = express.Router();
router.use("/info", infoRoutes);
module.exports = router;
