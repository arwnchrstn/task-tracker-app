const mongoose = require("mongoose");

module.exports = () => {
  mongoose.connect(
    process.env.DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err) => {
      if (err) return console.error(err);

      console.log("Connected to MongoDB Atlas");
    }
  );
};
