const mongoose = require("mongoose");

const DB = process.env.DATABASE;

console.log(DB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGODB CONNECTED");
  })
  .catch((err) => { 
    console.log("DISCONNECT HOGYA");
  });
