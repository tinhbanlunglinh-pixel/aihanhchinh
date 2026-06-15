export interface ApiSettings {
  geminiKey: string;
  openaiKey: string;
  apiProvider: 'gemini' | 'openai';
  co_quan_chu_quan: string;
  co_quan_ban_hanh: string;
  dia_danh: string;
  nguoi_ky: string;
  chuc_vu_ky: string;
  quyen_han_ky: string;
}

export interface AIInputs {
  loai_van_ban: string;
  chu_de: string;
  muc_dich: string;
  doi_tuong: string;
  can_cu: string;
  yeu_cau: string;
  tai_lieu_tham_khao?: string;
  co_quan_chu_quan?: string;
  co_quan_ban_hanh?: string;
  dia_danh?: string;
  nguoi_ky?: string;
  chuc_vu_ky?: string;
}

// === TOÀN BỘ KIẾN THỨC NGHỊ ĐỊNH 30/2020/NĐ-CP ===
// Embedded từ Skill_The_Thuc_VB_ND30/references/

const ND30_KNOWLEDGE = `
## QUY TẮC THỂ THỨC VĂN BẢN HÀNH CHÍNH (NĐ30/2020/NĐ-CP)

### 1. Thông số trang
- Khổ giấy: A4 (210 x 297 mm)
- Lề trái: 30mm, lề phải: 20mm, lề trên: 20mm, lề dưới: 20mm
- Font: Times New Roman, Unicode
- Dãn dòng: single đến 1.5 lines
- Giãn đoạn: Tối thiểu 6pt

### 2. Header (Table 2 cột x 2 dòng ẩn viền)
- Cột trái (3500 dxa): Tên CQ chủ quản (IN HOA, thường, cỡ 13) + Tên CQ ban hành (IN HOA, ĐẬM, cỡ 13) + gạch ngang 1/3
- Cột phải (5571 dxa): Quốc hiệu "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM" (IN HOA, ĐẬM, cỡ 13) + Tiêu ngữ "Độc lập - Tự do - Hạnh phúc" (Đậm, cỡ 14) + gạch ngang
- Dòng 2 trái: Số, Ký hiệu (cỡ 13)
- Dòng 2 phải: Địa danh, ngày tháng (nghiêng, cỡ 14)

### 3. Body
- Cỡ chữ nội dung: 14 (hoặc 13), canh đều 2 bên (Justified)
- Lùi đầu dòng: 1 - 1.27 cm
- Spacing: before 6pt, after 6pt, line spacing 17pt exact

### 4. Kính gửi
- KHÔNG in đậm. Chỉ in thường, cỡ 14
- Nếu nhiều cơ quan: liệt kê, mỗi dòng kết thúc bằng ";" trừ dòng cuối "."

### 5. Căn cứ pháp lý
- In nghiêng, mỗi căn cứ kết thúc bằng ";" trừ căn cứ cuối "."
- Bắt đầu bằng "Căn cứ..."

### 6. Chữ ký
- Quyền hạn (TM./KT./TL.): IN HOA, ĐẬM, cỡ 13, có DẤU CHẤM sau viết tắt
- Chức vụ: IN HOA, ĐẬM, cỡ 13-14
- 4 dòng trống cho chữ ký (KHÔNG dùng spacing)
- Tên người ký: Thường, ĐẬM, cỡ 14

### 7. Ma trận phân quyền ký
- TM. (Thay mặt): Người đứng đầu ký trực tiếp
- KT. (Ký thay): Cấp phó ký thay người đứng đầu
- TL. (Thừa lệnh): Cấp dưới ký theo ủy quyền
- TUQ. (Thừa ủy quyền): Ký theo ủy quyền chuyên tiếp
- Khi TL + KT kết hợp (3 dòng): dòng cuối (chức vụ thực) KHÔNG đậm

### 8. Nơi nhận
- "Nơi nhận:" đậm + nghiêng, cỡ 12
- Danh sách: cỡ 11, dấu gạch đầu dòng "-"
- Mỗi dòng kết thúc ";" trừ dòng cuối (Lưu: VT,...) kết thúc "."

### 9. Kết thúc văn bản
- BẮT BUỘC kết thúc bằng dấu "./." (chấm gạch chéo chấm)

### 10. Số ký hiệu
- Công văn: Số: [Số]/[Tên viết tắt CQ]-[Đơn vị soạn] (VD: Số: 123/UBND-VP)
- VB có tên loại: Số: [Số]/[Mã loại]-[CQ ban hành] (VD: Số: 45/QĐ-UBND)

### 11. Loại văn bản có tên loại (14+ loại)
Nghị quyết, Quyết định, Chỉ thị, Quy chế, Quy định, Thông báo, Hướng dẫn,
Chương trình, Kế hoạch, Phương án, Đề án, Báo cáo, Tờ trình, Thông cáo,
Biên bản, Giấy mời, Giấy giới thiệu, Giấy nghỉ phép, Giấy ủy quyền,
Hợp đồng, Công điện, Bản ghi nhớ

### 12. Công văn (VB không có tên loại)
- Trích yếu "V/v..." nằm dưới số ký hiệu, cỡ 12, nghiêng
- "Kính gửi:" nằm giữa trang, KHÔNG in đậm

### 13. Biên bản
- 2 chữ ký: Thư ký (bên trái) + Chủ trì (bên phải)

### 14. Bối cảnh pháp lý Hành chính & Quân sự (Cập nhật Mới nhất)
- Các luật Quân sự - Quốc phòng: Luật Quốc phòng ngày 25 tháng 11 năm 2025; Luật Dân quân tự vệ ngày 25 tháng 11 năm 2025; Luật Nghĩa vụ quân sự ngày 25 tháng 11 năm 2025; Luật Lực lượng dự bị động viên ngày 25 tháng 11 năm 2025.
- Các luật Hành chính - Dân sự phổ biến: Luật Tổ chức chính quyền địa phương ngày 20 tháng 6 năm 2025; Luật Cán bộ, công chức ngày 20 tháng 6 năm 2025; Luật Ban hành văn bản quy phạm pháp luật ngày 20 tháng 6 năm 2025; Luật Xử lý vi phạm hành chính ngày 20 tháng 6 năm 2025; Luật Ngân sách Nhà nước ngày 20 tháng 6 năm 2025; Luật Đất đai ngày 15 tháng 6 năm 2025.
- Các Nghị định, Thông tư hướng dẫn thi hành tiêu biểu (Cập nhật 2026):
  + Nghị định số 05/2026/NĐ-CP ngày 10 tháng 01 năm 2026 quy định chi tiết thi hành một số điều của Luật Nghĩa vụ quân sự về công tác tuyển quân (Thay thế NĐ 63/2016).
  + Nghị định số 15/2026/NĐ-CP ngày 25 tháng 01 năm 2026 quy định chi tiết một số điều của Luật Dân quân tự vệ (Thay thế NĐ 72/2020).
  + Nghị định số 20/2026/NĐ-CP ngày 05 tháng 02 năm 2026 quy định chi tiết một số điều và biện pháp thi hành Luật Ban hành văn bản quy phạm pháp luật.
  + Thông tư số 10/2026/TT-BQP ngày 15 tháng 01 năm 2026 của Bộ trưởng Bộ Quốc phòng quy định chi tiết thi hành công tác tuyển quân (Thay thế TT 148/2018).
  + Thông tư số 12/2026/TT-BQP ngày 20 tháng 01 năm 2026 quy định chi tiết một số điều của Luật Dân quân tự vệ.
- LƯU Ý ĐẶC BIỆT: Kể từ ngày 01/07/2025, Việt Nam thực hiện tổ chức chính quyền địa phương 2 cấp (chỉ còn cấp Tỉnh và cấp Xã). TUYỆT ĐỐI KHÔNG CÒN CẤP HUYỆN. Các cơ quan cấp huyện không còn tồn tại (Không sử dụng "UBND huyện", "Ban CHQS huyện"). Cơ quan cấp trên trực tiếp của xã là cấp Tỉnh (ví dụ: Bộ CHQS tỉnh Tuyên Quang).
`;

