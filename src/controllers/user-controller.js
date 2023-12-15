const { StatusCodes } = require("http-status-codes");
const { UserService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
async function signup(req, res) {
  console.log(req.body);
  try {
    const user = await UserService.createUser({
      email: req.body.email,
      password: req.body.password,
    });
    console.log(user);
    SuccessResponse.message = "Successfully created a user";
    SuccessResponse.data = user;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    ErrorResponse.message = "Something went wrong while creating a user";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
module.exports = {
  signup,
};
