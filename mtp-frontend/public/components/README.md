# 📦 Components Structure

## Mô tả
Thư mục này chứa các **reusable HTML components** để tránh duplicate code giữa các trang.

## Cấu trúc

```
components/
├── sidebar.html    # Navigation sidebar component
└── topbar.html     # Top bar với thời gian và user info
```

## Cách sử dụng

### 1. Thêm containers vào HTML

```html
<div class="app">
    <!-- SIDEBAR - Loaded dynamically -->
    <div id="sidebar-container"></div>

    <!-- MAIN -->
    <main class="main">
        <!-- TOPBAR - Loaded dynamically -->
        <div id="topbar-container"></div>
        
        <!-- Your content here -->
    </main>
</div>
```

### 2. Import component loader script

```html
<!-- Cuối file, trước </body> -->
<script src="../js/components-loader.js"></script>
```

### 3. Import CSS

```html
<head>
    <!-- Dashboard CSS cho layout chung -->
    <link rel="stylesheet" href="../css/dashboard.css">
    
    <!-- Page-specific CSS -->
    <link rel="stylesheet" href="../css/your-page.css">
</head>
```

## Components

### Sidebar (`sidebar.html`)

**Nội dung:**
- Logo BK-MTP
- Navigation menu với active state
- Logout button

**Auto-features:**
- Tự động set active cho page hiện tại
- Links tới các trang: Home, Personal Info, Register, Cancel, Documents

### Topbar (`topbar.html`)

**Nội dung:**
- Thời gian real-time (HH:MM AM/PM)
- Ngày tháng (Thứ, DD/MM/YYYY)
- Notification icon với badge
- User avatar và tên

**Auto-features:**
- Cập nhật thời gian mỗi giây
- Load tên user từ API `/api/auth/me`

## Component Loader (`components-loader.js`)

### Functions

```javascript
// Load component từ file
loadComponent(elementId, componentPath)

// Set active nav item dựa trên current page
setActiveNavItem()

// Update datetime mỗi giây
updateDateTime()

// Load user info từ API
loadUserInfo()
```

### Events

- **DOMContentLoaded**: Auto load tất cả components
- **setInterval**: Update datetime mỗi giây

## Lợi ích

✅ **DRY (Don't Repeat Yourself)**: Không duplicate HTML
✅ **Maintainability**: Sửa 1 chỗ, áp dụng cho tất cả pages
✅ **Consistency**: UI/UX đồng nhất trên toàn bộ app
✅ **Auto-sync**: Active state, datetime, user info tự động

## Ví dụ pages đã áp dụng

- ✅ `student/personal-info.html`
- 🔜 `student/dashboard.html` (có thể refactor)
- 🔜 `student/register-schedule.html`
- 🔜 `tutor/dashboard.html`

## Cập nhật Components

Khi cần thay đổi sidebar hoặc topbar cho **toàn bộ app**, chỉ cần sửa:

- `components/sidebar.html` - Thay đổi navigation
- `components/topbar.html` - Thay đổi top bar
- `js/components-loader.js` - Thay đổi logic load

Tất cả pages sẽ tự động áp dụng thay đổi!
