const crudRepository = require("./crud-repositories");
const { User } = require("../models");
class userRepository extends crudRepository {
  constructor() {
    super(User);
  }
}
module.exports = userRepository;
