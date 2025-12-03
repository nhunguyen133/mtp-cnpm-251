document.addEventListener('DOMContentLoaded', async () => {
    // Check Auth
    const userRes = await MTP_API.getCurrentUser();
    if (!userRes.loggedIn || userRes.user.role !== 'student') {
        window.location.href = '/shared/login.html';
    }
});

// Chuyển đổi View
function showSharedDocs() {
    document.getElementById('view-selection').style.display = 'none';
    document.getElementById('view-list').style.display = 'block';
    loadDocData();
}

function showLibrary() {
    window.location.href = 'document-library-mock.html'; 
}

function goBack() {
    const list = document.getElementById('view-list');
    if (list.style.display === 'block') {
        // Nếu đang ở list -> về selection
        list.style.display = 'none';
        document.getElementById('view-selection').style.display = 'flex';
    } else {
        window.history.back();
    }
}

function loadDocData() {
    const data = [
        { subject: "Hệ điều hành", name: "Giáo trình hệ điều hành Linux", topic: "Linux, Operating systems", author: "Nguyễn Anh Tuấn", year: 2012 },
        { subject: "Mạng máy tính", name: "Mạng máy tính căn bản", topic: "Máy tính, Mạng", author: "Nguyễn Bình Dương", year: 2010 },
        { subject: "Lập trình hướng đối tượng", name: "Lập trình hướng đối tượng Java", topic: "Lập trình, OOP", author: "Trương Hải Bằng", year: 2011 },
        { subject: "Cấu trúc dữ liệu", name: "Giải thuật và Lập trình", topic: "Algorithm", author: "Lê Minh Hoàng", year: 2015 }
    ];

    const tbody = document.getElementById('doc-table-body');
    tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.subject}</td>
            <td>${item.name}</td>
            <td>${item.topic}</td>
            <td>${item.author}</td>
            <td style="text-align:center">${item.year}</td>
            <td>
                <button class="btn-view-doc" onclick="viewDocumentDetail('${item.name}')">Xem</button>
            </td>
        </tr>
    `).join('');
}

function viewDocumentDetail(docName) {
    // Chuyển sang trang xem chi tiết (ảnh 4)
    window.location.href = 'document-detail-view.html';
}

window.showSharedDocs = showSharedDocs;
window.showLibrary = showLibrary;
window.goBack = goBack;
window.viewDocumentDetail = viewDocumentDetail;