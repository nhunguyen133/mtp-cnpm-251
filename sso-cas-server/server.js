const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const casRoutes = require("./src/casRoutes");

const app = express();
const PORT = 4000; // SSO server chạy trên port 4000

// view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static files (CSS, images)
app.use(express.static(path.join(__dirname, "public")));

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cookieSession({
    name: "fake_cas_session",
    keys: ["super-secret-key-1", "super-secret-key-2"],
    maxAge: 24 * 60 * 60 * 1000 // 1 ngày
  })
);

// routes
app.use("/cas", casRoutes);

// trang root đơn giản
app.get("/", (req, res) => {
  res.send(
    `<h2>Fake CAS Server đang chạy</h2>
     <p>Ví dụ login: <a href="/cas/login?service=http://localhost:3000/auth/callback">/cas/login?service=http://localhost:3000/auth/callback</a></p>`
  );
});

app.listen(PORT, () => {
  console.log(`Fake CAS server is running on http://localhost:${PORT}`);
});
