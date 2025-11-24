const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const cookieSession = require("cookie-session");
const cors = require("cors");

const { users } = require("./data/users");
const {
  requireAuth,
  requireRole,
  requireOwnership,
  requireOwnershipOrRole,
} = require("./middleware/auth");

const app = express();
const PORT = 3001;

// ==== middlewares ====
app.use(
  cors({
    origin: "http://localhost:3002",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  cookieSession({
    name: "mtp_session",
    keys: ["mtp-secret-1", "mtp-secret-2"],
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "lax",
  })
);

// =======================
// AUTHENTICATION ROUTES
// =======================

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "MTP Backend is running" });
});

app.get("/api/auth/login", (req, res) => {
  const service = encodeURIComponent("http://localhost:3001/api/auth/callback");
  const casLoginUrl = `http://localhost:4000/cas/login?service=${service}`;
  return res.redirect(casLoginUrl);
});

app.get("/api/auth/callback", async (req, res) => {
  const { ticket } = req.query;
  if (!ticket) {
    return res.status(400).send("Missing ticket");
  }

  const service = encodeURIComponent("http://localhost:3001/api/auth/callback");
  const validateUrl = `http://localhost:4000/cas/serviceValidate?ticket=${ticket}&service=${service}`;

  try {
    const response = await axios.get(validateUrl);
    const xml = response.data;

    xml2js.parseString(xml, (err, result) => {
      if (err) {
        console.error("Parse XML error", err);
        return res.status(500).send("XML parse error");
      }

      const success =
        result["cas:serviceResponse"] &&
        result["cas:serviceResponse"]["cas:authenticationSuccess"];

      if (!success) {
        return res
          .status(401)
          .send("Token không hợp lệ, vui lòng đăng nhập lại.");
      }

      const casUser = success[0]["cas:user"][0];
      console.log("🔍 Username from CAS:", casUser);

      const user = users.find((u) => u.username === casUser);

      if (!user) {
        console.log("❌ User not found:", casUser);
        return res
          .status(404)
          .send("Không tìm thấy người dùng trong hệ thống.");
      }

      console.log("✅ User found:", user.username, "-", user.role);

      // Lưu thông tin user vào session
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        mssv: user.mssv,
        faculty: user.faculty,
        major: user.major,
        email: user.email,
      };

      // Redirect theo role
      const frontendUrl = "http://localhost:3002";
      if (user.role === "tutor") {
        return res.redirect(`${frontendUrl}/tutor/dashboard.html`);
      }

      return res.redirect(`${frontendUrl}/student/dashboard.html`);
    });
  } catch (error) {
    console.error("CAS validate error", error.message);
    return res.status(500).send("Lỗi xác minh ticket với CAS.");
  }
});

app.get("/api/auth/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ loggedIn: false });
  }
  return res.json({ loggedIn: true, user: req.session.user });
});

app.get("/api/auth/logout", (req, res) => {
  req.session = null;
  // Redirect đến CAS logout để xóa cả session CAS, sau đó CAS sẽ redirect về login
  const casLogoutUrl = "http://localhost:4000/cas/logout?service=http://localhost:3002/shared/login.html";
  res.redirect(casLogoutUrl);
});

// =======================
// API ENDPOINTS VỚI PHÂN QUYỀN
// =======================

// ===== API CHO TẤT CẢ USER ĐÃ ĐĂNG NHẬP =====

// Lấy thông tin profile của chính mình
app.get("/api/profile", requireAuth, (req, res) => {
  const user = users.find((u) => u.id === req.session.user.id);
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }
  res.json({ success: true, data: user });
});

// ===== API CHỈ CHO STUDENT =====

// Student xem danh sách sessions (các buổi tutor)
app.get("/api/student/sessions", requireRole("student"), (req, res) => {
  // TODO: Lấy từ database
  res.json({
    success: true,
    data: [
      {
        id: 1,
        tutorName: "Lê Đình Thuận",
        subject: "Công nghệ phần mềm",
        date: "2025-11-25",
        time: "13:00 - 15:00",
        status: "available",
      },
    ],
  });
});

// Student đăng ký session
app.post(
  "/api/student/sessions/:sessionId/register",
  requireRole("student"),
  (req, res) => {
    const { sessionId } = req.params;
    const studentId = req.session.user.id;

    console.log(`Student ${studentId} đăng ký session ${sessionId}`);

    res.json({
      success: true,
      message: "Đăng ký session thành công",
      data: { sessionId, studentId },
    });
  }
);

// Student hủy đăng ký session
app.delete(
  "/api/student/sessions/:sessionId/register",
  requireRole("student"),
  (req, res) => {
    const { sessionId } = req.params;
    const studentId = req.session.user.id;

    console.log(`Student ${studentId} hủy session ${sessionId}`);

    res.json({
      success: true,
      message: "Hủy session thành công",
    });
  }
);

