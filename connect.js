const mongoose = require("mongoose");

async function connectToMongodb(url) {
  await mongoose.connect(url);
}

module.exports = {
  connectToMongodb,
};
