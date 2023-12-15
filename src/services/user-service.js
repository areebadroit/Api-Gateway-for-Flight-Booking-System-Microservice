const { UserRepository } = require("../repositories");
const { AppError } = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");
const userRepository = new UserRepository();

async function createUser(data) {
  try {
    const city = await userRepository.create(data);
    return city;
  } catch (error) {
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

module.exports = {
  createUser,
};
