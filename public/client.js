document.addEventListener('DOMContentLoaded', () => {
    // State
    let systemSettings = {
        co_quan_chu_quan: '',
        co_quan_ban_hanh: '',
        dia_danh: '',
        lanh_dao: [],
        noi_nhan_mac_dinh: []
    };

    // Elements
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    const toastIcon = toast.querySelector('.toast-icon');

    // === TAB SYSTEM ===
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            navButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));

            btn.classList.add('active');
            const targetTab = document.getElementById(tabId);
            if (targetTab) targetTab.classList.add('active');

            if (tabId === 'ref-tab') {
                loadUploadedDocuments();
            }
        });
    });

    // === TOAST NOTIFICATION ===
    function showToast(message, type = 'info') {
        toastMsg.textContent = message;
        toast.className = 'toast'; // Reset
        toast.classList.add(type);
        
        // Thay đổi icon dựa theo type
        if (type === 'success') toastIcon.textContent = 'check_circle';
        else if (type === 'danger') toastIcon.textContent = 'error';
        else if (type === 'warning') toastIcon.textContent = 'warning';
        else toastIcon.textContent = 'info';

        toast.classList.remove('hidden');

        // Tự tắt sau 4 giây
        if (window.toastTimeout) clearTimeout(window.toastTimeout);
        window.toastTimeout = setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    }

    // === DYNAMIC FIELD MANAGER ===
    const loaiVbSelect = document.getElementById('loai_van_ban');
    const labelTrichYeu = document.getElementById('label-trich_yeu');
    const trichYeuInput = document.getElementById('trich_yeu');
    
    // Dynamic Form Groups
    const groupCanCu = document.getElementById('group-can_cu');
    const groupKinhGui = document.getElementById('group-kinh_gui');
    const groupDongQuyetDinh = document.getElementById('group-dong-quyet-dinh');
    const groupCacDieu = document.getElementById('group-cac_dieu');
    const groupBienBanSigs = document.getElementById('group-bien-ban-signatures');
    const groupDonSig = document.getElementById('group-don-signature');

    function toggleFormGroups(loai) {
        // Reset all dynamic groups
        groupCanCu.classList.add('hidden');
        groupKinhGui.classList.add('hidden');
        groupDongQuyetDinh.classList.add('hidden');
        groupCacDieu.classList.add('hidden');
        groupBienBanSigs.classList.add('hidden');
        groupDonSig.classList.remove('hidden');

        // Defaults
        labelTrichYeu.textContent = 'Trích yếu nội dung (V/v...)';
        trichYeuInput.placeholder = 'VD: V/v báo cáo công tác tổ chức cán bộ quý I/2026';

        if (loai === 'cong_van') {
            groupKinhGui.classList.remove('hidden');
        } else if (loai === 'quyet_dinh' || loai === 'nghi_quyet') {
            groupCanCu.classList.remove('hidden');
            groupDongQuyetDinh.classList.remove('hidden');
            groupCacDieu.classList.remove('hidden');
            labelTrichYeu.textContent = 'Trích yếu nội dung quyết định (Về việc...)';
            trichYeuInput.placeholder = 'VD: Về việc bổ nhiệm cán bộ giữ chức vụ Vụ trưởng...';
            
            // Đảm bảo có ít nhất 1 Căn cứ và 1 Điều
            if (document.querySelectorAll('#can-cu-list .dynamic-item').length === 0) {
                addDynamicInput('can-cu-list', 'Nhập căn cứ pháp lý...', 'text');
            }
            if (document.querySelectorAll('#dieu-list .dynamic-item').length === 0) {
                addDynamicInput('dieu-list', 'Nội dung Điều...', 'textarea');
            }
        } else if (loai === 'bien_ban') {
            groupBienBanSigs.classList.remove('hidden');
            groupDonSig.classList.add('hidden');
            labelTrichYeu.textContent = 'Trích yếu nội dung biên bản';
            trichYeuInput.placeholder = 'VD: Hội nghị giao ban tuần Vụ Tổ chức cán bộ';
        } else if (loai === 'to_trinh') {
            groupKinhGui.classList.remove('hidden');
            labelTrichYeu.textContent = 'Trích yếu nội dung tờ trình';
        }

        // Cập nhật số hiệu tương ứng
        updateSoKyHieuPlaceholder(loai);
    }

    function updateSoKyHieuPlaceholder(loai) {
        const soKyHieuInput = document.getElementById('so_ky_hieu');
        const coQuanVietTat = systemSettings.co_quan_ban_hanh ? 
            vietTatCoQuan(systemSettings.co_quan_ban_hanh) : 'TCCB';
        
        if (loai === 'cong_van') {
            soKyHieuInput.placeholder = `Số      /BTC-${coQuanVietTat}`;
            soKyHieuInput.value = `Số      /BTC-${coQuanVietTat}`;
        } else if (loai === 'quyet_dinh') {
            soKyHieuInput.placeholder = `Số      /QĐ-BTC`;
            soKyHieuInput.value = `Số      /QĐ-BTC`;
        } else if (loai === 'thong_bao') {
            soKyHieuInput.placeholder = `Số      /TB-BTC`;
            soKyHieuInput.value = `Số      /TB-BTC`;
        } else {
            soKyHieuInput.placeholder = `Số      /...`;
            soKyHieuInput.value = `Số      /...`;
        }
    }

    function vietTatCoQuan(tenCoQuan) {
        // Viết tắt đơn giản hoặc mặc định
        if (tenCoQuan.includes("TỔ CHỨC CÁN BỘ")) return "TCCB";
        if (tenCoQuan.includes("VĂN PHÒNG")) return "VP";
        if (tenCoQuan.includes("PHÁP CHẾ")) return "PC";
        if (tenCoQuan.includes("NGÂN SÁCH")) return "NSNN";
        
        // Lấy các chữ cái đầu
        return tenCoQuan.split(' ')
            .filter(w => w.length > 2)
            .map(w => w[0].toUpperCase())
            .join('');
    }

    loaiVbSelect.addEventListener('change', (e) => {
        toggleFormGroups(e.target.value);
        syncFormToPreview();
    });

    // Helper tạo input động
    function addDynamicInput(listId, placeholder, type = 'text', val = '') {
        const container = document.getElementById(listId);
        const item = document.createElement('div');
        item.className = 'dynamic-item';

        let inputEl;
        if (type === 'textarea') {
            inputEl = document.createElement('textarea');
            inputEl.rows = 2;
        } else {
            inputEl = document.createElement('input');
            inputEl.type = type;
        }
        inputEl.className = 'form-control';
        inputEl.placeholder = placeholder;
        inputEl.value = val;
        
        // Cập nhật preview ngay khi nhập trong ô động
        inputEl.addEventListener('input', () => {
            syncFormToPreview();
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-delete-item';
        deleteBtn.innerHTML = '<span class="material-icons-round">delete</span>';
        deleteBtn.addEventListener('click', () => {
            item.remove();
            syncFormToPreview();
        });

        item.appendChild(inputEl);
        item.appendChild(deleteBtn);
        container.appendChild(item);
        return inputEl;
    }

    // Thiết lập các nút add dynamic inputs
    document.getElementById('btn-add-can-cu').addEventListener('click', () => {
        addDynamicInput('can-cu-list', 'Căn cứ...');
        syncFormToPreview();
    });

    document.getElementById('btn-add-kinh-gui').addEventListener('click', () => {
        addDynamicInput('kinh-gui-list', 'Kính gửi đơn vị/tổ chức...');
        syncFormToPreview();
    });

    document.getElementById('btn-add-dieu').addEventListener('click', () => {
        const count = document.querySelectorAll('#dieu-list .dynamic-item').length + 1;
        addDynamicInput('dieu-list', `Nội dung Điều ${count}...`, 'textarea');
        syncFormToPreview();
    });

    document.getElementById('btn-add-noi-nhan').addEventListener('click', () => {
        addDynamicInput('noi-nhan-list', '- ...;');
        syncFormToPreview();
    });

    // === LOAD & SAVE SETTINGS ===
    async function loadSettings() {
        try {
            const res = await fetch('/api/settings');
            if (!res.ok) throw new Error('Không thể tải cấu hình.');
            systemSettings = await res.json();
            
            // Điền vào form tạo văn bản
            document.getElementById('co_quan_chu_quan').value = systemSettings.co_quan_chu_quan || '';
            document.getElementById('co_quan_ban_hanh').value = systemSettings.co_quan_ban_hanh || '';
            document.getElementById('dia_danh').value = systemSettings.dia_danh || '';
            
            // Set default date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('ngay_ban_hanh').value = today;

            // Load autocomplete Lãnh đạo
            updateLanhDaoSelect();

            // Load Nơi nhận
            const noiNhanContainer = document.getElementById('noi-nhan-list');
            noiNhanContainer.innerHTML = '';
            if (systemSettings.noi_nhan_mac_dinh && systemSettings.noi_nhan_mac_dinh.length > 0) {
                systemSettings.noi_nhan_mac_dinh.forEach(nn => {
                    addDynamicInput('noi-nhan-list', '- ...;', 'text', nn);
                });
            } else {
                addDynamicInput('noi-nhan-list', '- ...;', 'text', 'Như trên');
                addDynamicInput('noi-nhan-list', '- ...;', 'text', 'Lưu: VT');
            }

            // Điền vào form settings panel
            document.getElementById('set_co_quan_chu_quan').value = systemSettings.co_quan_chu_quan || '';
            document.getElementById('set_co_quan_ban_hanh').value = systemSettings.co_quan_ban_hanh || '';
            document.getElementById('set_dia_danh').value = systemSettings.dia_danh || '';
            document.getElementById('set_noi_nhan').value = (systemSettings.noi_nhan_mac_dinh || []).join('\n');

            // Render bảng lãnh đạo trong Settings
            renderLeadersTableSettings();

            // Cập nhật số hiệu văn bản placeholder
            updateSoKyHieuPlaceholder(loaiVbSelect.value);

            // Cập nhật Bản xem trước A4
            syncFormToPreview();

        } catch (error) {
            showToast(error.message, 'danger');
        }
    }

    function updateLanhDaoSelect() {
        const select = document.getElementById('select-lanh-dao');
        select.innerHTML = '<option value="">-- Chọn lãnh đạo đã cấu hình --</option>';
        systemSettings.lanh_dao.forEach(ld => {
            const opt = document.createElement('option');
            opt.value = ld.id;
            opt.textContent = `${ld.ten} (${ld.chuc_vu})`;
            select.appendChild(opt);
        });
    }

    // Chọn nhanh lãnh đạo
    document.getElementById('select-lanh-dao').addEventListener('change', (e) => {
        const val = e.target.value;
        if (!val) return;
        
        const ld = systemSettings.lanh_dao.find(l => l.id === val);
        if (ld) {
            document.getElementById('quyen_han_ky').value = ld.quyen_han_ky || '';
            document.getElementById('kt_chuc_vu').value = ld.kt_chuc_vu || '';
            document.getElementById('chuc_vu_ky').value = ld.chuc_vu_ky || '';
            document.getElementById('nguoi_ky').value = ld.ten || '';
        }
    });

    // Render Bảng Lãnh đạo ở tab Settings
    const leadersTbody = document.getElementById('leaders-tbody');
    function renderLeadersTableSettings() {
        leadersTbody.innerHTML = '';
        systemSettings.lanh_dao.forEach(ld => {
            addLeaderRow(ld);
        });
    }

    function addLeaderRow(ld = { id: '', ten: '', chuc_vu: '', quyen_han_ky: '', kt_chuc_vu: '', chuc_vu_ky: '' }) {
        const row = document.createElement('tr');
        const id = ld.id || 'ld-' + Date.now();
        row.dataset.id = id;

        row.innerHTML = `
            <td><input type="text" class="table-input field-ten" value="${ld.ten || ''}" placeholder="Họ tên"></td>
            <td><input type="text" class="table-input field-chuc_vu" value="${ld.chuc_vu || ''}" placeholder="VD: Phó Vụ trưởng"></td>
            <td><input type="text" class="table-input field-quyen_han" value="${ld.quyen_han_ky || ''}" placeholder="VD: TL. BỘ TRƯỞNG"></td>
            <td><input type="text" class="table-input field-chuc_vu_ky" value="${ld.chuc_vu_ky || ''}" placeholder="VD: PHÓ VỤ TRƯỞNG"></td>
            <td><input type="text" class="table-input field-kt_chuc_vu" value="${ld.kt_chuc_vu || ''}" placeholder="VD: KT. VỤ TRƯỞNG..."></td>
            <td>
                <button type="button" class="btn btn-sm btn-danger btn-del-ld">
                    <span class="material-icons-round">delete</span>
                </button>
            </td>
        `;

        row.querySelector('.btn-del-ld').addEventListener('click', () => {
            row.remove();
        });

        leadersTbody.appendChild(row);
    }

    document.getElementById('btn-add-leader').addEventListener('click', () => {
        addLeaderRow();
    });

    // Submit lưu cấu hình settings
    document.getElementById('settings-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Gom dữ liệu lãnh đạo
        const lanh_dao = [];
        leadersTbody.querySelectorAll('tr').forEach(row => {
            const ten = row.querySelector('.field-ten').value.trim();
            if (!ten) return; // Bỏ hàng trống
            
            lanh_dao.push({
                id: row.dataset.id,
                ten: ten,
                chuc_vu: row.querySelector('.field-chuc_vu').value.trim(),
                quyen_han_ky: row.querySelector('.field-quyen_han').value.trim(),
                chuc_vu_ky: row.querySelector('.field-chuc_vu_ky').value.trim(),
                kt_chuc_vu: row.querySelector('.field-kt_chuc_vu').value.trim()
            });
        });

        const updatedSettings = {
            co_quan_chu_quan: document.getElementById('set_co_quan_chu_quan').value.trim(),
            co_quan_ban_hanh: document.getElementById('set_co_quan_ban_hanh').value.trim(),
            dia_danh: document.getElementById('set_dia_danh').value.trim(),
            lanh_dao: lanh_dao,
            noi_nhan_mac_dinh: document.getElementById('set_noi_nhan').value.split('\n').map(l => l.trim()).filter(l => l)
        };

        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSettings)
            });
            if (!res.ok) throw new Error('Không thể lưu cấu hình.');
            
            showToast('Lưu cấu hình hệ thống thành công!', 'success');
            
            // Reload & update state
            await loadSettings();
        } catch (error) {
            showToast(error.message, 'danger');
        }
    });

    // === GENERATE WORD DOCUMENT ===
    document.getElementById('doc-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btnSubmit = document.getElementById('btn-submit');
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span class="material-icons-round spinning">autorenew</span> Đang xử lý...';

        // Thu thập ngày tháng
        const ngayVal = document.getElementById('ngay_ban_hanh').value;
        let ngay = "", thang = "", nam = "";
        if (ngayVal) {
            const parts = ngayVal.split('-');
            ngay = parts[2];
            thang = parts[1];
            nam = parts[0];
        }

        // Thu thập các lists động
        const can_cu = Array.from(document.querySelectorAll('#can-cu-list input')).map(i => i.value.trim()).filter(i => i);
        const kinh_gui = Array.from(document.querySelectorAll('#kinh-gui-list input')).map(i => i.value.trim()).filter(i => i);
        const cac_dieu = Array.from(document.querySelectorAll('#dieu-list textarea')).map(i => i.value.trim()).filter(i => i);
        const noi_nhan = Array.from(document.querySelectorAll('#noi-nhan-list input')).map(i => i.value.trim()).filter(i => i);

        // Khởi tạo payload
        const loai = loaiVbSelect.value;
        const payload = {
            loai_van_ban: loai,
            co_quan_chu_quan: document.getElementById('co_quan_chu_quan').value.trim(),
            co_quan_ban_hanh: document.getElementById('co_quan_ban_hanh').value.trim(),
            so_ky_hieu: document.getElementById('so_ky_hieu').value.trim(),
            dia_danh: document.getElementById('dia_danh').value.trim(),
            ngay, thang, nam,
            trich_yeu: trichYeuInput.value.trim(),
            noi_dung: document.getElementById('noi_dung').value.trim(),
            noi_nhan
        };

        // Bổ sung các trường dựa theo loại VB
        if (loai === 'cong_van') {
            payload.kinh_gui = kinh_gui;
            payload.quyen_han_ky = document.getElementById('quyen_han_ky').value.trim();
            payload.kt_chuc_vu = document.getElementById('kt_chuc_vu').value.trim();
            payload.chuc_vu_ky = document.getElementById('chuc_vu_ky').value.trim();
            payload.nguoi_ky = document.getElementById('nguoi_ky').value.trim();
        } else if (loai === 'bien_ban') {
            payload.chuc_vu_thu_ky = document.getElementById('chuc_vu_thu_ky').value.trim() || 'THƯ KÝ';
            payload.nguoi_ghi_bien_ban = document.getElementById('thu_ky').value.trim();
            payload.chuc_vu_chu_tri = document.getElementById('chuc_vu_chu_tri').value.trim() || 'CHỦ TRÌ';
            payload.nguoi_chu_tri = document.getElementById('chu_toa').value.trim();
        } else {
            // Có tên loại (Quyết định, Thông báo...)
            payload.quyen_han_ky = document.getElementById('quyen_han_ky').value.trim();
            payload.kt_chuc_vu = document.getElementById('kt_chuc_vu').value.trim();
            payload.chuc_vu_ky = document.getElementById('chuc_vu_ky').value.trim();
            payload.nguoi_ky = document.getElementById('nguoi_ky').value.trim();
            if (loai === 'to_trinh') {
                payload.kinh_gui = kinh_gui;
            }
            if (loai === 'quyet_dinh' || loai === 'nghi_quyet') {
                payload.can_cu = can_cu;
                payload.theo_de_nghi = document.getElementById('theo_de_nghi').value.trim();
                payload.dong_quyet_dinh = document.getElementById('dong_quyet_dinh').value.trim() || 'QUYẾT ĐỊNH:';
                payload.cac_dieu = cac_dieu;
            }
        }

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || 'Lỗi khi tạo file Word.');
            }

            // Tải xuống file binary trả về
            const blob = await res.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            
            // Đặt tên file thông minh
            const dateStr = `${nam}${thang}${ngay}`;
            a.download = `${loai}_${dateStr || Date.now()}.docx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);

            showToast('Đã tạo và tải xuống file Word thành công!', 'success');

        } catch (error) {
            showToast(error.message, 'danger');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = '<span class="material-icons-round">download</span> <span>Tạo File Văn Bản (.docx)</span>';
        }
    });

    // === REFERENCES & FILE UPLOAD ===
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const progressContainer = document.getElementById('upload-progress-container');
    const progressBar = document.getElementById('upload-progress');
    const progressPercent = document.getElementById('progress-percent');
    const documentsList = document.getElementById('documents-list');

    // Mở file dialog khi click dropzone
    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            uploadFile(e.target.files[0]);
        }
    });

    // Drag events
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('dragover');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            uploadFile(files[0]);
        }
    }, false);

    // Hàm upload file sử dụng XMLHttpRequest để hiển thị phần trăm
    function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/upload', true);

        progressContainer.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressPercent.textContent = '0%';

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                progressBar.style.width = percent + '%';
                progressPercent.textContent = percent + '%';
            }
        });

        xhr.onload = () => {
            progressContainer.classList.add('hidden');
            if (xhr.status === 200) {
                showToast(`Đã tải lên file: ${file.name} thành công.`, 'success');
                loadUploadedDocuments(); // Tải lại danh sách
            } else {
                showToast('Tải lên thất bại. Vui lòng thử lại.', 'danger');
            }
        };

        xhr.onerror = () => {
            progressContainer.classList.add('hidden');
            showToast('Lỗi kết nối trong quá trình upload.', 'danger');
        };

        xhr.send(formData);
    }

    // Tải danh sách tài liệu tham khảo đã upload
    async function loadUploadedDocuments() {
        try {
            const res = await fetch('/api/documents');
            if (!res.ok) throw new Error('Không thể đọc danh mục file.');
            const list = await res.json();
            
            documentsList.innerHTML = '';
            if (list.length === 0) {
                documentsList.innerHTML = `
                    <li class="doc-empty">
                        <span class="material-icons-round">folder_open</span>
                        <p>Chưa có tài liệu nào được tải lên.</p>
                    </li>
                `;
                return;
            }

            list.forEach(doc => {
                const li = document.createElement('li');
                li.className = 'doc-item';
                
                // Format size
                let sizeStr = '';
                if (doc.size < 1024) sizeStr = `${doc.size} B`;
                else if (doc.size < 1048576) sizeStr = `${(doc.size / 1024).toFixed(1)} KB`;
                else sizeStr = `${(doc.size / 1048576).toFixed(1)} MB`;

                // Format date
                const date = new Date(doc.uploadedAt).toLocaleString('vi-VN');

                li.innerHTML = `
                    <div class="doc-info">
                        <span class="material-icons-round">insert_drive_file</span>
                        <div class="doc-details">
                            <h4>${doc.name}</h4>
                            <p>${sizeStr} • Cập nhật lúc: ${date}</p>
                        </div>
                    </div>
                    <div class="doc-actions">
                        <a href="/uploads/${doc.savedName}" download class="btn btn-sm btn-icon">
                            <span class="material-icons-round">download</span>
                        </a>
                    </div>
                `;
                documentsList.appendChild(li);
            });

        } catch (error) {
            showToast(error.message, 'danger');
        }
    }

    // === PREVIEW PANEL TABS ===
    const previewTabButtons = document.querySelectorAll('.preview-tab-btn');
    const previewPanes = document.querySelectorAll('.preview-pane');
    previewTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const paneId = btn.getAttribute('data-prev-tab');
            
            previewTabButtons.forEach(b => b.classList.remove('active'));
            previewPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPane = document.getElementById(paneId);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    // === LIVE PREVIEW SYNC FUNCTION ===
    function syncFormToPreview() {
        const loai = loaiVbSelect.value;

        // 1. Cơ quan chủ quản & ban hành
        const cqChuQuan = document.getElementById('co_quan_chu_quan').value.trim();
        const cqBanHanh = document.getElementById('co_quan_ban_hanh').value.trim();
        const prevCqChuQuan = document.getElementById('prev-co_quan_chu_quan');
        const prevCqBanHanh = document.getElementById('prev-co_quan_ban_hanh');

        if (cqChuQuan) {
            prevCqChuQuan.textContent = cqChuQuan;
            prevCqChuQuan.classList.remove('hidden');
        } else {
            prevCqChuQuan.classList.add('hidden');
        }

        if (document.activeElement !== prevCqBanHanh) {
            prevCqBanHanh.textContent = cqBanHanh || 'CƠ QUAN BAN HÀNH';
        }

        // 2. Số, ký hiệu
        const soKyHieu = document.getElementById('so_ky_hieu').value.trim();
        const prevSoKyHieu = document.getElementById('prev-so_ky_hieu');
        
        if (loai === 'cong_van') {
            const trichYeu = document.getElementById('trich_yeu').value.trim();
            prevSoKyHieu.innerHTML = `${soKyHieu || 'Số:    /BTC-TCCB'}<br><span class="a4-trich-yeu-cv" style="font-weight: normal; font-size: 10px;">V/v ${trichYeu.replace(/^V\/v\s+/i, '')}</span>`;
        } else {
            prevSoKyHieu.textContent = soKyHieu || 'Số:     /...';
        }

        // 3. Địa danh & Ngày tháng
        const diaDanh = document.getElementById('dia_danh').value.trim() || '...';
        const ngayVal = document.getElementById('ngay_ban_hanh').value;
        const prevDiaDanhNgay = document.getElementById('prev-dia_danh_ngay');
        
        let dateStr = `${diaDanh}, ngày ... tháng ... năm ...`;
        if (ngayVal) {
            const parts = ngayVal.split('-');
            dateStr = `${diaDanh}, ngày ${parts[2]} tháng ${parts[1]} năm ${parts[0]}`;
        }
        prevDiaDanhNgay.textContent = dateStr;

        // 4. Tên loại VB & Trích yếu
        const prevTitleBlock = document.getElementById('prev-title-block');
        const prevTenLoai = document.getElementById('prev-ten_loai_vb');
        const prevTrichYeu = document.getElementById('prev-trich_yeu_vb');

        if (loai === 'cong_van') {
            prevTitleBlock.classList.add('hidden');
        } else {
            prevTitleBlock.classList.remove('hidden');
            const optionText = loaiVbSelect.options[loaiVbSelect.selectedIndex].text;
            prevTenLoai.textContent = optionText.toUpperCase();
            
            const trichYeu = document.getElementById('trich_yeu').value.trim();
            if (document.activeElement !== prevTrichYeu) {
                prevTrichYeu.textContent = trichYeu || 'Trích yếu nội dung...';
            }
        }

        // 5. Kính gửi (Công văn, Tờ trình)
        const prevKinhGuiBlock = document.getElementById('prev-kinh_gui_block');
        const prevKinhGuiList = document.getElementById('prev-kinh_gui_list');
        
        if (loai === 'cong_van' || loai === 'to_trinh') {
            prevKinhGuiBlock.classList.remove('hidden');
            const kgInputs = Array.from(document.querySelectorAll('#kinh-gui-list input'))
                .map(i => i.value.trim()).filter(v => v);
            
            if (kgInputs.length > 0) {
                prevKinhGuiList.innerHTML = kgInputs.map((k, idx) => {
                    if (idx === 0) return k;
                    return `<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${k}`;
                }).join('');
            } else {
                prevKinhGuiList.textContent = '...';
            }
        } else {
            prevKinhGuiBlock.classList.add('hidden');
        }

        // 6. Quyết định mở đầu (Căn cứ, theo đề nghị)
        const prevDongQdBlock = document.getElementById('prev-dong_quyet_dinh_block');
        if (loai === 'quyet_dinh' || loai === 'nghi_quyet') {
            prevDongQdBlock.classList.remove('hidden');
            
            const ccInputs = Array.from(document.querySelectorAll('#can-cu-list input'))
                .map(i => i.value.trim()).filter(v => v);
            let ccHtml = '';
            ccInputs.forEach(cc => {
                let text = cc;
                if (!/^căn cứ/i.test(text)) text = 'Căn cứ ' + text;
                ccHtml += `<div class="a4-italic" style="text-indent: 1.2cm; margin-bottom: 6px;">${text};</div>`;
            });

            const theoDeNghi = document.getElementById('theo_de_nghi').value.trim();
            const deNghiHtml = theoDeNghi ? `<div class="a4-italic" style="text-indent: 1.2cm; margin-bottom: 8px;">${theoDeNghi}</div>` : '';
            const dongQd = document.getElementById('dong_quyet_dinh').value.trim() || 'QUYẾT ĐỊNH:';
            
            prevDongQdBlock.innerHTML = ccHtml + deNghiHtml + `<div class="a4-bold a4-upper" style="text-align: center; margin: 12px 0 6px;">${dongQd}</div>`;
        } else {
            prevDongQdBlock.classList.add('hidden');
        }

        // 7. Nội dung chính
        const prevNoiDung = document.getElementById('prev-noi_dung');
        if (document.activeElement !== prevNoiDung) {
            prevNoiDung.textContent = document.getElementById('noi_dung').value || 'Nhập nội dung văn bản hành chính...';
        }

        // 8. Các Điều khoản
        const prevCacDieu = document.getElementById('prev-cac_dieu');
        if (loai === 'quyet_dinh' || loai === 'nghi_quyet') {
            prevCacDieu.classList.remove('hidden');
            const dieuInputs = Array.from(document.querySelectorAll('#dieu-list textarea'))
                .map(t => t.value.trim()).filter(v => v);
            
            if (document.activeElement !== prevCacDieu) {
                let dieuHtml = '';
                dieuInputs.forEach((dieu, idx) => {
                    let text = dieu;
                    const prefixPattern = new RegExp(`^Điều\\s+${idx + 1}[\\s\\.:]`, 'i');
                    if (!prefixPattern.test(text)) {
                        text = `<b>Điều ${idx + 1}.</b> ${text}`;
                    } else {
                        text = text.replace(prefixPattern, `<b>Điều ${idx + 1}.</b> `);
                    }
                    dieuHtml += `<div style="text-indent: 1.2cm; margin-bottom: 8px;">${text}</div>`;
                });
                prevCacDieu.innerHTML = dieuHtml || '<div class="a4-italic" style="text-indent: 1.2cm;">[Các Điều khoản]</div>';
            }
        } else {
            prevCacDieu.classList.add('hidden');
        }

        // 9. Nơi nhận
        const prevNoiNhanList = document.getElementById('prev-noi_nhan_list');
        const nnInputs = Array.from(document.querySelectorAll('#noi-nhan-list input'))
            .map(i => i.value.trim()).filter(v => v);
        
        if (nnInputs.length > 0) {
            prevNoiNhanList.innerHTML = nnInputs.map(nn => `<div>${nn.startsWith('-') ? nn : '- ' + nn}</div>`).join('');
        } else {
            prevNoiNhanList.textContent = '- ...;';
        }

        // 10. Chữ ký (Đơn vs Kép)
        const sigSingle = document.getElementById('prev-signature-single');
        const sigDouble = document.getElementById('prev-signature-double');

        if (loai === 'bien_ban') {
            sigSingle.classList.add('hidden');
            sigDouble.classList.remove('hidden');

            document.getElementById('prev-chuc_vu_thu_ky').textContent = document.getElementById('chuc_vu_thu_ky').value || 'THƯ KÝ';
            document.getElementById('prev-thu_ky').textContent = document.getElementById('thu_ky').value || '...';
            document.getElementById('prev-chuc_vu_chu_tri').textContent = document.getElementById('chuc_vu_chu_tri').value || 'CHỦ TRÌ';
            document.getElementById('prev-chu_toa').textContent = document.getElementById('chu_toa').value || '...';
        } else {
            sigSingle.classList.remove('hidden');
            sigDouble.classList.add('hidden');

            document.getElementById('prev-quyen_han_ky').textContent = document.getElementById('quyen_han_ky').value || '';
            
            const ktChucVu = document.getElementById('kt_chuc_vu').value || '';
            const prevKtChucVu = document.getElementById('prev-kt_chuc_vu');
            if (ktChucVu) {
                prevKtChucVu.textContent = ktChucVu;
                prevKtChucVu.classList.remove('hidden');
            } else {
                prevKtChucVu.classList.add('hidden');
            }
            
            document.getElementById('prev-chuc_vu_ky').textContent = document.getElementById('chuc_vu_ky').value || 'CHỨC VỤ KÝ';
            
            const nguoiKy = document.getElementById('nguoi_ky').value || '';
            const prevNguoiKy = document.getElementById('prev-nguoi_ky');
            if (document.activeElement !== prevNguoiKy) {
                prevNguoiKy.textContent = nguoiKy || 'Họ tên người ký';
            }
        }
    }

    // === LISTENERS FOR TWO-WAY BINDING ===
    // 1. Form inputs -> Preview sheet (Real-time)
    const formFields = [
        'co_quan_chu_quan', 'co_quan_ban_hanh', 'so_ky_hieu', 'dia_danh', 'ngay_ban_hanh',
        'trich_yeu', 'noi_dung', 'theo_de_nghi', 'dong_quyet_dinh',
        'quyen_han_ky', 'kt_chuc_vu', 'chuc_vu_ky', 'nguoi_ky',
        'chuc_vu_thu_ky', 'thu_ky', 'chuc_vu_chu_tri', 'chu_toa'
    ];
    
    formFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', syncFormToPreview);
            el.addEventListener('change', syncFormToPreview);
        }
    });

    // 2. Preview contenteditable sheet -> Form inputs (Real-time)
    document.getElementById('prev-co_quan_ban_hanh').addEventListener('input', function() {
        document.getElementById('co_quan_ban_hanh').value = this.textContent.trim();
        updateSoKyHieuPlaceholder(loaiVbSelect.value);
    });

    document.getElementById('prev-trich_yeu_vb').addEventListener('input', function() {
        document.getElementById('trich_yeu').value = this.textContent.trim();
        updateSoKyHieuPlaceholder(loaiVbSelect.value);
    });

    document.getElementById('prev-noi_dung').addEventListener('input', function() {
        document.getElementById('noi_dung').value = this.innerText; // Preserves newlines!
    });

    document.getElementById('prev-nguoi_ky').addEventListener('input', function() {
        document.getElementById('nguoi_ky').value = this.textContent.trim();
    });

    // === RUN ON INIT ===
    loadSettings();
    toggleFormGroups(loaiVbSelect.value);
});