// Student xem các session đã đăng ký của mình
app.get("/api/student/my-sessions", requireRole("student"), (req, res) => {
  const studentId = req.session.user.id;

  // TODO: Lấy từ database
  res.json({
    success: true,
    data: [
      {
        id: 1,
        tutorName: "Lê Đình Thuận",
        subject: "Công nghệ phần mềm",
        date: "2025-11-25",
        time: "13:00 - 15:00",
        status: "registered",
      },
    ],
  });
});

// ===== API CHỈ CHO TUTOR =====

// Tutor xem danh sách students đã đăng ký
app.get("/api/tutor/sessions", requireRole("tutor"), (req, res) => {
  const tutorId = req.session.user.id;

  // TODO: Lấy từ database
  res.json({
    success: true,
    data: [
      {
        id: 1,
        subject: "Công nghệ phần mềm",
        date: "2025-11-25",
        time: "13:00 - 15:00",
        registeredStudents: 5,
        maxStudents: 20,
      },
    ],
  });
});

// Tutor tạo session mới
app.post("/api/tutor/sessions", requireRole("tutor"), (req, res) => {
  const tutorId = req.session.user.id;
  const { subject, date, time, maxStudents } = req.body;

  console.log(`Tutor ${tutorId} tạo session mới:`, {
    subject,
    date,
    time,
    maxStudents,
  });

  res.json({
    success: true,
    message: "Tạo session thành công",
    data: { id: Date.now(), tutorId, subject, date, time, maxStudents },
  });
});

// Tutor xem danh sách students trong session
app.get(
  "/api/tutor/sessions/:sessionId/students",
  requireRole("tutor"),
  (req, res) => {
    const { sessionId } = req.params;

    // TODO: Lấy từ database
    res.json({
      success: true,
      data: [
        {
          id: 1,
          name: "Nguyễn Quỳnh Như",
          mssv: "2312535",
          email: "nhu.nguyen@hcmut.edu.vn",
        },
      ],
    });
  }
);

// Tutor cập nhật thông tin session
app.put("/api/tutor/sessions/:sessionId", requireRole("tutor"), (req, res) => {
  const { sessionId } = req.params;
  const tutorId = req.session.user.id;
  const updateData = req.body;

  console.log(`Tutor ${tutorId} cập nhật session ${sessionId}:`, updateData);

  res.json({
    success: true,
    message: "Cập nhật session thành công",
  });
});

// Tutor xóa session
app.delete(
  "/api/tutor/sessions/:sessionId",
  requireRole("tutor"),
  (req, res) => {
    const { sessionId } = req.params;
    const tutorId = req.session.user.id;

    console.log(`Tutor ${tutorId} xóa session ${sessionId}`);

    res.json({
      success: true,
      message: "Xóa session thành công",
    });
  }
);

// ===== API CHO CẢ STUDENT VÀ TUTOR =====

// Xem danh sách tất cả tutors
app.get("/api/tutors", requireRole("student", "tutor"), (req, res) => {
  const tutors = users.filter((u) => u.role === "tutor");
  res.json({ success: true, data: tutors });
});

// Xem thông tin chi tiết 1 tutor
app.get("/api/tutors/:id", requireRole("student", "tutor"), (req, res) => {
  const tutorId = parseInt(req.params.id);
  const tutor = users.find((u) => u.id === tutorId && u.role === "tutor");

  if (!tutor) {
    return res.status(404).json({ success: false, error: "Tutor not found" });
  }

  res.json({ success: true, data: tutor });
});

// ===== API VỚI OWNERSHIP CHECK =====

// Xem thông tin user theo ID (chỉ xem được của mình, trừ khi là tutor)
app.get(
  "/api/users/:id",
  requireOwnershipOrRole("tutor", "admin"),
  (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, data: user });
  }
);

// ===== ADMIN API (ví dụ) =====

// Chỉ admin mới xem được danh sách tất cả users
app.get("/api/admin/users", requireRole("admin"), (req, res) => {
  res.json({ success: true, data: users });
});

// =======================

app.listen(PORT, () => {
  console.log(`   MTP Backend API running at http://localhost:${PORT}`);
  console.log(`   Frontend at http://localhost:3002`);
  console.log(`\n Authorization Middleware:`);
  console.log(`   - requireAuth: Check if user is logged in`);
  console.log(`   - requireRole('student'): Only students`);
  console.log(`   - requireRole('tutor'): Only tutors`);
  console.log(`   - requireRole('student', 'tutor'): Both roles`);
  console.log(`   - requireOwnership: Only access own data`);
  console.log(`   - requireOwnershipOrRole: Own data or specific role\n`);
});