// === BẢNG VIẾT TẮT ĐƠN VỊ (QĐ 4114/QĐ-BTC) ===
const BANG_VIET_TAT = `
Bảng chữ viết tắt đơn vị phổ biến:
VPB = Văn phòng Bộ, TCCB = Vụ Tổ chức cán bộ, PC = Vụ Pháp chế,
NSNN = Vụ Ngân sách nhà nước, VP = Văn phòng, UBND = Ủy ban nhân dân,
HĐND = Hội đồng nhân dân, QĐ = Quyết định, CV = Công văn,
BC = Báo cáo, KH = Kế hoạch, TB = Thông báo, TTr = Tờ trình,
BB = Biên bản, CTr = Chương trình, NQ = Nghị quyết, CT = Chỉ thị
`;

// === LOCAL KNOWLEDGE BASE FOR DECREE 30 & GUIDE 36 Q&A ===
const LOCAL_KNOWLEDGE = [
  {
    keywords: ["căn lề", "lề", "margin", "kích thước"],
    answer: "Theo Nghị định 30/2020/NĐ-CP, quy định căn lề trang văn bản A4 (210mm x 297mm) như sau:\n- Lề trên: 20 - 25 mm (2cm - 2.5cm)\n- Lề dưới: 20 - 25 mm (2cm - 2.5cm)\n- Lề trái: 30 - 35 mm (3cm - 3.5cm)\n- Lề phải: 15 - 20 mm (1.5cm - 2cm)\n*Lưu ý:* Phông chữ chuẩn bắt buộc là Times New Roman, bộ mã ký tự Unicode."
  },
  {
    keywords: ["viết tắt", "ký hiệu", "so ky hieu"],
    answer: "Quy tắc ghi ký hiệu văn bản hành chính theo NĐ30:\n- Công văn: Số: [Số]/[Tên viết tắt CQ ban hành]-[Tên viết tắt đơn vị soạn thảo] (Ví dụ: Số: 123/UBND-VP).\n- Văn bản có tên loại: Số: [Số]/[Mã loại viết tắt]-[Tên viết tắt CQ ban hành] (Ví dụ: Số: 45/QĐ-UBND).\n*Lưu ý:* Giữa số và năm chỉ dùng dấu gạch chéo (/), không dùng dấu gạch ngang (-)."
  },
  {
    keywords: ["chữ ký", "ký thay", "kt", "thừa lệnh", "tl", "thừa ủy quyền", "tuq", "quyền hạn"],
    answer: "Cách trình bày chữ ký chuẩn Nghị định 30/2020/NĐ-CP:\n1. Ký thay (KT.): Áp dụng khi cấp phó ký thay cấp trưởng. Dòng chữ 'KT. CHỦ TỊCH' (in đậm, in hoa), dòng dưới ghi chức vụ thực 'PHÓ CHỦ TỊCH' (in đậm, in hoa).\n2. Thừa lệnh (TL.): Áp dụng khi cấp dưới ký theo ủy quyền. Dòng chữ 'TL. CHỦ TỊCH' (in đậm, in hoa), dòng dưới ghi chức vụ đơn vị thực hiện, ví dụ 'CHÁNH VĂN PHÒNG' (in đậm, in hoa).\n3. Tất cả các cụm viết tắt quyền hạn (TM., KT., TL., TUQ.) bắt buộc phải sử dụng **dấu chấm** sau mỗi chữ viết tắt. Không dùng dấu gạch chéo."
  },
  {
    keywords: ["nơi nhận", "dau cau", "chấm phẩy", "VT"],
    answer: "Thể thức phần Nơi nhận theo Nghị định 30:\n- Tiêu đề 'Nơi nhận:' trình bày bằng chữ in thường, cỡ chữ 12, **in đậm** và **in nghiêng**.\n- Các đơn vị nhận liệt kê bằng dấu gạch đầu dòng (-), kết thúc mỗi dòng bằng dấu **chấm phẩy (;)**.\n- Dòng cuối cùng ghi nơi lưu trữ (ví dụ: 'Lưu: VT, VP.') kết thúc bằng dấu **chấm (.)**."
  },
  {
    keywords: ["đảng", "hướng dẫn 36", "văn bản đảng", "hd36", "khác biệt", "so sánh"],
    answer: "Sự khác biệt cốt lõi giữa Văn bản hành chính (NĐ30) và Văn bản Đảng (HD36/VPTW):\n1. **Quốc hiệu**: NĐ30 bắt đầu bằng Quốc hiệu/Tiêu ngữ. Văn bản Đảng bắt đầu bằng tên Đảng bộ tỉnh và tên Ban chấp hành (Ví dụ: ĐẢNG CỘNG SẢN VIỆT NAM).\n2. **Quyền hạn ký**: NĐ30 dùng dấu chấm (TM., KT., TL.). Văn bản Đảng bắt đầu bằng dấu gạch chéo (T/M, K/T, T/L).\n3. **Căn cứ**: NĐ30 ghi căn cứ in nghiêng, đứng độc lập. Văn bản Đảng ghi căn cứ in đứng, có gạch đầu dòng (- Căn cứ...).\n4. **Ký hiệu số**: NĐ30 dùng `Số: 45/QĐ-BTC`. Văn bản Đảng dùng `Số 45-NQ/TW` (dùng dấu gạch ngang giữa số và mã văn bản)."
  },
  {
    keywords: ["kính gửi", "in đậm"],
    answer: "Theo phụ lục I của Nghị định 30/2020/NĐ-CP, cụm từ **'Kính gửi:'** và danh sách các cơ quan nhận kính gửi được trình bày bằng chữ in thường, cỡ chữ 14, đứng và **KHÔNG IN ĐẬM**."
  },
  {
    keywords: ["kết thúc", "dấu chấm", "chấm gạch", "./."],
    answer: "Tất cả các văn bản hành chính thông thường (Công văn, Thông báo, Tờ trình...) đều phải kết thúc bằng ký tự **`./.`** (chấm gạch chéo chấm) ở cuối dòng cuối cùng của nội dung văn bản. Đây là điểm bắt buộc để ngăn ngừa việc tự ý chèn thêm văn bản giả mạo sau khi đã trình ký."
  }
];

