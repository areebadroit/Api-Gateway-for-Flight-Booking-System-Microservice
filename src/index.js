const express = require("express");

const { ServerConfig, Logger } = require("./config");
const { createProxyMiddleware } = require("http-proxy-middleware");
const apiRoutes = require("./routes");
const rateLimit = require("express-rate-limit");

const app = express();

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 30, // Limit each IP to 30 requests per `window` (here, per 2 minutes)
});

app.use(express.json()); //Helps to parse the incoming request body as json
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

app.use("/api", apiRoutes);
app.use(
  "/flightsservice",
  createProxyMiddleware({
    target: ServerConfig.FLIGHT_SERVICE,
    changeOrigin: true,
    pathRewrite: { '/flightsservice"': "/" },
  })
);
app.use(
  "/bookingservice",
  createProxyMiddleware({
    target: ServerConfig.BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite: { '/bookingservice"': "/" },
  })
);
app.listen(ServerConfig.PORT, async () => {
  console.log(`Server started at PORT: ${ServerConfig.PORT}`);
  Logger.info("Server up and running.");
});
