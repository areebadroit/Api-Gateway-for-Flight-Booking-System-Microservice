const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/common");
const { AppError } = require("../utils/errors/app-error");
const { UserService } = require("../services");
function validateSigninRequest(req, res, next) {
  if (!req.body.email) {
    ErrorResponse.message = "Something went wrong while logging in";
    ErrorResponse.error = new AppError(
      ["Email not found in incoming request"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  if (!req.body.password) {
    ErrorResponse.message = "Something went wrong while logging in";
    ErrorResponse.error = new AppError(
      ["Password not found in incoming request"],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  next();
}
async function checkAuth(req, res, next) {
  try {
    const response = await UserService.isAuthenticated(
      req.headers["x-access-token"]
    );
    console.log("response: " + response);
    if (response) {
      req.userId = response; //The respone will have userid which could be helpful for us in future to retrieve user record by id, so adding it in the req
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).json(error);
  }
}
async function isAdmin(req, res, next) {
  const response = await UserService.isAdmin(req.userId);
  if (!response) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "User not authorized for the action" });
  }
  console.log(response);
  next();
}
module.exports = {
  validateSigninRequest,
  checkAuth,
  isAdmin,
};
