# 🔐 SHARED - Trang Chung

## Nội dung:

File đăng nhập chung cho cả sinh viên và tutor.

## File cần tạo:

- [ ] `login.html` - Trang đăng nhập

## Chức năng:

1. Form đăng nhập với email và password
2. Xác thực thông tin từ data.js
3. Lưu thông tin đăng nhập vào localStorage
4. Redirect theo role:
   - Student → `/student/dashboard.html`
   - Tutor → `/tutor/dashboard.html`

## Template HTML:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng nhập - M-T-P</title>
    <link rel="stylesheet" href="../css/common.css">
</head>
<body>
    <div class="login-container">
        <div class="login-box">
            <h1>🎓 M-T-P System</h1>
            <p>Mentee - Tutor - Platform</p>
            
            <form id="loginForm">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="username" required 
                           placeholder="example@hcmut.edu.vn">
                </div>
                
                <div class="form-group">
                    <label>Mật khẩu</label>
                    <input type="password" id="password" required>
                </div>
                
                <button type="submit" class="btn btn-primary btn-block">
                    Đăng nhập
                </button>
            </form>
            
            <div class="demo-accounts">
                <h3>Tài khoản demo:</h3>
                <div class="demo-item">
                    <strong>Sinh viên:</strong>
                    <code>student1@hcmut.edu.vn / 123456</code>
                </div>
                <div class="demo-item">
                    <strong>Tutor:</strong>
                    <code>tutor1@hcmut.edu.vn / 123456</code>
                </div>
            </div>
        </div>
    </div>
    
    <script src="../js/data.js"></script>
    <script src="../js/auth.js"></script>
    <script>
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            const result = login(username, password);
            
            if (result.success) {
                // Redirect based on role
                if (result.user.role === 'student') {
                    window.location.href = '../student/dashboard.html';
                } else if (result.user.role === 'tutor') {
                    window.location.href = '../tutor/dashboard.html';
                }
            } else {
                alert(result.message);
            }
        });
    </script>
</body>
</html>
```