// === Bảng tra tên loại VB ===
const TEN_LOAI_VB: Record<string, string> = {
  nghi_quyet: 'Nghị quyết', quyet_dinh: 'Quyết định', chi_thi: 'Chỉ thị',
  quy_che: 'Quy chế', quy_dinh: 'Quy định', thong_bao: 'Thông báo',
  huong_dan: 'Hướng dẫn', chuong_trinh: 'Chương trình', ke_hoach: 'Kế hoạch',
  phuong_an: 'Phương án', de_an: 'Đề án', du_an: 'Dự án',
  bao_cao: 'Báo cáo', to_trinh: 'Tờ trình', thong_cao: 'Thông cáo',
  bien_ban: 'Biên bản', giay_moi: 'Giấy mời', giay_gioi_thieu: 'Giấy giới thiệu',
  giay_nghi_phep: 'Giấy nghỉ phép', giay_uy_quyen: 'Giấy ủy quyền',
  hop_dong: 'Hợp đồng', cong_dien: 'Công điện', ban_ghi_nho: 'Bản ghi nhớ',
  cong_van: 'Công văn',
};

// === Bảng mã viết tắt loại VB ===
const MA_LOAI_VB: Record<string, string> = {
  nghi_quyet: 'NQ', quyet_dinh: 'QĐ', chi_thi: 'CT',
  quy_che: 'QC', quy_dinh: 'QĐi', thong_bao: 'TB',
  huong_dan: 'HD', chuong_trinh: 'CTr', ke_hoach: 'KH',
  phuong_an: 'PA', de_an: 'ĐA', du_an: 'DA',
  bao_cao: 'BC', to_trinh: 'TTr', thong_cao: 'TC',
  bien_ban: 'BB', giay_moi: 'GM', giay_gioi_thieu: 'GGT',
  giay_nghi_phep: 'GNP', giay_uy_quyen: 'GUQ',
  hop_dong: 'HĐ', cong_dien: 'CĐ', ban_ghi_nho: 'BGN',
  cong_van: 'CV',
};

export { TEN_LOAI_VB, MA_LOAI_VB };

