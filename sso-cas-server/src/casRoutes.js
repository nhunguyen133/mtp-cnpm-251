const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { findUser } = require("./users");
const { allowedServices } = require("./config");

const router = express.Router();

// Lưu ticket đơn giản trong RAM
// ticketStore[ticket] = { username, service, createdAt }
const ticketStore = {};

// Helper: kiểm tra service có hợp lệ không (demo cho qua hết)
function isServiceAllowed(service) {
  if (!service) return false;
  if (!allowedServices || allowedServices.length === 0) return true; // không cấu hình => cho tất
  return allowedServices.includes(service);
}

// Helper: tạo ticket
function createServiceTicket(username, service) {
  const ticket = "ST-" + uuidv4();
  ticketStore[ticket] = {
    username,
    service,
    createdAt: Date.now()
  };
  return ticket;
}

/**
 * GET /cas/login
 * Hiển thị form login giống CAS.
 * Nếu đã đăng nhập và có ?service=..., sinh ticket và redirect.
 */
router.get("/login", (req, res) => {
  const service = req.query.service;

  // Nếu có session user và có service => khỏi cần nhập lại
  if (req.session && req.session.username && service) {
    if (!isServiceAllowed(service)) {
      return res.status(400).send("Service not allowed in SSO_CAS");
    }
    const ticket = createServiceTicket(req.session.username, service);
    return res.redirect(`${service}${service.includes("?") ? "&" : "?"}ticket=${ticket}`);
  }

  // Chưa login => render form
  res.render("login", {
    service,
    error: null
  });
});

/**
 * POST /cas/login
 * Xử lý username/password từ form, nếu ok thì sinh ticket và redirect về service
 */
router.post("/login", (req, res) => {
  const { username, password, service } = req.body;

  if (!service) {
    return res.status(400).send("Missing service parameter");
  }

  if (!isServiceAllowed(service)) {
    return res.status(400).send("Service not allowed in SSO_CAS");
  }

  const user = findUser(username, password);

  if (!user) {
    // Sai tài khoản, render lại form
    return res.render("login", {
      service,
      error: "Sai tên đăng nhập hoặc mật khẩu (SSO_CAS)."
    });
  }

  // Lưu session (để nếu sau đó login lại với service khác thì khỏi gõ lại pass)
  req.session.username = user.username;
  req.session.displayName = user.displayName;

  const ticket = createServiceTicket(user.username, service);

  // Redirect về service kèm ticket giống CAS
  const url = `${service}${service.includes("?") ? "&" : "?"}ticket=${ticket}`;
  return res.redirect(url);
});

/**
 * GET /cas/logout
 * Xoá session CAS, nếu có service thì redirect về đó
 */
router.get("/logout", (req, res) => {
  req.session = null; // xoá cookie-session

  const service = req.query.service;
  if (service) {
    // Redirect về service sau khi logout (chuẩn CAS)
    return res.redirect(service);
  }

  res.send(
    `<h3>Bạn đã logout khỏi SSO_CAS.</h3>
     <p><a href="/cas/login">Đăng nhập lại</a></p>`
  );
});

/**
 * GET /cas/serviceValidate
 * Giống CAS thật: nhận ticket + service, trả về XML
 */
router.get("/serviceValidate", (req, res) => {
  const { ticket, service } = req.query;

  res.type("text/xml");

  if (!ticket || !service) {
    return res.send(`
      <cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
        <cas:authenticationFailure code="INVALID_REQUEST">
          missing ticket or service
        </cas:authenticationFailure>
      </cas:serviceResponse>
    `);
  }

  const record = ticketStore[ticket];

  if (!record) {
    return res.send(`
      <cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
        <cas:authenticationFailure code="INVALID_TICKET">
          Ticket not recognized
        </cas:authenticationFailure>
      </cas:serviceResponse>
    `);
  }

  // (option) kiểm tra service khớp
  if (record.service !== service) {
    return res.send(`
      <cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
        <cas:authenticationFailure code="INVALID_SERVICE">
          Service does not match for this ticket
        </cas:authenticationFailure>
      </cas:serviceResponse>
    `);
  }

  // ticket dùng 1 lần
  delete ticketStore[ticket];

  const username = record.username;

  return res.send(`
    <cas:serviceResponse xmlns:cas="http://www.yale.edu/tp/cas">
      <cas:authenticationSuccess>
        <cas:user>${username}</cas:user>
      </cas:authenticationSuccess>
    </cas:serviceResponse>
  `);
});

module.exports = router;
