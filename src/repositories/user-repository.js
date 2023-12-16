const crudRepository = require("./crud-repositories");
const { User } = require("../models");
class userRepository extends crudRepository {
  constructor() {
    super(User);
  }
  async getUserByEmail(email) {
    const user = await User.findOne({ where: { email: email } });
    return user;
  }
}
module.exports = userRepository;