// === CHAT AI / GEMINI OR OPENAI CLIENT ===
export async function callRealAI(prompt: string, systemInstruction: string, apiKey: string, provider: 'gemini' | 'openai'): Promise<string> {
  if (provider === 'gemini') {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemInstruction}\n\nUser request:\n${prompt}` }] }]
        })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Lỗi gọi API Gemini.');
      }
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      throw new Error('Không thể kết nối API Gemini: ' + errMsg);
    }
  } else {
    // OpenAI provider
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: prompt }
          ]
        })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Lỗi gọi API OpenAI.');
      }
      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : String(e);
      throw new Error('Không thể kết nối API OpenAI: ' + errMsg);
    }
  }
}

// === TEST API CONNECTION ===
export async function testApiConnection(apiKey: string, provider: 'gemini' | 'openai'): Promise<{ success: boolean; message: string }> {
  try {
    const result = await callRealAI(
      'Trả lời ngắn gọn trong 1 câu: Bạn có sẵn sàng hỗ trợ soạn văn bản hành chính không?',
      'Bạn là trợ lý AI.',
      apiKey,
      provider
    );
    if (result && result.length > 0) {
      return { success: true, message: 'Kết nối thành công! API đã sẵn sàng.' };
    }
    return { success: false, message: 'API trả về dữ liệu rỗng.' };
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    return { success: false, message: errMsg };
  }
}

// === SOPHISTICATED VIETNAMESE ADMINISTRATIVE MOCK GENERATOR ===
export function generateMockDocument(inputs: AIInputs): string {
  const loai = inputs.loai_van_ban || 'cong_van';
  const chuDe = inputs.chu_de || '[Chờ bổ sung chủ đề]';
  const mucDich = inputs.muc_dich || '[Chờ bổ sung mục đích]';
  const doiTuong = inputs.doi_tuong || '[Chờ bổ sung đối tượng]';
  const yeuCau = inputs.yeu_cau || '';
  const taiLieuRef = inputs.tai_lieu_tham_khao || '';

  let output = '';

  if (loai === 'quyet_dinh') {
    output = `Thành lập Tổ công tác triển khai chuyên đề: "${chuDe}" phục vụ đắc lực cho nhiệm vụ quản lý tại địa phương.
Quyết định này nhằm thực hiện mục tiêu: ${mucDich}.
Phân công nhiệm vụ chi tiết và yêu cầu phối hợp cụ thể của ${doiTuong}.

Nội dung chi tiết thực hiện:
1. Giao bộ phận chuyên môn tham mưu lập dự toán chi tiết các hoạt động liên quan.
2. Thiết lập quy trình báo cáo tiến độ định kỳ vào ngày 25 hàng tháng gửi về Thường trực Ủy ban nhân dân xã.
3. Biện pháp cụ thể: ${yeuCau || '[Chờ bổ sung biện pháp thực hiện]'}.`;
  } else if (loai === 'cong_van') {
    output = `Thực hiện chủ trương phát triển kinh tế và quản lý xã hội tại địa bàn xã. Về việc "${chuDe}", Ủy ban nhân dân xã đề nghị các đơn vị liên quan tập trung triển khai các nội dung sau:
1. Về mục đích thực hiện: ${mucDich}. Yêu cầu tập trung tuyên truyền sâu rộng trong toàn thể nhân dân để tạo sự đồng thuận thống nhất cao.
2. Đối tượng phối hợp chủ trì: ${doiTuong}. Giao Ban chỉ sự các thôn bản trực tiếp phụ trách các địa bàn được phân công.
3. Kế hoạch triển khai cụ thể: ${yeuCau || '[Chờ bổ sung biện pháp phối hợp]'}.
Đề nghị các cơ quan, đơn vị phối hợp chặt chẽ với các tổ chức chính trị - xã hội tại địa phương để hoàn thành tốt nhiệm vụ được giao. Báo cáo định kỳ kết quả thực hiện về Văn phòng UBND xã trước ngày 25 hàng tháng để tổng hợp, báo cáo Lãnh đạo cấp trên.`;
  } else if (loai === 'bien_ban') {
    output = `Vào hồi 08 giờ 30 ngày hôm nay, tại Hội trường lớn Ủy ban nhân dân xã đã diễn ra cuộc họp chuyên đề về việc: "${chuDe}".
THÀNH PHẦN THAM DỰ
1. Chủ trì cuộc họp: ${inputs.nguoi_ky || 'Nguyễn Văn Chiến'} - ${inputs.chuc_vu_ky || 'Chủ tịch UBND xã'}.
2. Thư ký ghi biên bản: [Chờ bổ sung thư ký].
3. Thành phần khách mời: ${doiTuong}.
DIỄN BIẾN CUỘC HỌP
- Chủ trì cuộc họp phát biểu khai mạc và quán triệt mục đích: ${mucDich}.
- Các đại biểu tham dự tiến hành thảo luận, nhất trí cao với chủ trương đề xuất. Ý kiến đề xuất tập trung vào giải pháp: ${yeuCau || 'Chưa có yêu cầu chi tiết'}.
KẾT LUẬN CUỘC HỌP
Chủ trì cuộc họp kết luận và giao nhiệm vụ cụ thể cho các thành viên:
1. Giao bộ phận chuyên môn hoàn thiện văn bản tờ trình trước ngày 20 hàng tháng.
2. Các thôn bản tổ chức họp dân để phổ biến kế hoạch thực hiện.
Biên bản được đọc lại cho toàn thể cuộc họp cùng nghe, thống nhất thông qua và ký tên vào biên bản.`;
  } else {
    // Các loại văn bản khác (Thông báo, Báo cáo, Kế hoạch...)
    output = `Thực hiện chương trình công tác và nhiệm vụ được giao năm 2026. Về việc triển khai thực hiện nhiệm vụ "${chuDe}".
1. Mục đích và yêu cầu trọng tâm:
- Nhằm cụ thể hóa mục tiêu: ${mucDich}.
- Nâng cao tính chủ động và tinh thần trách nhiệm của cán bộ công chức phụ trách chuyên môn.
2. Đối tượng và phạm vi triển khai:
- Phạm vi áp dụng: ${doiTuong}.
3. Nhiệm vụ cụ thể và giải pháp thực hiện:
- Nội dung chỉ đạo: ${yeuCau || '[Chờ bổ sung nội dung thực hiện]'}.
Ủy ban nhân dân xã yêu cầu các cán bộ chuyên môn chủ động phối hợp với các tổ chức đoàn thể để thực hiện nghiêm túc nội dung chỉ đạo nêu trên, đảm bảo tiến độ và chất lượng đề ra.`;
  }

  if (taiLieuRef) {
    output += `\n\n[Số liệu thực tế trích xuất từ tài liệu tham khảo]:\n- ${taiLieuRef.split('\n').filter(line => line.trim().length > 0).join('\n- ')}`;
  }

  return output;
}

// === GENERATE WITH AI WRAPPER (original - generates body text only) ===
export async function generateDocumentWithAI(inputs: AIInputs, apiKey?: string, provider?: 'gemini' | 'openai'): Promise<string> {
  if (apiKey && provider) {
    const loaiText = TEN_LOAI_VB[inputs.loai_van_ban] || inputs.loai_van_ban.toUpperCase().replace('_', ' ');
    const systemInstruction = `Bạn là một trợ lý AI chuyên nghiệp soạn thảo văn bản hành chính công vụ cho chính quyền địa phương cấp xã ở Việt Nam.
Mọi văn bản bạn sinh ra phải tuân thủ nghiêm ngặt văn phong hành chính Nhà nước Việt Nam: trang trọng, khách quan, ngắn gọn, chính xác.

${ND30_KNOWLEDGE}

QUY TẮC BẮT BUỘC:
1. Về căn cứ pháp lý: Nếu người dùng không cung cấp căn cứ, BẠN PHẢI TỰ ĐỘNG BỔ SUNG các Luật, Nghị định, Thông tư mới nhất có liên quan chặt chẽ đến chủ đề văn bản (đặc biệt là các Luật trong lĩnh vực Quân sự, Quốc phòng nếu có). KHÔNG để trống chờ bổ sung. Nếu người dùng đã cung cấp, hãy dùng các căn cứ đó và bổ sung thêm nếu cần thiết.
2. Nếu thiếu thông tin để sinh nội dung chi tiết, bạn bắt buộc phải sử dụng cụm từ '[Chờ bổ sung]' tại vị trí đó để người dùng tự điền.
3. BẮT BUỘC CHỈ SINH PHẦN NỘI DUNG CHÍNH CỦA VĂN BẢN (từ sau phần Căn cứ pháp lý hoặc Kính gửi, đến trước chữ ký). TUYỆT ĐỐI KHÔNG sinh Quốc hiệu, Tiêu ngữ, Tên cơ quan, Số ký hiệu, Nơi nhận, Chữ ký.
4. BẮT BUỘC CHỈ TRẢ VỀ PLAIN TEXT. TUYỆT ĐỐI KHÔNG DÙNG MARKDOWN (như **, *, #, v.v.). TUYỆT ĐỐI KHÔNG DÙNG HTML (như <div>, <p>, <table>, v.v.). KHÔNG kèm theo lời chào, lời dẫn hay giải thích (như "Dưới đây là...", "Bạn là...").
5. Viết nội dung dạng các đoạn văn hoặc các điều khoản rõ ràng.
6. Văn bản PHẢI kết thúc bằng dấu "./.".`;

    const prompt = `Loại văn bản: ${loaiText}
Chủ đề văn bản: ${inputs.chu_de}
Mục đích ban hành: ${inputs.muc_dich}
Đối tượng thực hiện: ${inputs.doi_tuong}
Căn cứ pháp lý: ${inputs.can_cu}
Yêu cầu cụ thể: ${inputs.yeu_cau}
${inputs.tai_lieu_tham_khao ? `Tài liệu tham khảo / Số liệu nguồn:
${inputs.tai_lieu_tham_khao}
=> YÊU CẦU: Hãy phân tích kỹ tài liệu tham khảo này, trích xuất chính xác các số liệu thống kê, tên người/sự kiện, thời gian để đưa vào nội dung văn bản hành chính một cách mạch lạc, chi tiết.` : ''}`;

    return await callRealAI(prompt, systemInstruction, apiKey, provider);
  } else {
    // Chạy Mock Engine
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateMockDocument(inputs));
      }, 1000);
    });
  }
}

// ================================================================
// === GENERATE FULL DOCUMENT WITH AI (NEW — returns DocTemplate) ==
// ================================================================

import { DocTemplate } from './templateData';

const FULL_DOC_SYSTEM_INSTRUCTION = `Bạn là AI chuyên gia soạn thảo văn bản hành chính Nhà nước Việt Nam, tuân thủ tuyệt đối Nghị định 30/2020/NĐ-CP.

${ND30_KNOWLEDGE}

${BANG_VIET_TAT}

BẠN PHẢI trả về KẾT QUẢ duy nhất là một JSON object hợp lệ (KHÔNG có markdown, KHÔNG có giải thích, KHÔNG có text ngoài JSON).

JSON object phải có đúng cấu trúc sau:
{
  "id": "loai_van_ban_code",
  "name": "Tên loại VB tiếng Việt",
  "code": "Mã viết tắt (QĐ, CV, BC, KH, TB...)",
  "description": "Mô tả ngắn loại VB",
  "co_quan_chu_quan": "TÊN CQ CHỦ QUẢN (IN HOA)",
  "co_quan_ban_hanh": "TÊN CQ BAN HÀNH (IN HOA)",
  "so_ky_hieu": "Số:      /[Mã loại]-[CQ]",
  "dia_danh": "Tên địa danh",
  "trich_yeu": "Trích yếu nội dung VB (ngắn gọn, súc tích)",
  "kinh_gui": ["Cơ quan 1", "Cơ quan 2"],
  "can_cu": ["Căn cứ Luật/NĐ/QĐ...số...ngày..."],
  "theo_de_nghi": "Theo đề nghị của... (chỉ dùng cho QĐ)",
  "dong_quyet_dinh": "QUYẾT ĐỊNH: (chỉ dùng cho QĐ/NQ)",
  "noi_dung": "Nội dung chính của VB (nhiều đoạn, đầy đủ chi tiết)",
  "cac_dieu": ["Nội dung Điều 1...", "Nội dung Điều 2..."],
  "quyen_han_ky": "TM. ỦY BAN NHÂN DÂN hoặc KT. CHỦ TỊCH hoặc TL. CHỦ TỊCH hoặc rỗng",
  "kt_chuc_vu": "Chức vụ KT (nếu có, VD: PHÓ CHỦ TỊCH)",
  "chuc_vu_ky": "CHỨC VỤ NGƯỜI KÝ (IN HOA)",
  "nguoi_ky": "Họ và tên người ký",
  "noi_nhan": ["Như trên;", "Đảng ủy xã (để b/c);", "Lưu: VT, VP."]
}

QUY TẮC QUAN TRỌNG:
1. "kinh_gui": Chỉ dùng cho Công văn và Tờ trình. Các loại VB khác để mảng rỗng [].
2. "can_cu": Dùng cho Quyết định, Nghị quyết, Chỉ thị. Nếu người dùng không cung cấp, BẠN PHẢI TỰ ĐỘNG BỔ SUNG các Luật, Nghị định, Thông tư mới nhất và phù hợp nhất. LƯU Ý: Tuyệt đối phải sử dụng phiên bản Luật từ năm 2025 trở đi (Ví dụ: Luật Nghĩa vụ quân sự năm 2025, Luật Tổ chức chính quyền địa phương năm 2025) và Nghị định, Thông tư từ năm 2025, 2026. KHÔNG sử dụng các Luật cũ như năm 2015, 2019.
3. "cac_dieu": Chỉ dùng cho Quyết định, Nghị quyết, Chỉ thị, Quy chế. Các loại khác để mảng rỗng [].
4. "dong_quyet_dinh": Chỉ dùng "QUYẾT ĐỊNH:" cho QĐ, "QUYẾT NGHỊ:" cho NQ. Các loại khác để chuỗi rỗng "".
5. "theo_de_nghi": Chỉ dùng cho QĐ. Các loại khác để chuỗi rỗng "".
6. Nội dung VB PHẢI kết thúc bằng "./.".
7. Nơi nhận: mỗi dòng kết thúc ";" trừ dòng cuối (Lưu: VT...) kết thúc ".".
8. Phân quyền ký: Xác định đúng TM./KT./TL. theo cấp độ ký.
9. KHÔNG bịa đặt thông tin, tên người, số liệu cụ thể. Dùng '[Chờ bổ sung]' nếu thiếu.
10. "so_ky_hieu": Luôn để trống số (dùng khoảng trống), chỉ điền mã loại và cơ quan.
11. Nếu loại VB là Quyết định có cac_dieu, thì "noi_dung" là phần mở đầu TRƯỚC các điều khoản.
12. Biên bản: "noi_nhan" để mảng rỗng. Không cần quyen_han_ky.
13. JSON phải hợp lệ — KHÔNG có trailing comma, KHÔNG có comment.
14. TUYỆT ĐỐI KHÔNG dùng Markdown (**, *, #) hay HTML trong bất kỳ trường nào của JSON. Mọi giá trị chuỗi phải là văn bản thuần túy (plain text).`;

export interface SmartComposeInput {
  loai_van_ban: string;
  mo_ta: string;
  can_cu_phap_ly?: string;
  tai_lieu_tham_khao?: string;
  co_quan_chu_quan?: string;
  co_quan_ban_hanh?: string;
  dia_danh?: string;
  nguoi_ky?: string;
  chuc_vu_ky?: string;
  quyen_han_ky?: string;
}

function generateMockFullDocument(input: SmartComposeInput): DocTemplate {
  const loai = input.loai_van_ban || 'cong_van';
  const tenLoai = TEN_LOAI_VB[loai] || 'Công văn';
  const maLoai = MA_LOAI_VB[loai] || 'CV';
  const cqBanHanh = input.co_quan_ban_hanh || 'ỦY BAN NHÂN DÂN XÃ NHỮ KHÊ';
  const cqChuQuan = input.co_quan_chu_quan || 'ỦY BAN NHÂN DÂN TỈNH TUYÊN QUANG';
  const diaDanh = input.dia_danh || 'Nhữ Khê';
  const nguoiKy = input.nguoi_ky || 'Nguyễn Văn Chiến';
  const chucVuKy = input.chuc_vu_ky || 'CHỦ TỊCH';
  const quyenHanKy = input.quyen_han_ky || '';

  // Extract short abbreviation from cqBanHanh
  const cqVietTat = cqBanHanh.includes('UBND') ? 'UBND' : cqBanHanh.split(' ').map(w => w[0]).join('');

  const soKyHieu = loai === 'cong_van'
    ? `Số:      /${cqVietTat}-VP`
    : `Số:      /${maLoai}-${cqVietTat}`;

  const moTa = input.mo_ta || '[Chờ bổ sung nội dung]';

  // Build trich_yeu
  let trichYeu = '';
  if (loai === 'cong_van') {
    trichYeu = `V/v ${moTa.substring(0, 80)}`;
  } else {
    trichYeu = moTa.substring(0, 100);
  }

  // Build noi_dung based on type
  let noiDung = '';
  let cacDieu: string[] = [];
  let canCu: string[] = [];
  let kinhGui: string[] = [];
  let dongQuyetDinh = '';
  let theoDeNghi = '';

  if (loai === 'quyet_dinh') {
    dongQuyetDinh = 'QUYẾT ĐỊNH:';
    theoDeNghi = `Theo đề nghị của Văn phòng HĐND và UBND.`;
    noiDung = moTa;
    cacDieu = [
      `${moTa}.\nGiao các cơ quan, đơn vị liên quan chịu trách nhiệm triển khai thực hiện theo chức năng, nhiệm vụ được phân công.`,
      `Kinh phí thực hiện từ nguồn ngân sách [Chờ bổ sung nguồn kinh phí] theo quy định hiện hành.`,
      `Quyết định này có hiệu lực kể từ ngày ký.`,
      `Văn phòng HĐND và UBND, các cơ quan, đơn vị có liên quan chịu trách nhiệm thi hành Quyết định này./.`
    ];
  } else if (loai === 'cong_van') {
    kinhGui = ['[Chờ bổ sung cơ quan nhận]'];
    noiDung = `Thực hiện chương trình công tác năm 2026 của UBND xã. Về việc ${moTa}, UBND xã đề nghị các đơn vị liên quan tập trung triển khai các nội dung sau:\n1. [Chờ bổ sung nội dung triển khai thứ nhất].\n2. [Chờ bổ sung nội dung triển khai thứ hai].\n3. [Chờ bổ sung nội dung triển khai thứ ba].\nĐề nghị các cơ quan, đơn vị nghiêm túc triển khai thực hiện và báo cáo kết quả về UBND xã trước ngày [Chờ bổ sung] hàng tháng./.`;
  } else if (loai === 'bien_ban') {
    noiDung = `Vào hồi [Chờ bổ sung giờ] ngày [Chờ bổ sung ngày], tại trụ sở UBND xã đã diễn ra cuộc họp về việc: "${moTa}".\nTHÀNH PHẦN THAM DỰ\n1. Chủ trì: ${nguoiKy} - ${chucVuKy}.\n2. Thư ký: [Chờ bổ sung].\n3. Thành phần: [Chờ bổ sung].\nDIỄN BIẾN CUỘC HỌP\n- Chủ trì phát biểu khai mạc và nêu mục đích cuộc họp.\n- [Chờ bổ sung diễn biến cuộc họp].\nKẾT LUẬN\n1. [Chờ bổ sung kết luận].\nCuộc họp kết thúc vào lúc [Chờ bổ sung giờ] cùng ngày./.`;
  } else {
    noiDung = `Thực hiện chương trình công tác và nhiệm vụ được giao. Về việc "${moTa}", UBND xã ban hành ${tenLoai} như sau:\nI. MỤC ĐÍCH, YÊU CẦU\n- [Chờ bổ sung mục đích].\n- [Chờ bổ sung yêu cầu].\nII. NỘI DUNG THỰC HIỆN\n1. [Chờ bổ sung nội dung thứ nhất].\n2. [Chờ bổ sung nội dung thứ hai].\nIII. TỔ CHỨC THỰC HIỆN\n- Giao các bộ phận chuyên môn triển khai thực hiện theo chức năng, nhiệm vụ.\n- Báo cáo kết quả thực hiện về UBND xã trước ngày [Chờ bổ sung]./.`;
  }

  if (input.can_cu_phap_ly) {
    canCu = input.can_cu_phap_ly.split('\n').filter(l => l.trim()).map(l => l.trim());
  }

  return {
    id: loai,
    name: tenLoai,
    code: maLoai,
    description: `Văn bản ${tenLoai} được tạo bởi AI`,
    co_quan_chu_quan: cqChuQuan,
    co_quan_ban_hanh: cqBanHanh,
    so_ky_hieu: soKyHieu,
    dia_danh: diaDanh,
    trich_yeu: trichYeu,
    kinh_gui: kinhGui,
    can_cu: canCu,
    theo_de_nghi: theoDeNghi,
    dong_quyet_dinh: dongQuyetDinh,
    noi_dung: noiDung,
    cac_dieu: cacDieu,
    quyen_han_ky: quyenHanKy,
    chuc_vu_ky: chucVuKy,
    nguoi_ky: nguoiKy,
    noi_nhan: loai === 'bien_ban' ? [] : ['Như trên;', 'Lưu: VT, VP.'],
  };
}

export async function generateFullDocumentWithAI(
  input: SmartComposeInput,
  apiKey?: string,
  provider?: 'gemini' | 'openai'
): Promise<DocTemplate> {
  if (apiKey && provider) {
    const tenLoai = TEN_LOAI_VB[input.loai_van_ban] || input.loai_van_ban;

    const prompt = `Hãy soạn một văn bản "${tenLoai}" với nội dung sau:

Mô tả yêu cầu: ${input.mo_ta}

Thông tin cơ quan:
- Cơ quan chủ quản: ${input.co_quan_chu_quan || '[Tự xác định phù hợp]'}
- Cơ quan ban hành: ${input.co_quan_ban_hanh || '[Tự xác định phù hợp]'}
- Địa danh: ${input.dia_danh || '[Tự xác định]'}
- Người ký: ${input.nguoi_ky || '[Chờ bổ sung]'}
- Chức vụ ký: ${input.chuc_vu_ky || '[Tự xác định phù hợp]'}
- Quyền hạn ký: ${input.quyen_han_ky || '[Tự xác định phù hợp theo cấp ký]'}

${input.can_cu_phap_ly ? `Căn cứ pháp lý do người dùng cung cấp:\n${input.can_cu_phap_ly}\n=> Hãy sử dụng các căn cứ này và bổ sung thêm các căn cứ mới nhất có liên quan (nếu cần thiết).` : 'Người dùng chưa cung cấp căn cứ pháp lý => BẠN PHẢI TỰ ĐỘNG TÌM VÀ BỔ SUNG các căn cứ (Luật, Nghị định, Thông tư...) mới nhất, phù hợp nhất với chủ đề văn bản.'}

${input.tai_lieu_tham_khao ? `Tài liệu tham khảo / Số liệu nguồn:\n${input.tai_lieu_tham_khao}\n=> Hãy trích xuất số liệu, thông tin quan trọng từ tài liệu này để đưa vào nội dung văn bản.` : ''}

Trả về JSON object duy nhất theo đúng cấu trúc đã hướng dẫn. KHÔNG trả về markdown hay text khác.`;

    try {
      const raw = await callRealAI(prompt, FULL_DOC_SYSTEM_INSTRUCTION, apiKey, provider);

      // Extract JSON from response (handle possible markdown wrapping)
      let jsonStr = raw.trim();
      // Remove markdown code fences if present
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
      }

      const parsed = JSON.parse(jsonStr) as DocTemplate;
      return parsed;
    } catch (e: unknown) {
      console.error('AI JSON parse error, falling back to mock:', e);
      // Fallback to mock if AI returns invalid JSON
      return generateMockFullDocument(input);
    }
  } else {
    // Mock mode
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateMockFullDocument(input));
      }, 1500);
    });
  }
}

