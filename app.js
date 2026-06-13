const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {
    createHeader, createTenLoai, createKinhGui, createBody,
    createSignatureBlock, createDocument, Packer, Paragraph, TextRun, LAYOUT, BORDERS_NONE, AlignmentType
} = require('./engine/docx_core_nd30');
const { Table, TableRow, TableCell, WidthType, VerticalAlign } = require('docx');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Đảm bảo thư mục lưu trữ tồn tại
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Cấu hình Multer lưu file tải lên
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        // Tránh trùng lặp tên file bằng cách thêm timestamp
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${Date.now()}${ext}`);
    }
});
const upload = multer({ storage });

// Cấu hình mặc định
const SETTINGS_FILE = path.join(__dirname, 'settings.json');
const DEFAULT_SETTINGS = {
    co_quan_chu_quan: "BỘ TÀI CHÍNH",
    co_quan_ban_hanh: "VỤ TỔ CHỨC CÁN BỘ",
    dia_danh: "Hà Nội",
    lanh_dao: [],
    noi_nhan_mac_dinh: ["Như trên", "Lưu: VT"]
};

// === API CẤU HÌNH ===
app.get('/api/settings', (req, res) => {
    try {
        if (fs.existsSync(SETTINGS_FILE)) {
            const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
            return res.json(JSON.parse(data));
        }
        return res.json(DEFAULT_SETTINGS);
    } catch (error) {
        return res.status(500).json({ error: 'Không thể đọc file cài đặt.' });
    }
});

app.post('/api/settings', (req, res) => {
    try {
        const settings = req.body;
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
        return res.json({ success: true, message: 'Đã cập nhật cài đặt thành công.' });
    } catch (error) {
        return res.status(500).json({ error: 'Không thể lưu cài đặt.' });
    }
});

// === API TÀI LIỆU THAM KHẢO ===
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Vui lòng chọn file tải lên.' });
    }
    return res.json({
        success: true,
        file: {
            name: req.file.originalname,
            savedName: req.file.filename,
            size: req.file.size,
            path: `/uploads/${req.file.filename}`
        }
    });
});

app.get('/api/documents', (req, res) => {
    try {
        const files = fs.readdirSync(UPLOADS_DIR);
        const documents = files.map(file => {
            const filePath = path.join(UPLOADS_DIR, file);
            const stats = fs.statSync(filePath);
            return {
                name: file.replace(/-\d+(?=\.[^.]+$)/, ''), // Bỏ phần timestamp khi hiển thị
                savedName: file,
                size: stats.size,
                uploadedAt: stats.mtime
            };
        }).sort((a, b) => b.uploadedAt - a.uploadedAt);
        return res.json(documents);
    } catch (error) {
        return res.status(500).json({ error: 'Không thể đọc danh mục tài liệu.' });
    }
});

// Thư mục static cho các file upload (để có thể tải về nếu cần)
app.use('/uploads', express.static(UPLOADS_DIR));

// === API SINH VĂN BẢN ===
app.post('/api/generate', async (req, res) => {
    try {
        const data = req.body;
        const loai = data.loai_van_ban || 'cong_van';
        const children = [];

        // 1. Header (Cơ quan + Quốc hiệu + Số KH + Ngày tháng)
        children.push(createHeader(data));

        if (loai === 'cong_van') {
            // CÔNG VĂN
            // 2. Kính gửi
            children.push(...createKinhGui(data));
            // 3. Nội dung
            children.push(...createBody(data));
            // 4. Khoảng cách trước chữ ký
            children.push(new Paragraph({
                spacing: { before: 240, after: 0 },
                children: [new TextRun({ text: '' })],
            }));
            // 5. Chữ ký + Nơi nhận
            children.push(createSignatureBlock(data));

        } else if (loai === 'bien_ban') {
            // BIÊN BẢN
            // 2. Tên loại (Biên bản) + trích yếu
            children.push(...createTenLoai(data));
            // 3. Nội dung
            children.push(...createBody(data));
            // 4. Khoảng cách
            children.push(new Paragraph({
                spacing: { before: 360, after: 0 },
                children: [new TextRun({ text: '' })],
            }));
            // 5. Chữ ký kép: Thư ký (trái) + Chủ trì (phải)
            const halfWidth = Math.floor(LAYOUT.CONTENT_WIDTH / 2);
            
            // Helper dựng cột ký cho biên bản
            const createSignCol = (label, name) => {
                const cols = [];
                cols.push(new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 0, after: 0 },
                    children: [new TextRun({ text: label, font: LAYOUT.FONT, size: 28, bold: true })]
                }));
                for (let i = 0; i < 4; i++) {
                    cols.push(new Paragraph({
                        spacing: { before: 0, after: 0 },
                        children: [new TextRun({ text: '', font: LAYOUT.FONT, size: 28 })]
                    }));
                }
                cols.push(new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 0, after: 0 },
                    children: [new TextRun({ text: name || '', font: LAYOUT.FONT, size: 28, bold: true })]
                }));
                return cols;
            };

            const sigTable = new Table({
                width: { size: LAYOUT.CONTENT_WIDTH, type: WidthType.DXA },
                borders: BORDERS_NONE,
                columnWidths: [halfWidth, halfWidth],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                borders: BORDERS_NONE,
                                width: { size: halfWidth, type: WidthType.DXA },
                                verticalAlign: VerticalAlign.TOP,
                                children: createSignCol(
                                    data.chuc_vu_thu_ky || 'THƯ KÝ',
                                    data.nguoi_ghi_bien_ban || data.thu_ky || ''
                                )
                            }),
                            new TableCell({
                                borders: BORDERS_NONE,
                                width: { size: halfWidth, type: WidthType.DXA },
                                verticalAlign: VerticalAlign.TOP,
                                children: createSignCol(
                                    data.chuc_vu_chu_tri || 'CHỦ TRÌ',
                                    data.nguoi_chu_tri || data.chu_toa || ''
                                )
                            })
                        ]
                    })
                ]
            });
            children.push(sigTable);

        } else {
            // VĂN BẢN CÓ TÊN LOẠI (Quyết định, Thông báo, Kế hoạch...)
            // 2. Tên loại + Trích yếu
            children.push(...createTenLoai(data));
            // 3. Kính gửi (nếu có, VD: Tờ trình)
            if (data.kinh_gui && data.kinh_gui.length > 0) {
                children.push(...createKinhGui(data));
            }
            // 4. Nội dung (Gồm cả căn cứ và các điều khoản nếu có)
            children.push(...createBody(data));
            // 5. Khoảng cách
            children.push(new Paragraph({
                spacing: { before: 240, after: 0 },
                children: [new TextRun({ text: '' })],
            }));
            // 6. Chữ ký + Nơi nhận
            children.push(createSignatureBlock(data));
        }

        // Đóng gói tài liệu
        const doc = createDocument(children);
        const buffer = await Packer.toBuffer(doc);

        // Đặt header tải file
        const filename = `${loai}_${Date.now()}.docx`;
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        return res.send(buffer);

    } catch (error) {
        console.error('Lỗi khi sinh file Word:', error);
        return res.status(500).json({ error: 'Lỗi trong quá trình tạo file .docx: ' + error.message });
    }
});

// Khởi chạy server
app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`===================================================`);
});
