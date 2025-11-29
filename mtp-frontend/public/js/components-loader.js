/**
 * Component Loader - Load reusable HTML components
 * Tải các components HTML có thể tái sử dụng (sidebar, topbar, etc.)
 */

// Load component từ file HTML
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
}

// Load tất cả components khi DOM ready
document.addEventListener('DOMContentLoaded', async function() {
    // Load sidebar
    
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        let sidebarPath = '../components/sidebar.html'; // Mặc định là Student
        
        // Kiểm tra đường dẫn URL hiện tại
        const path = window.location.pathname;

        if (path.includes('/tutor/')) {
            sidebarPath = '../components/sidebar-tutor.html';
        } else if (path.includes('/admin/')) { 
            // QUAN TRỌNG: Phải có dòng này để load sidebar Admin
            sidebarPath = '../components/sidebar-admin.html';
        }

        await loadComponent('sidebar-container', sidebarPath);
        setActiveNavItem();    
        initSidebarToggle();   
    }
    
    // Load topbar
    const topbarContainer = document.getElementById('topbar-container');
    if (topbarContainer) {
        await loadComponent('topbar-container', '../components/topbar.html');
        updateDateTime(); // Update thời gian sau khi load
        setInterval(updateDateTime, 1000); // Update mỗi giây
    }

    // Load user info nếu có
    loadUserInfo();
});

// Set active state cho nav item dựa trên current page
function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        if (href && href.includes(currentPage)) {
            item.classList.add('active');
        }
    });

    // Nếu là dashboard.html hoặc index, active Home
    if (currentPage === 'dashboard.html' || currentPage === 'index.html' || currentPage === '') {
        const homeItem = document.querySelector('[data-page="home"]');
        if (homeItem) homeItem.classList.add('active');
    }
}

// Update ngày giờ trong topbar
function updateDateTime() {
    const now = new Date();
    
    // Format thời gian: HH:MM AM/PM
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const timeString = `${displayHours}:${minutes} ${ampm}`;
    
    // Format ngày: Thứ, DD/MM/YYYY
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayName = days[now.getDay()];
    const date = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    const dateString = `${dayName}, ${date}/${month}/${year}`;
    
    // Update DOM
    const timeText = document.querySelector('.time-text');
    const dateText = document.querySelector('.date-text');
    
    if (timeText) timeText.textContent = timeString;
    if (dateText) dateText.textContent = dateString;
}

// Load thông tin user từ API hoặc session
async function loadUserInfo() {
    try {
        // Gọi API để lấy thông tin user
        const response = await fetch('http://localhost:3001/api/auth/me', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.loggedIn && data.user) {
                // Update tên user trong topbar
                const userName = document.getElementById('topbar-user-name');
                if (userName) {
                    userName.textContent = data.user.name.toUpperCase();
                }
                
                // Update tên user trong profile nếu có
                const profileName = document.querySelector('.profile-name');
                if (profileName) {
                    profileName.textContent = data.user.name;
                }
            }
        }
    } catch (error) {
        console.error('Error loading user info:', error);
    }
}

function initSidebarToggle() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle');
    if (!sidebar || !toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        const isCollapsed = sidebar.classList.toggle('collapsed');
        // đổi ký tự mũi tên
        toggleBtn.innerHTML = isCollapsed ? '&rsaquo;' : '&lsaquo;';
    });
}

// Export functions để có thể sử dụng ở nơi khác
window.ComponentLoader = {
    loadComponent,
    setActiveNavItem,
    updateDateTime,
    loadUserInfo
};