// === CONVERT DOCUMENT WITH AI ===
export async function convertDocumentWithAI(sourceText: string, targetType: string, apiKey?: string, provider?: 'gemini' | 'openai'): Promise<string> {
  if (apiKey && provider) {
    const systemInstruction = `Bạn là trợ lý AI chuyên gia chuyển đổi văn bản hành chính công vụ Việt Nam.
Nhiệm vụ của bạn là nhận vào văn bản nguồn và chuyển đổi nó sang định dạng văn bản đích yêu cầu (Ví dụ: Biên bản họp sang Thông báo kết luận).
Yêu cầu duy trì tính chính xác của thông tin, số liệu, danh sách đại biểu và các ý kiến kết luận của chủ trì cuộc họp.
Sử dụng đúng văn phong chuẩn của loại văn bản đích. Không bịa đặt thêm thông tin mới không có trong nguồn.

QUY TẮC BẮT BUỘC:
1. BẮT BUỘC CHỈ SINH PHẦN NỘI DUNG CHÍNH CỦA VĂN BẢN (không sinh Quốc hiệu, Tiêu ngữ, Tên cơ quan, Chữ ký, Nơi nhận).
2. BẮT BUỘC CHỈ TRẢ VỀ PLAIN TEXT. TUYỆT ĐỐI KHÔNG DÙNG MARKDOWN (như **, *, #, v.v.). TUYỆT ĐỐI KHÔNG DÙNG HTML.
3. KHÔNG kèm theo lời chào, lời dẫn (như "Đây là bản chuyển đổi...", "Dưới đây là...").

${ND30_KNOWLEDGE}`;

    const prompt = `Hãy chuyển đổi văn bản dưới đây sang loại văn bản: ${targetType.toUpperCase()}.\n\nVăn bản nguồn:\n${sourceText}`;
    return await callRealAI(prompt, systemInstruction, apiKey, provider);
  } else {
    // Mock convert
    return new Promise((resolve) => {
      setTimeout(() => {
        const title = sourceText.split('\n')[0] || '';
        let converted = `THÔNG BÁO KẾT LUẬN\n\nVề việc thực hiện kết luận cuộc họp liên quan đến nội dung: "${title.replace(/Biên bản cuộc họp về việc:|Biên bản/i, '')}"\n\n`;
        converted += `Thực hiện ý kiến chỉ đạo tại cuộc họp giao ban định kỳ. UBND xã thông báo kết luận chỉ đạo của Chủ tịch Ủy ban nhân dân xã như sau:\n`;
        converted += `1. Đối với nhiệm vụ chuyên môn: Yêu cầu các cán bộ chủ động bám sát kế hoạch, rà soát hồ sơ đúng thẩm quyền.\n`;
        converted += `2. Đối với công tác chuẩn bị hồ sơ tài chính: Yêu cầu hoàn thiện và nộp báo cáo trước thời hạn quy định.\n`;
        converted += `Thông báo để các đơn vị, cá nhân biết và nghiêm túc tổ chức thực hiện./.`;
        resolve(converted);
      }, 1200);
    });
  }
}

