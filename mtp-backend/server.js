const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const cookieSession = require("cookie-session");
const cors = require("cors");

// Import data từ data layer (đã refactor)
const { users } = require("./data");

const {
  requireAuth,
  requireRole,
  requireOwnership,
  requireOwnershipOrRole,
} = require("./middleware/auth");

const app = express();
const PORT = 3001;
let meetings = require("./data/meeting");
let classes = require("./data/class"); // Giả sử bạn đã có file này như mô tả
let notifications = require("./data/notifications");
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
      console.log("Username from CAS:", casUser);

      const user = users.find((u) => u.username === casUser);

      if (!user) {
        console.log("User not found:", casUser);
        return res
          .status(404)
          .send("Không tìm thấy người dùng trong hệ thống.");
      }

      console.log("User found:", user.username, "-", user.role);

      // Lưu thông tin user vào session
      req.session.user = {
        username: user.username,
        role: user.role,
        name: user.name,
        mssv: user.mssv || null,      // Chỉ có nếu là student
        mscb: user.mscb || null,      // Chỉ có nếu là tutor
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
  
  // Tìm user đầy đủ từ database (users.js) dựa trên username
  const fullUser = users.find(u => u.username === req.session.user.username);
  
  if (fullUser) {
    // Trả về user với đầy đủ thông tin, không bao gồm password
    const { password, ...userWithoutPassword } = fullUser;
    return res.json({ loggedIn: true, user: userWithoutPassword });
  }
  
  // Fallback: trả về session user nếu không tìm thấy
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

// Student xem danh sách sessions có thể đăng ký (available sessions)
app.get("/api/student/sessions", requireRole("student"), (req, res) => {
  const { sessions, registrations } = require("./data");
  const studentMSSV = req.session.user.mssv;

  // Lọc sessions đang open và chưa đăng ký
  const registeredSessionIds = registrations
    .filter(r => r.mssv === studentMSSV && r.status === 'confirmed')
    .map(r => r.sessionId);

  // Tính toán currentStudents thực tế từ registrations
  const sessionsWithCount = sessions.map(session => {
    const actualCount = registrations.filter(
      r => r.sessionId === session.id && r.status === 'confirmed'
    ).length;
    
    return {
      ...session,
      currentStudents: actualCount
    };
  });

  const availableSessions = sessionsWithCount.filter(session => {
    // Chỉ hiển thị sessions:
    // 1. Đang open
    // 2. Chưa đăng ký
    // 3. Còn chỗ (currentStudents < maxStudents)
    return session.status === 'open' 
      && !registeredSessionIds.includes(session.id)
      && session.currentStudents < session.maxStudents;
  });

  res.json({
    success: true,
    data: availableSessions
  });
});

// Student đăng ký session
app.post(
  "/api/student/sessions/:sessionId/register",
  requireRole("student"),
  (req, res) => {
    const { sessions, registrations } = require("./data");
    const sessionId = parseInt(req.params.sessionId);
    const studentMSSV = req.session.user.mssv;

    // Kiểm tra session tồn tại
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy buổi học"
      });
    }

    // Kiểm tra session còn mở không
    if (session.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: "Buổi học đã đóng đăng ký"
      });
    }

    // Kiểm tra còn chỗ không (tính động từ registrations)
    const actualCount = registrations.filter(
      r => r.sessionId === sessionId && r.status === 'confirmed'
    ).length;
    
    if (actualCount >= session.maxStudents) {
      return res.status(400).json({
        success: false,
        message: "Buổi học đã đầy"
      });
    }

    // Kiểm tra đã đăng ký chưa
    const existingRegistration = registrations.find(
      r => r.sessionId === sessionId && r.mssv === studentMSSV
    );

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đăng ký buổi học này rồi"
      });
    }

    // Tạo registration mới
    const newRegistration = {
      id: registrations.length + 1,
      sessionId: sessionId,
      mssv: studentMSSV,
      status: 'confirmed',
      registeredAt: new Date().toISOString()
    };

    registrations.push(newRegistration);

    console.log(`Student ${studentMSSV} đăng ký session ${sessionId}`);

    res.json({
      success: true,
      message: "Đăng ký buổi học thành công!",
      data: {
        registration: newRegistration,
        session: {
          ...session,
          currentStudents: actualCount + 1
        }
      }
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
  const { sessions, registrations } = require("./data");
  const studentMSSV = req.session.user.mssv;

  // Lấy danh sách session mà student đã đăng ký
  const studentRegistrations = registrations.filter(
    reg => reg.mssv === studentMSSV && reg.status === 'confirmed'
  );

  // Lấy thông tin chi tiết của các session
  const studentSessions = studentRegistrations.map(reg => {
    const session = sessions.find(s => s.id === reg.sessionId);
    if (session) {
      // Tính currentStudents thực tế
      const actualCount = registrations.filter(
        r => r.sessionId === session.id && r.status === 'confirmed'
      ).length;
      
      return {
        id: session.id,
        tutorName: session.tutorName,
        subject: session.subject,
        title: session.title,
        description: session.description,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        location: session.location,
        type: session.type,
        maxStudents: session.maxStudents,
        currentStudents: actualCount,
        status: reg.status,
        registeredAt: reg.registeredAt
      };
    }
    return null;
  }).filter(s => s !== null);

  res.json({
    success: true,
    data: studentSessions
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

let tutorAvailability = require("./data/tutorAvailability");
app.get("/api/tutor/availability", requireRole("tutor"), (req, res) => {
    const userMscb = req.session.user.mscb; // Lấy MSCB của user đang login

    // Lọc ra các lịch của tutor này
    const mySchedules = tutorAvailability.filter(item => item.mscb === userMscb);

    res.json({
        success: true,
        data: mySchedules
    });
});

// 2. API Cập nhật/Thêm/Xóa lịch
app.post("/api/tutor/availability", requireRole("tutor"), (req, res) => {
    const userMscb = req.session.user.mscb;
    const userName = req.session.user.name;
    const { date, status, startTime, endTime, location, note, type } = req.body;

    // Tìm xem ngày đó đã có lịch chưa
    const index = tutorAvailability.findIndex(
        item => item.mscb === userMscb && item.date === date
    );

    if (status === null) {
        // --- DELETE ---
        if (index !== -1) {
            tutorAvailability.splice(index, 1);
        }
    } else {
        // Mapping status frontend sang backend status
        // Frontend: 'free' (xanh), 'opened' (vàng), 'busy' (đen)
        // Backend: 'available', 'class_opened', 'busy'
        let dbStatus = 'available';
        if (status === 'opened') dbStatus = 'class_opened';
        if (status === 'busy') dbStatus = 'busy';

        const newItem = {
            id: index !== -1 ? tutorAvailability[index].id : Date.now(), // Giữ ID cũ hoặc tạo mới
            mscb: userMscb,
            tutorName: userName,
            dayOfWeek: new Date(date).toLocaleDateString('en-US', { weekday: 'long' }),
            date: date,
            startTime: startTime || "",
            endTime: endTime || "",
            location: location || "",
            type: type || "offline",
            status: dbStatus,
            note: note || ""
        };

        if (index !== -1) {
            // --- UPDATE ---
            tutorAvailability[index] = newItem;
        } else {
            // --- CREATE ---
            tutorAvailability.push(newItem);
        }
    }

    // Trả về danh sách mới nhất của user đó
    const updatedSchedules = tutorAvailability.filter(item => item.mscb === userMscb);
    res.json({ success: true, message: "Cập nhật thành công", data: updatedSchedules });
});
// ===== API QUẢN LÝ BUỔI GẶP (MEETINGS) =====

// 1. Lấy danh sách buổi gặp
app.get("/api/tutor/meetings", requireRole("tutor"), (req, res) => {
    const userMscb = req.session.user.mscb;
    const myMeetings = meetings.filter(m => m.mscb === userMscb);
    res.json({ success: true, data: myMeetings });
});

// 2. Lấy chi tiết buổi gặp
app.get("/api/tutor/meetings/:id", requireRole("tutor"), (req, res) => {
    const id = parseInt(req.params.id);
    const meeting = meetings.find(m => m.id === id);
    if(meeting) res.json({ success: true, data: meeting });
    else res.status(404).json({ success: false, message: "Not found" });
});

// 3. Cập nhật trạng thái buổi gặp (Xác nhận / Hủy)
app.put("/api/tutor/meetings/:id", requireRole("tutor"), (req, res) => {
    const id = parseInt(req.params.id);
    const { status, reason } = req.body;
    
    const idx = meetings.findIndex(m => m.id === id);
    if (idx !== -1) {
        // Nếu là hủy -> Có thể xóa hoặc đổi status. Ở đây ta xóa cho đơn giản hoặc đổi status
        if (status === 'Đã hủy') {
            meetings.splice(idx, 1); // Xóa khỏi danh sách
        } else {
            meetings[idx].status = status; // Cập nhật (VD: Chờ xác nhận -> Đã mở)
        }
        res.json({ success: true, message: "Cập nhật thành công" });
    } else {
        res.status(404).json({ success: false, message: "Not found" });
    }
});

// 4. Tạo buổi gặp mới
app.post("/api/tutor/meetings", requireRole("tutor"), (req, res) => {
    const user = req.session.user;
    // Nhận thêm className từ body
    const { subject, className, date, time, format, link, description } = req.body;

    const newMeeting = {
        id: Date.now(),
        mscb: user.mscb,
        subject: subject,
        class: className || "Tư vấn", // Lưu tên lớp (VD: L01)
        time: time,
        date: date,
        count: '0/20',
        status: 'Chờ xác nhận',
        format: format,
        room: link || 'Chưa cập nhật'
    };
    
    meetings.push(newMeeting);
    res.json({ success: true, message: "Tạo thành công" });
});

// ===== API THÔNG BÁO & LỚP HỌC =====

// 5. Lấy danh sách lớp của Tutor (để hiện modal gửi thông báo)
app.get("/api/tutor/classes", requireRole("tutor"), (req, res) => {
    const userMscb = req.session.user.mscb;
    const myClasses = classes.filter(c => c.mscb === userMscb);
    res.json({ success: true, data: myClasses });
});

// 6. Gửi thông báo (Cập nhật vào data/notifications.js)
app.post("/api/tutor/send-notifications", requireRole("tutor"), (req, res) => {
    const { classIds } = req.body; // Mảng id của các lớp được chọn
    
    let count = 0;
    
    // Duyệt qua các lớp được chọn
    classIds.forEach(clsId => {
        const cls = classes.find(c => c.id === parseInt(clsId));
        if (cls && cls.students) {
            // Duyệt qua từng sinh viên trong lớp
            cls.students.forEach(mssv => {
                notifications.push({
                    id: Date.now() + Math.random(),
                    mssv: mssv,
                    title: `Thông báo từ lớp ${cls.subject}`,
                    message: `Giảng viên ${cls.tutorName} đã gửi một thông báo mới cho lớp ${cls.title}.`,
                    type: 'info',
                    isRead: false,
                    createdAt: new Date().toISOString()
                });
                count++;
            });
        }
    });

    res.json({ success: true, message: `Đã gửi thông báo cho ${count} sinh viên.` });
});

// ===== API TIẾN ĐỘ SINH VIÊN =====

// 1. Lấy danh sách lớp của Tutor (để hiển thị bảng 1)
// (Đã có API /api/tutor/classes ở bước trước, có thể tái sử dụng)

// 2. Lấy danh sách chi tiết sinh viên của một lớp
app.get("/api/tutor/classes/:classId/students", requireRole("tutor"), (req, res) => {
    const classId = parseInt(req.params.classId);
    
    // Tìm lớp học
    const targetClass = require("./data/class").find(c => c.id === classId);
    
    if (!targetClass) {
        return res.status(404).json({ success: false, message: "Class not found" });
    }

    // Map từ mảng MSSV ['231...', '...'] sang object User đầy đủ
    const studentList = targetClass.students.map(mssv => {
        const user = users.find(u => u.mssv === mssv);
        if (user) {
            // Chỉ trả về info cần thiết, bỏ password
            return {
                mssv: user.mssv,
                name: user.name,
                email: user.email,
                faculty: user.faculty,
                major: user.major
                // Có thể thêm avatar nếu có
            };
        }
        return null;
    }).filter(u => u !== null);

    res.json({ success: true, data: studentList, classTitle: targetClass.title });
});

// 3. Lấy thông tin chi tiết 1 sinh viên (theo MSSV)
app.get("/api/student-info/:mssv", requireRole("tutor"), (req, res) => {
    const mssv = req.params.mssv;
    const user = users.find(u => u.mssv === mssv);
    
    if (!user) {
        return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ 
        success: true, 
        data: {
            name: user.name,
            mssv: user.mssv,
            email: user.email,
            faculty: user.faculty,
            major: user.major,
            status: "Đang học" // Mock trạng thái
        }
    });
});
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
