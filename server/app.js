// Express
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// Mongoose
const mongoose = require("mongoose");
// dotenv
require("dotenv/config");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

// cors
app.use(cors());
app.options("*", cors());

// Middleware
app.use(bodyParser.json());

// Models
require("./models/user");
require("./models/post");
require("./models/storie");
require("./models/admin");
require("./models/Conversation");
require("./models/Message");

// Routes
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/post", require("./routes/post"));
app.use("/api/main", require("./routes/main"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/conversations", require("./routes/conversation"));
app.use("/api/messages", require("./routes/messages"));

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Connect to MongoDB
try {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => console.log("db connected"));
} catch (error) {
  console.log(error);
}

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
