(function() {
    let currentDate = new Date(2025, 9, 10); 
    let selectedDateKey = null;
    let scheduleData = {}; 

    document.addEventListener('DOMContentLoaded', async () => {
        // 1. Vẽ khung lịch ngay lập tức (để không bị lỗi giao diện khi mạng chậm)
        renderCalendar();

        // 2. Check Auth
        try {
            const userRes = await MTP_API.getCurrentUser();
            if (!userRes.loggedIn || userRes.user.role !== 'tutor') {
                window.location.href = '../shared/login.html'; 
                return;
            }
        } catch (e) {
            console.error("Auth Error:", e);
            return;
        }
        
        // 3. Tải dữ liệu từ Server -> Vẽ lại lịch có màu
        await fetchAndRenderSchedules();

        // 4. Sự kiện click ngoài để đóng menu
        document.addEventListener('click', () => {
            const menu = document.getElementById('context-menu');
            if(menu) menu.style.display = 'none';
        });
    });

    /**
     * Lấy dữ liệu và map vào scheduleData
     */
    async function fetchAndRenderSchedules() {
        try {
            // Gọi API (Hàm này đã có trong api-client.js mới)
            const res = await MTP_API.getTutorSchedules();
            
            if (res && res.success) {
                scheduleData = {};
                res.data.forEach(item => {
                    // Map status
                    let uiStatus = 'free';
                    if (item.status === 'class_opened' || item.status === 'opened') uiStatus = 'opened';
                    if (item.status === 'busy') uiStatus = 'busy';

                    scheduleData[item.date] = {
                        status: uiStatus,
                        startTime: item.startTime || "",
                        endTime: item.endTime || "",
                        location: item.location || "",
                        note: item.note || ""
                    };
                });
                // Vẽ lại lịch khi đã có data
                renderCalendar();
            }
        } catch (error) {
            console.error("Lỗi tải lịch từ server:", error);
            // Không alert lỗi để tránh spam, chỉ log
        }
    }

    /**
     * Vẽ Lịch
     */
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        const titleEl = document.getElementById('current-month-year');
        if(titleEl) titleEl.innerText = `${monthNames[month]} ${year}`;

        const calBody = document.getElementById('calendar-body');
        if(!calBody) return; // Tránh lỗi nếu HTML chưa load
        calBody.innerHTML = '';

        const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        days.forEach(day => calBody.innerHTML += `<div class="cal-head">${day}</div>`);

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            calBody.innerHTML += `<div class="cal-cell" style="background:#f9f9f9"></div>`;
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const data = scheduleData[dateKey];
            
            let statusClass = '';
            let tooltipText = '';

            if (data) {
                if (data.status === 'free') statusClass = 'status-free';
                else if (data.status === 'opened') statusClass = 'status-opened';
                else if (data.status === 'busy') statusClass = 'status-busy';

                const timeStr = (data.startTime && data.endTime) ? `${data.startTime} - ${data.endTime}` : (data.startTime || "");
                tooltipText = ` ${data.note || 'Không có ghi chú'}\n ${timeStr}\n ${data.location || 'N/A'}`;
            }

            const cell = document.createElement('div');
            cell.className = `cal-cell ${statusClass}`;
            cell.innerHTML = `<span class="date-num">${d}</span>`;
            
            if (tooltipText) cell.setAttribute('data-tooltip', tooltipText);
            
            cell.addEventListener('contextmenu', (e) => showContextMenu(e, dateKey));
            calBody.appendChild(cell);
        }
    }

    function showContextMenu(e, dateKey) {
        e.preventDefault();
        selectedDateKey = dateKey;
        const menu = document.getElementById('context-menu');
        menu.style.display = 'block';
        menu.style.left = `${e.pageX}px`;
        menu.style.top = `${e.pageY}px`;
    }

    // --- CÁC HÀM XỬ LÝ SỰ KIỆN (Gắn vào window để HTML gọi được) ---

    window.changeMonth = function(step) {
        currentDate.setMonth(currentDate.getMonth() + step);
        renderCalendar();
    }

    window.setDayStatus = function(status) {
        document.getElementById('context-menu').style.display = 'none';
        if (!selectedDateKey) return;

        if (status === 'opened') {
            document.getElementById('sessionTime').value = formatDateDisplay(selectedDateKey);
            document.getElementById('openSessionModal').classList.add('active');
        } else if (status === 'free') {
            document.getElementById('inputFreeTime').value = '';
            document.getElementById('inputFreeTime').focus();
            document.getElementById('freeTimeModal').classList.add('active');
        } else if (status === null) {
            if (scheduleData[selectedDateKey]) {
                document.getElementById('deleteConfirmModal').classList.add('active');
            }
        } else if (status === 'busy') {
            document.getElementById('scheduleConfirmModal').classList.add('active');
        }
    }

    window.confirmSetFree = function() {
        const timeVal = document.getElementById('inputFreeTime').value;
        if (!timeVal) { alert("Vui lòng nhập giờ!"); return; }
        
        // Tách chuỗi giờ nếu có
        let sTime = timeVal, eTime = "";
        if(timeVal.includes('-')) { [sTime, eTime] = timeVal.split('-'); }

        saveToServer({
            date: selectedDateKey, status: 'free',
            startTime: sTime.trim(), endTime: eTime.trim(),
            note: "Lịch rảnh", location: "Tùy chọn"
        });
        window.closeModals();
    }

    window.confirmOpenSession = function() {
        const name = document.getElementById('sessionName').value;
        const timeVal = document.getElementById('sessionTime').value;
        if(!name) { alert("Nhập tên buổi học"); return; }

        let sTime = "", eTime = "";
        
        sTime = timeVal; 

        saveToServer({
            date: selectedDateKey, status: 'opened',
            startTime: sTime, endTime: "",
            note: name, location: "Online/Offline"
        });
        
        window.closeModals();
        document.getElementById('sessionForm').reset();
    }

    window.confirmSetBusy = function() {
        saveToServer({
            date: selectedDateKey, status: 'busy',
            startTime: "Cả ngày", endTime: "", note: "Bận việc cá nhân"
        });
        window.closeModals();
    }

    window.confirmDelete = function() {
        saveToServer({ date: selectedDateKey, status: null });
        window.closeModals();
    }

    window.closeModals = function() {
        document.querySelectorAll('.modal-overlay').forEach(el => el.classList.remove('active'));
    }

    window.openAddScheduleModal = function() {
        document.getElementById('addScheduleModal').classList.add('active');
    }

    window.submitNewSchedule = async function() {
        
        const date = document.getElementById('newScheduleDate').value;
        const startTime = document.getElementById('newScheduleStartTime').value;
        const endTime = document.getElementById('newScheduleEndTime').value;
        const location = document.getElementById('newScheduleLocation').value;
        const type = document.querySelector('input[name="scheduleType"]:checked')?.value;
        const note = document.getElementById('newScheduleNote').value;

        // Validate required fields
        if (!date || !startTime || !endTime || !type) {
            alert('Vui lòng điền đầy đủ thông tin: Ngày, Giờ bắt đầu, Giờ kết thúc, và Hình thức');
            return;
        }

        // Validate time range
        if (startTime >= endTime) {
            alert('Giờ bắt đầu phải trước giờ kết thúc');
            return;
        }

        const payload = {
            date: date,
            status: 'available',
            startTime: startTime,
            endTime: endTime,
            location: location || '',
            type: type,
            note: note || ''
        };

        try {
            const res = await MTP_API.updateTutorSchedule(payload);
            
            if (res.success) {
                // Clear form
                document.getElementById('newScheduleDate').value = '';
                document.getElementById('newScheduleStartTime').value = '';
                document.getElementById('newScheduleEndTime').value = '';
                document.getElementById('newScheduleLocation').value = '';
                document.getElementById('newScheduleNote').value = '';
                document.querySelectorAll('input[name="scheduleType"]').forEach(el => el.checked = false);
                
                // Close modal and refresh calendar
                window.closeModals();
                await fetchAndRenderSchedules();
                alert('Đã thêm lịch rảnh thành công!');
            } else {
                alert("Lỗi: " + res.message);
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            alert("Không thể thêm lịch rảnh. Vui lòng thử lại.");
        }
    }

    async function saveToServer(payload) {
        try {
            const res = await MTP_API.updateTutorSchedule(payload);
            if (res.success) {
                await fetchAndRenderSchedules();
            } else {
                alert("Lỗi: " + res.message);
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
        }
    }

    function formatDateDisplay(ymd) {
        if(!ymd) return '';
        const p = ymd.split('-');
        return `${p[2]}/${p[1]}/${p[0]}`;
    }

})();