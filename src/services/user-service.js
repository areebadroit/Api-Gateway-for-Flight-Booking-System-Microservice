const { UserRepository, RoleRepository } = require("../repositories");
const { AppError } = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const { Auth } = require("../utils/common");
const role = require("../models/role");
const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

async function createUser(data) {
  try {
    const user = await userRepository.create(data);
    const role = await roleRepository.getRoleByName("customer");
    await user.addRole(role);
    return user;
  } catch (error) {
    console.log(error);
    if (
      error.name == "SequelizeValidationError" ||
      error.name == "SequelizeUniqueConstraintError"
    ) {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      console.log(explanation);
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }
  }
}
async function signin(data) {
  try {
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new AppError(
        "No user found for the given email.",
        StatusCodes.NOT_FOUND
      );
    }
    const passwordMatch = Auth.checkPassword(data.password, user.password);
    if (!passwordMatch) {
      throw new AppError("Invalid password.", StatusCodes.BAD_REQUEST);
    }
    const jwt = Auth.createToken({ id: user.id, email: user.email });
    return jwt;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      "Something went wrong.",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function isAuthenticated(token) {
  try {
    if (!token) {
      throw new AppError("Missing JWT Token.", StatusCodes.BAD_REQUEST);
    }
    const response = await Auth.verifyToken(token);
    console.log(response);
    const user = await userRepository.get(response.id);
    if (!user) {
      throw new AppError("No user found.", StatusCodes.NOT_FOUND);
    }
    return user.id;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.log(error);
    if (error.name == "JsonWebTokenError") {
      throw new AppError("Invalid JWT Token.", StatusCodes.BAD_REQUEST);
    }
    if (error.name == "TokenExpiredError") {
      throw new AppError("Token is expired.", StatusCodes.BAD_REQUEST);
    }
    console.log(error);
    throw new AppError(
      "Something went wrong.",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function addRoleToUser(data) {
  try {
    const user = await userRepository.get(data.id);
    if (!user) {
      throw new AppError(
        "No user found for the given id.",
        StatusCodes.NOT_FOUND
      );
    }
    const role = await roleRepository.getRoleByName(data.role);
    if (!role) {
      throw new AppError(
        "No role found for the given name.",
        StatusCodes.NOT_FOUND
      );
    }
    const response = await user.addRole(role);
    return true;
  } catch (error) {
    throw new AppError(
      "Something went wrong while assigning the role to the user id.",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function isAdmin(id) {
  try {
    const user = await userRepository.get(id);
    if (!user) {
      throw new AppError(
        "No user found for the given email.",
        StatusCodes.NOT_FOUND
      );
    }
    const role = await roleRepository.getRoleByName("admin");
    if (!role) {
      throw new AppError(
        "No role found for the given name.",
        StatusCodes.NOT_FOUND
      );
    }
    return user.hasRole(role);
  } catch (error) {
    throw new AppError(
      "Something went wrong while checking the user's role as admin.",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
module.exports = {
  createUser,
  signin,
  isAuthenticated,
  addRoleToUser,
  isAdmin,
};
