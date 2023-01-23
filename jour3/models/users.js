const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("users", userSchema);
