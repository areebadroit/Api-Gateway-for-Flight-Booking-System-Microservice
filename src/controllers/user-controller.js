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
async function signin(req, res) {
  console.log(req.body);
  try {
    const user = await UserService.signin({
      email: req.body.email,
      password: req.body.password,
    });
    SuccessResponse.message = "Successfully logged in.";
    SuccessResponse.data = user;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    ErrorResponse.message = "Something went wrong while logging in the user.";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
async function addRoleToUser(req, res) {
  console.log(req.body);
  try {
    const assign = await UserService.addRoleToUser({
      id: req.body.id,
      role: req.body.role,
    });
    SuccessResponse.message =
      "Successfully assigned the role to the given user.";
    SuccessResponse.data = assign;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    ErrorResponse.message =
      "Something went wrong while assigning the role to the given user.";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
module.exports = {
  signup,
  signin,
  addRoleToUser,
};
