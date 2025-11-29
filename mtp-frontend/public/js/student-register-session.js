/**
 * Register Session Logic - Tìm và chọn tutor
 */

let allSessions = [];
let allTutors = [];

// Đợi DOM load xong
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Kiểm tra authentication
        const userResponse = await MTP_API.getCurrentUser();
        
        if (!userResponse.loggedIn || userResponse.user.role !== 'student') {
            window.location.href = '/shared/login.html';
            return;
        }

        // 2. Load danh sách sessions và tạo danh sách tutors
        await loadTutorsAndSessions();

        // 3. Setup event listeners
        document.getElementById("searchBtn")?.addEventListener("click", handleSearch);
        document.getElementById("smartMatchBtn")?.addEventListener("click", handleSmartMatch);
        document.getElementById("tutorTableBody")?.addEventListener("click", handleChooseClick);

    } catch (error) {
        console.error('Error loading register session page:', error);
        alert('Không thể tải dữ liệu. Vui lòng thử lại.');
    }
});

/**
 * Load danh sách sessions và tạo unique list của tutors
 */
async function loadTutorsAndSessions() {
    try {
        const response = await MTP_API.getAvailableSessions();
        allSessions = response.data || [];

        // Tạo danh sách unique tutors từ sessions (dùng mscb)
        const tutorMap = new Map();
        allSessions.forEach(session => {
            if (!tutorMap.has(session.mscb)) {
                tutorMap.set(session.mscb, {
                    mscb: session.mscb,
                    name: session.tutorName,
                    subject: session.subject,
                    sessionsCount: 1
                });
            } else {
                tutorMap.get(session.mscb).sessionsCount++;
            }
        });

        allTutors = Array.from(tutorMap.values());
        console.log('Loaded tutors:', allTutors);
        // Không render ngay - chỉ render khi search

    } catch (error) {
        console.error('Error loading tutors:', error);
        alert('Không thể tải danh sách tutor');
    }
}

/**
 * Render danh sách tutors
 */
function renderTutors(list) {
  console.log('Rendering tutors:', list);
  
  const tbody = document.getElementById("tutorTableBody");
  const container = document.getElementById("tutorListContainer");
  const instruction = document.getElementById("searchInstruction");
  
  console.log('Elements:', { tbody, container, instruction });
  
  if (!tbody) {
    console.error('tbody not found!');
    return;
  }

  // Hiển thị danh sách, ẩn hướng dẫn
  if (container) container.style.display = 'block';
  if (instruction) instruction.style.display = 'none';

  if (!list || list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" style="text-align:center; padding:12px;">
          Không tìm thấy tutor phù hợp.
        </td>
      </tr>
    `;
    console.log('No tutors to display');
    return;
  }

  tbody.innerHTML = "";
  list.forEach((tutor) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${tutor.name}</td>
      <td>${tutor.subject}</td>
      <td style="text-align:center">
        <button class="btn-choose" data-mscb="${tutor.mscb}" data-name="${tutor.name}">
          Chọn
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  console.log('Render complete - displayed', list.length, 'tutors');
}


/**
 * Xử lý tìm kiếm tutor theo môn học
 */
function handleSearch() {
  const input = document.getElementById("subjectInput");
  const keyword = input?.value.trim().toLowerCase();

  console.log('Search clicked. Keyword:', keyword);
  console.log('All tutors:', allTutors);

  // Nếu không nhập gì, yêu cầu nhập keyword
  if (!keyword) {
    alert("Vui lòng nhập môn học bạn muốn tìm");
    return;
  }

  // LƯU MÔN HỌC đã tìm kiếm để dùng sau
  localStorage.setItem("searchedSubject", input.value.trim());

  // Lọc theo keyword
  const filtered = allTutors.filter((t) =>
    t.subject.toLowerCase().includes(keyword)
  );
  
  console.log('Filtered tutors:', filtered);
  renderTutors(filtered);
}

/**
 * Smart Match - Ghép tutor có nhiều buổi học nhất
 */
function handleSmartMatch() {
  const input = document.getElementById("subjectInput");
  const keyword = input.value.trim().toLowerCase();

  let candidates = allTutors;

  if (keyword) {
    // LƯU MÔN HỌC nếu có
    localStorage.setItem("searchedSubject", input.value.trim());
    
    candidates = allTutors.filter((t) =>
      t.subject.toLowerCase().includes(keyword)
    );
  }

  if (candidates.length === 0) {
    alert("Không tìm thấy tutor phù hợp để ghép.");
    return;
  }

  // Chọn tutor có nhiều sessions nhất
  const best = candidates.reduce((max, cur) =>
    cur.sessionsCount > max.sessionsCount ? cur : max
  );

  alert(
    `Hệ thống đã ghép tutor: ${best.name} (${best.subject}).\nTiếp theo bạn sẽ chọn lịch cụ thể.`
  );

  // Lưu tutor và chuyển trang
  localStorage.setItem("selectedTutorMSCB", best.mscb);
  localStorage.setItem("selectedTutorName", best.name);
  window.location.href = "choose-session.html?tutorMSCB=" + best.mscb;
}

/**
 * Xử lý click nút "Chọn" tutor
 */
function handleChooseClick(e) {
  if (!e.target.classList.contains("btn-choose")) return;
  
  const tutorMSCB = e.target.dataset.mscb;
  const tutorName = e.target.dataset.name;
  
  const tutor = allTutors.find((t) => t.mscb === tutorMSCB);
  if (!tutor) return;

  // Lưu tutorMSCB và chuyển sang trang chọn lịch
  localStorage.setItem("selectedTutorMSCB", tutorMSCB);
  localStorage.setItem("selectedTutorName", tutorName);
  window.location.href = "choose-session.html?tutorMSCB=" + tutorMSCB;
}

console.log('Register Session JS loaded');