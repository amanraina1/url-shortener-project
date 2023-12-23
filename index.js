const express = require("express");
const path = require("path");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const { connectToMongodb } = require("./connect");
const URL = require("./models/url");

const app = express();
const PORT = 8001;

connectToMongodb("")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB error...!!!", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/url", urlRoute);

app.use("/", staticRoute);

app.get("/api/url/:shortId", async (req, res) => {
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
