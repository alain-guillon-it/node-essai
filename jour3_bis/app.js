require("dotenv").config();
require("./db/connect");
const morgan = require("morgan");
const express = require("express");
const app = express();

const userAPI = require("./routes/userAPI.routes");

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 3300;

app.use("/api", userAPI);

app.listen(PORT, () => {
  console.log(`\n\tserver started on http://localhost:${PORT}`);
});