// === ASK ASSISTANT Q&A (DECREE 30 & GUIDE 36) ===
export async function askAssistantQnA(question: string, isPartyContext: boolean, apiKey?: string, provider?: 'gemini' | 'openai'): Promise<string> {
  if (apiKey && provider) {
    const systemInstruction = isPartyContext ?
      `Bạn là chuyên gia về thể thức văn bản Đảng Cộng sản Việt Nam theo Hướng dẫn số 36-HD/VPTW ngày 03/4/2018 của Văn phòng Trung ương Đảng. Hãy trả lời câu hỏi của người dùng một cách chính xác, dẫn chứng điều khoản cụ thể nếu có.` :
      `Bạn là chuyên gia về thể thức văn bản hành chính Nhà nước Việt Nam theo Nghị định số 30/2020/NĐ-CP ngày 05/3/2020 của Chính phủ về công tác văn thư.

${ND30_KNOWLEDGE}

Hãy trả lời câu hỏi của người dùng một cách chính xác, dẫn chứng điều khoản cụ thể nếu có.`;

    return await callRealAI(question, systemInstruction, apiKey, provider);
  } else {
    // Trả lời cục bộ theo từ khóa
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerQuestion = question.toLowerCase();
        let matchedAnswer = '';

        for (const item of LOCAL_KNOWLEDGE) {
          if (item.keywords.some(kw => lowerQuestion.includes(kw))) {
            matchedAnswer = item.answer;
            break;
          }
        }

        if (!matchedAnswer) {
          matchedAnswer = `Cảm ơn bạn đã đặt câu hỏi về thể thức văn bản ${isPartyContext ? 'Đảng (HD36)' : 'Hành chính (NĐ30)'}.\n\nHiện tại trong chế độ dùng thử ngoại tuyến, tôi chỉ trả lời được các câu hỏi liên quan đến: Căn lề, Viết tắt số ký hiệu, Chữ ký (KT., TL.), Nơi nhận và sự khác biệt giữa văn bản Đảng/Nhà nước.\n\n*Gợi ý:* Hãy nhập API Key trong mục Cài đặt để có thể hỏi đáp mở rộng với toàn bộ kho kiến thức AI về Nghị định 30 và Hướng dẫn 36.`;
        }

        resolve(matchedAnswer);
      }, 800);
    });
  }
}
