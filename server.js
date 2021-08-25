const express = require("express");
const cors = require("cors");
const app = express();
var dotenv = require("dotenv");
dotenv.config();

var corOptions = {
  origin: true,
};

app.use(cors(corOptions));
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
  })
);

const db = require("./models");
const { url } = require("./config/db.config");
const Role = db.role;

db.mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database");
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
initial();

require("./routes/auth.routes")(app);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to PoPFlix App" });
});

app.use("/api/videos", require("./routes/videos.routes"));
app.use("/api/comments", require("./routes/comments.routes"));
app.use("/api/like", require("./routes/likes.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}.`);
});
