const express = require("express");
const path = require("path");

const app = express();
const PORT = 3002; // Frontend chạy trên port 3002

// Serve static files từ thư mục public
app.use(express.static(path.join(__dirname, "public")));

// Route mặc định trỏ về trang login
app.get("/", (req, res) => {
  res.redirect("/shared/login.html");
});

// Fallback cho SPA routing (nếu cần)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", req.path));
});

app.listen(PORT, () => {
  console.log(`MTP Frontend running at http://localhost:${PORT}`);
});
