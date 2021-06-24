const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(
    `Connected to Mongo DB: ${conn.connection.host}...`.cyan.underline.bold
  );
};

module.exports = connectDB;
