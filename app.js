const express = require("express");
const path = require("path");
const auth = require("./routes/auth");
const dashboard = require("./routes/dashboard");
const journal = require("./routes/getData");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("./public"));
app.use(cors());
app.use(cookieParser());

// Routes
app.use("/", auth);
app.use("/", journal);
app.use("/dashboard", dashboard);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.listen(5698, () => {
    console.log("Server running on port 5698....");
});
