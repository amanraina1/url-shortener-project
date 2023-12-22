const express = require("express");
const urlRoute = require("./routes/url");
const { connectToMongodb } = require("./connect");
const URL = require("./models/url");

const app = express();
const PORT = 8001;

connectToMongodb("YOUR_DB_URI")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB error...!!!", err));
app.use(express.json());
app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  return res.redirect(entry.redirectUrl);
});

app.listen(PORT, () => {
  console.log(`Server is started at PORT: ${PORT}`);
});
