const PORT = process.env.PORT || 5000;
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const auth = require("./middlewares/auth");
const mongoConnect = require("./connection/mongo_connection");

//mongoDB connection
mongoConnect();

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: [process.env.CORS_ORIGIN]
  })
);

//routes
app.use("/api/users", userRoutes);
app.use("/api/verify", verificationRoutes);
app.use("/api/categories", auth, taskRoutes);

//Test
app.get("/test", (req, res) => {
  res.send("Success");
});

//404 route
app.all("*", (req, res) => {
  console.error("API Route Not Found");
  res.status(404).send("API Route Not Found");
});

//port listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
