const mongoose = require("mongoose");

const PSEUDO = process.env.MONGODB_PSEUDO;
const PASSWORD = process.env.MONGODB_PASSWORD;
const CLUSTER = process.env.MONGODB_CLUSTER_NAME;

mongoose.set("strictQuery", true);
mongoose
  .connect(
    `mongodb+srv://${PSEUDO}:${PASSWORD}@${CLUSTER}.d51otgm.mongodb.net/?retryWrites=true&w=majority`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("\n\tConnecté à la base de donnée NoSQL\n"))
  .catch((err) => console.log(err));
