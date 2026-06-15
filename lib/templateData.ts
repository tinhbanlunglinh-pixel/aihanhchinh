export interface DocTemplate {
  id: string;
  name: string;
  code: string;
  description: string;
  co_quan_chu_quan?: string;
  co_quan_ban_hanh: string;
  so_ky_hieu: string;
  dia_danh: string;
  trich_yeu: string;
  kinh_gui?: string[];
  can_cu?: string[];
  theo_de_nghi?: string;
  dong_quyet_dinh?: string;
  noi_dung: string;
  cac_dieu?: string[];
  quyen_han_ky?: string;
  kt_chuc_vu?: string;
  chuc_vu_ky: string;
  nguoi_ky: string;
  noi_nhan: string[];
  ngay_ban_hanh?: string;
}

export const TEMPLATES: DocTemplate[] = [
  {
    id: "cong_van",
    name: "Công văn",
    code: "CV",
    description: "Văn bản hành chính thông thường để giao dịch, trao đổi công việc giữa các cơ quan.",
    co_quan_chu_quan: "ỦY BAN NHÂN DÂN TỈNH TUYÊN QUANG",
    co_quan_ban_hanh: "ỦY BAN NHÂN DÂN XÃ NHỮ KHÊ",
    so_ky_hieu: "Số:      /UBND-VP",
    dia_danh: "Nhữ Khê",
    trich_yeu: "V/v tăng cường công tác phòng chống dịch bệnh mùa hè năm 2026",
    kinh_gui: [
      "Trưởng các thôn, bản trên địa bàn xã Nhữ Khê",
      "Trạm y tế xã Nhữ Khê"
    ],
    noi_dung: "Thực hiện Công văn số 456/UBND-YT ngày 10/05/2026 của UBND tỉnh Tuyên Quang về việc tăng cường phòng chống dịch bệnh mùa hè. UBND xã Nhữ Khê đề nghị các thôn, bản và đơn vị liên quan triển khai ngay các nhiệm vụ sau:\n1. Ban Chỉ sự các thôn chủ động tuyên truyền trên loa truyền thanh về vệ sinh an toàn thực phẩm, ăn chín uống sôi và dọn dẹp vệ sinh môi trường.\n2. Trạm Y tế xã chuẩn bị đầy đủ cơ số thuốc, vật tư y tế phục vụ công tác dự phòng và sơ cứu khi có dịch bệnh xảy ra trên địa bàn.\n3. Đề nghị Mặt trận Tổ quốc xã phối hợp vận động nhân dân nâng cao ý thức phòng dịch, thực hiện nếp sống văn minh.\nNhận được Công văn này, yêu cầu các đơn vị nghiêm túc triển khai thực hiện và báo cáo kết quả về UBND xã trước ngày 30 hàng tháng.",
    quyen_han_ky: "TM. ỦY BAN NHÂN DÂN",
    chuc_vu_ky: "CHỦ TỊCH",
    nguoi_ky: "Nguyễn Văn Chiến",
    noi_nhan: [
      "Như trên;",
      "Thường trực Đảng ủy xã (để b/c);",
      "Lưu: VT, VP."
    ]
  },
  {
    id: "quyet_dinh",
    name: "Quyết định",
    code: "QĐ",
    description: "Văn bản quy phạm pháp luật hoặc văn bản cá biệt dùng để ban hành quy chế, thành lập tổ chức, bổ nhiệm cán bộ...",
    co_quan_chu_quan: "ỦY BAN NHÂN DÂN TỈNH TUYÊN QUANG",
    co_quan_ban_hanh: "ỦY BAN NHÂN DÂN XÃ NHỮ KHÊ",
    so_ky_hieu: "Số:      /QĐ-UBND",
    dia_danh: "Nhữ Khê",
    trich_yeu: "Về việc thành lập Ban chỉ đạo chuyển đổi số xã Nhữ Khê giai đoạn 2026 - 2030",
    can_cu: [
      "Luật Tổ chức chính quyền địa phương ngày 19 tháng 6 năm 2015;",
      "Quyết định số 749/QĐ-TTg ngày 03 tháng 6 năm 2020 của Thủ tướng Chính phủ phê duyệt Chương trình Chuyển đổi số quốc gia;",
      "Xét đề nghị của Văn phòng HĐND và UBND xã Nhữ Khê."
    ],
    theo_de_nghi: "Theo đề nghị của Văn phòng HĐND và UBND xã Nhữ Khê.",
    dong_quyet_dinh: "QUYẾT ĐỊNH:",
    noi_dung: "Thành lập Ban chỉ đạo chuyển đổi số xã Nhữ Khê để trực tiếp chỉ đạo, giám sát và vận hành các hệ thống dịch vụ công trực tuyến và chính quyền số tại địa phương.",
    cac_dieu: [
      "Thành lập Ban chỉ đạo Chuyển đổi số xã Nhữ Khê gồm các ông (bà) có tên sau:\n1. Ông Nguyễn Văn Chiến - Chủ tịch UBND xã - Trưởng ban;\n2. Bà Phạm Thùy Lâm - Phó Chủ tịch UBND xã - Phó Trưởng ban thường trực;\n3. Ông Trần Xuân Hòa - Công chức Văn phòng - Thống kê - Thành viên.",
      "Ban chỉ đạo có nhiệm vụ xây dựng kế hoạch chuyển đổi số hàng năm, đôn đốc các bộ phận chuyên môn triển khai dịch vụ công trực tuyến mức độ 3 và 4.",
      "Quyết định này có hiệu lực kể từ ngày ký.",
      "Văn phòng HĐND và UBND xã Nhữ Khê và các ông (bà) có tên tại Điều 1 chịu trách nhiệm thi hành Quyết định này."
    ],
    quyen_han_ky: "",
    chuc_vu_ky: "CHỦ TỊCH",
    nguoi_ky: "Nguyễn Văn Chiến",
    noi_nhan: [
      "Như Điều 4;",
      "Đảng ủy xã (để b/c);",
      "Lưu: VT, VP."
    ]
  },
  {
    id: "bao_cao",
    name: "Báo cáo",
    code: "BC",
    description: "Văn bản dùng để trình bày tình hình, kết quả hoạt động, thực hiện nhiệm vụ trong một thời kỳ.",
    co_quan_chu_quan: "ỦY BAN NHÂN DÂN TỈNH TUYÊN QUANG",
    co_quan_ban_hanh: "ỦY BAN NHÂN DÂN XÃ NHỮ KHÊ",
    so_ky_hieu: "Số:      /BC-UBND",
    dia_danh: "Nhữ Khê",
    trich_yeu: "Báo cáo kết quả công tác cải cách hành chính quý I năm 2026",
    noi_dung: "Trong quý I năm 2026, UBND xã Nhữ Khê đã chủ động triển khai các nhiệm vụ cải cách hành chính đạt được kết quả như sau:\n1. Về cải cách thể chế: Đã rà soát và đơn giản hóa 05 quy trình giải quyết hồ sơ đất đai và hộ tịch.\n2. Về cải cách thủ tục hành chính: Bộ phận Một cửa đã tiếp nhận 450 hồ sơ, giải quyết đúng hạn 445 hồ sơ (đạt tỷ lệ 98.8%), 5 hồ sơ đang giải quyết trong hạn.\n3. Về xây dựng chính quyền điện tử: 100% cán bộ công chức đã sử dụng chữ ký số và hệ thống quản lý văn bản điều hành tập trung.\nHạn chế: Cơ sở hạ tầng mạng đôi lúc còn chậm, ảnh hưởng tới việc khai thác cơ sở dữ liệu quốc gia về dân cư.\nPhương hướng quý II: Tiếp tục nâng cao chất lượng phục vụ tại bộ phận Một cửa, tăng cường hướng dẫn người dân nộp hồ sơ trực tuyến.",
    quyen_han_ky: "",
    chuc_vu_ky: "CHỦ TỊCH",
    nguoi_ky: "Nguyễn Văn Chiến",
    noi_nhan: [
      "UBND tỉnh Tuyên Quang (để b/c);",
      "Đảng ủy, HĐND xã;",
      "Lưu: VT."
    ]
  },
  {
    id: "ke_hoach",
    name: "Kế hoạch",
    code: "KH",
    description: "Văn bản xác định mục tiêu, chỉ tiêu, biện pháp và tiến độ thực hiện một nhiệm vụ cụ thể.",
    co_quan_chu_quan: "ỦY BAN NHÂN DÂN TỈNH TUYÊN QUANG",
    co_quan_ban_hanh: "ỦY BAN NHÂN DÂN XÃ NHỮ KHÊ",
    so_ky_hieu: "Số:      /KH-UBND",
    dia_danh: "Nhữ Khê",
    trich_yeu: "Kế hoạch triển khai chiến dịch tiêm chủng mở rộng cho trẻ em năm 2026",
    noi_dung: "Nhằm nâng cao tỷ lệ tiêm chủng đầy đủ cho trẻ em dưới 5 tuổi trên địa bàn xã, hạn chế tối đa các ca truyền nhiễm. UBND xã ban hành Kế hoạch thực hiện cụ thể:\nI. MỤC TIÊU\n- 98% trẻ em trong độ tuổi được tiêm chủng đầy đủ các mũi cơ bản.\n- Đảm bảo an toàn tuyệt đối trong suốt quá trình tiêm chủng.\nII. NỘI DUNG VÀ THỜI GIAN THỰC HIỆN\n1. Thời gian: Từ ngày 15/07/2026 đến ngày 20/07/2026.\n2. Địa điểm: Tại Trạm y tế xã và nhà văn hóa các thôn.\n3. Đối tượng: Trẻ em từ 0 - 5 tuổi chưa tiêm đủ mũi vaccine theo chương trình Tiêm chủng mở rộng.\nIII. PHÂN CÔNG NHIỆM VỤ\n- Trạm y tế xã chuẩn bị vaccine, nhân lực khám sàng lọc và thực hiện tiêm.\n- Văn hóa xã phát loa tuyên truyền lịch tiêm cho phụ huynh học sinh.\n- Công an xã hỗ trợ phân luồng giao thông tại các địa điểm tiêm công cộng.",
    quyen_han_ky: "KT. CHỦ TỊCH",
    kt_chuc_vu: "PHÓ CHỦ TỊCH",
    chuc_vu_ky: "PHÓ CHỦ TỊCH",
    nguoi_ky: "Phạm Thùy Lâm",
    noi_nhan: [
      "Sở Y tế tỉnh (phối hợp);",
      "Đảng ủy xã (để b/c);",
      "Lưu: VT."
    ]
  },
  {
    id: "thong_bao",
    name: "Thông báo",
    code: "TB",
    description: "Văn bản dùng để thông tin về một vấn đề, chủ trương hoặc quyết định cho các cơ quan, đơn vị hoặc người dân biết.",
    co_quan_chu_quan: "ỦY BAN NHÂN DÂN TỈNH TUYÊN QUANG",
    co_quan_ban_hanh: "ỦY BAN NHÂN DÂN XÃ NHỮ KHÊ",
    so_ky_hieu: "Số:      /TB-UBND",
    dia_danh: "Nhữ Khê",
    trich_yeu: "Thông báo lịch tiếp công dân định kỳ của Chủ tịch Ủy ban nhân dân xã",
    noi_dung: "Thực hiện Luật Tiếp công dân ngày 25 tháng 11 năm 2013, UBND xã Nhữ Khê thông báo lịch tiếp công dân định kỳ của Chủ tịch UBND xã như sau:\n1. Thời gian tiếp công dân: Định kỳ vào ngày thứ Năm hàng tuần (nếu trùng vào ngày lễ, tết sẽ chuyển sang ngày làm việc tiếp theo).\n- Buổi sáng: Từ 7h30 đến 11h30.\n- Buổi chiều: Từ 13h30 đến 17h00.\n2. Địa điểm: Phòng Tiếp công dân tại trụ sở UBND xã Nhữ Khê.\n3. Thành phần tham gia: Chủ tịch UBND xã trực tiếp chủ trì. Đại diện Văn phòng, công chức Tư pháp - Hộ tịch và công chức Địa chính - Xây dựng cùng tham dự.\nUBND xã thông báo rộng rãi để toàn thể cán bộ, nhân dân trên địa bàn được biết và liên hệ công tác.",
    quyen_han_ky: "TL. CHỦ TỊCH",
    chuc_vu_ky: "CHÁNH VĂN PHÒNG",
    nguoi_ky: "Trần Xuân Hòa",
    noi_nhan: [
      "Thường trực Đảng ủy, HĐND xã;",
      "Thông báo trên loa phát thanh xã;",
      "Lưu: VT, VP."
    ]
  },
  {
    id: "to_trinh",
    name: "Tờ trình",
    code: "TTr",
    description: "Văn bản đề xuất với cấp trên xem xét phê duyệt một chủ trương, phương án hoặc đề án.",
    co_quan_chu_quan: "ỦY BAN NHÂN DÂN XÃ NHỮ KHÊ",
    co_quan_ban_hanh: "VĂN PHÒNG HĐND VÀ UBND",
    so_ky_hieu: "Số:      /TTr-VP",
    dia_danh: "Nhữ Khê",
    trich_yeu: "Về việc xin chủ trương kinh phí sửa chữa nhà văn hóa thôn bản năm 2026",
    kinh_gui: [
      "Ủy ban nhân dân xã Nhữ Khê",
      "Chủ tịch Ủy ban nhân dân xã Nhữ Khê"
    ],
    noi_dung: "Kính gửi UBND xã Nhữ Khê, hiện nay nhà văn hóa Thôn Lô Lô Chải sau thời gian dài sử dụng đã bị xuống cấp nghiêm trọng, mái ngói bị dột và tường bao quanh bị nứt nẻ, không đảm bảo an toàn cho nhân dân sinh hoạt.\nĐể chuẩn bị cho ngày hội văn hóa toàn dân sắp tới, Văn phòng HĐND và UBND xã Nhữ Khê đề xuất phương án sửa chữa:\n- Nội dung: Thay thế ngói hỏng, sơn lại tường, làm mới hệ thống điện và chiếu sáng.\n- Dự toán kinh phí: 50.000.000 đồng (Năm mươi triệu đồng chẵn).\n- Nguồn vốn: Đề xuất trích từ nguồn ngân sách dự phòng phát triển văn hóa năm 2026 của địa phương.\nKính trình Ủy ban nhân dân xã Nhữ Khê xem xét phê duyệt chủ trương thực hiện.",
    quyen_han_ky: "",
    chuc_vu_ky: "VĂN PHÒNG HĐND VÀ UBND",
    nguoi_ky: "Trần Xuân Hòa",
    noi_nhan: [
      "Như trên;",
      "Lưu: VT, VP."
    ]
  },
  {
    id: "bien_ban",
    name: "Biên bản",
    code: "BB",
    description: "Văn bản ghi chép lại diễn biến, nội dung họp, thỏa thuận hoặc các sự việc xảy ra thực tế.",
    co_quan_chu_quan: "ỦY BAN NHÂN DÂN XÃ NHỮ KHÊ",
    co_quan_ban_hanh: "VĂN PHÒNG HĐND VÀ UBND",
    so_ky_hieu: "Số:      /BB-UBND",
    dia_danh: "Nhữ Khê",
    trich_yeu: "Biên bản cuộc họp giao ban công tác tháng 5 của Ủy ban nhân dân xã Nhữ Khê",
    noi_dung: "Vào hồi 08 giờ 00 ngày 15 tháng 5 năm 2026, tại Phòng họp UBND xã Nhữ Khê diễn ra cuộc họp giao ban định kỳ.\nTHÀNH PHẦN THAM DỰ\n1. Chủ trì: Ông Nguyễn Văn Chiến - Chủ tịch UBND xã.\n2. Thư ký: Ông Trần Xuân Hòa - Chánh Văn phòng.\n3. Thành viên: Toàn thể công chức chuyên môn thuộc UBND xã.\nNỘI DUNG CUỘC HỌP\n- Ông Nguyễn Văn Chiến phát biểu khai mạc và đánh giá công tác chỉ đạo tháng qua. Bộ phận địa chính hoàn thành báo cáo bản đồ địa chính mới.\n- Bà Phạm Thùy Lâm báo cáo công tác xã hội, y tế trường học đã hoàn thành tốt chuẩn bị thi tốt nghiệp cấp 2.\nÝ kiến phát biểu thảo luận:\n- Công chức Tư pháp kiến nghị nâng cấp phòng tiếp dân trực tuyến.\nKẾT LUẬN CỦA CHỦ TRÌ\n1. Các đơn vị chuẩn bị chu đáo báo cáo 6 tháng đầu năm.\n2. Giao Văn phòng hoàn thành lắp đặt mạng cáp quang mới tại bộ phận một cửa trước ngày 20/5.\nCuộc họp kết thúc vào lúc 11 giờ 30 cùng ngày, biên bản đã được đọc và thông qua thống nhất.",
    quyen_han_ky: "",
    chuc_vu_ky: "THƯ KÝ",
    nguoi_ky: "Trần Xuân Hòa",
    noi_nhan: [],
    // Thêm các trường cho biên bản
    theo_de_nghi: "Trần Xuân Hòa", // Mượn trường lưu thư ký
    dong_quyet_dinh: "Nguyễn Văn Chiến" // Mượn trường lưu chủ trì
  },
  {
    id: "chuong_trinh",
    name: "Chương trình công tác",
    code: "CTr",
    description: "Văn bản xác định các hoạt động, sự kiện và công tác trọng tâm sẽ được triển khai trong tuần, tháng, quý hoặc năm.",
    co_quan_chu_quan: "ỦY BAN NHÂN DÂN TỈNH TUYÊN QUANG",
    co_quan_ban_hanh: "ỦY BAN NHÂN DÂN XÃ NHỮ KHÊ",
    so_ky_hieu: "Số:      /CTr-UBND",
    dia_danh: "Nhữ Khê",
    trich_yeu: "Chương trình công tác tháng 6 năm 2026 của Ủy ban nhân dân xã Nhữ Khê",
    noi_dung: "Để tổ chức triển khai đồng bộ các chỉ tiêu phát triển kinh tế - xã hội, quốc phòng an ninh năm 2026. UBND xã ban hành Chương trình công tác tháng 6 năm 2026 như sau:\n1. Công tác Kinh tế - Địa chính:\n- Tập trung chỉ đạo nhân dân hoàn thành thu hoạch lúa vụ chiêm và làm đất gieo cấy vụ mùa.\n- Ra quân kiểm tra hành lang an toàn giao thông trên các trục đường trục chính của xã.\n2. Công tác Văn hóa - Xã hội:\n- Tổ chức các hoạt động hưởng ứng Ngày Quốc tế Thiếu nhi 01/6 và Tháng hành động vì trẻ em.\n- Tiếp tục vận động nhân dân phòng chống dịch bệnh mùa hè.\n3. Công tác Nội vụ - An ninh trật tự:\n- Đẩy mạnh công tác trực ban phòng chống thiên tai và tìm kiếm cứu nạn mùa mưa bão.\n- Tổ chức giao ban định kỳ lực lượng Công an xã và Quân sự xã đảm bảo trực gác 24/24.",
    quyen_han_ky: "",
    chuc_vu_ky: "CHỦ TỊCH",
    nguoi_ky: "Nguyễn Văn Chiến",
    noi_nhan: [
      "Thường trực Tỉnh ủy (để b/c);",
      "Thường trực Đảng ủy, HĐND xã;",
      "Lưu: VT, VP."
    ]
  },
  {
    id: "ke_hoach_kiem_tra",
    name: "Kế hoạch kiểm tra",
    code: "KH",
    description: "Văn bản lên kế hoạch chi tiết về thời gian, đối tượng, nội dung thanh tra, kiểm tra giám sát chuyên đề.",
    co_quan_chu_quan: "ĐẢNG ỦY XÃ NHỮ KHÊ",
    co_quan_ban_hanh: "ỦY BAN KIỂM TRA ĐẢNG ỦY",
    so_ky_hieu: "Số:      /KH-UBKT",
    dia_danh: "Nhữ Khê",
    trich_yeu: "Kế hoạch kiểm tra chuyên đề về thực hiện quy chế dân chủ tại các Chi bộ trực thuộc năm 2026",
    noi_dung: "Thực hiện Chương trình kiểm tra giám sát năm 2026 của Đảng ủy xã, Ủy ban Kiểm tra (UBKT) ban hành Kế hoạch kiểm tra chuyên đề:\nI. MỤC ĐÍCH YÊU CẦU\n- Đánh giá đúng thực trạng lãnh đạo thực hiện quy chế dân chủ ở cơ sở tại các Chi bộ trực thuộc.\n- Kịp thời phát hiện chấn chỉnh những hạn chế, sai sót trong thu chi tài chính quỹ đóng góp tự nguyện.\nII. ĐỐI TƯỢNG VÀ NỘI DUNG KIỂM TRA\n1. Đối tượng: Chi bộ thôn Lô Lô Chải và Chi bộ thôn Séo Lủng.\n2. Nội dung: Kiểm tra việc công khai các khoản đóng góp tự nguyện của nhân dân làm đường bê tông nông thôn.\nIII. THỜI GIAN VÀ TIẾN TRÌNH THỰC HIỆN\n- Chi bộ tự kiểm tra báo cáo: Từ 15/06/2026 đến 20/06/2026.\n- UBKT Đảng ủy tiến hành thẩm tra trực tiếp: Từ 22/06/2026 đến 25/06/2026.\n- Ban hành thông báo kết luận kiểm tra trước ngày 05/07/2026.",
    quyen_han_ky: "TM. ỦY BAN KIỂM TRA",
    chuc_vu_ky: "CHỦ NHIỆM",
    nguoi_ky: "Lý Văn Páo",
    noi_nhan: [
      "Đảng ủy xã (để b/c);",
      "Các Chi bộ liên quan (thực hiện);",
      "Lưu: VT."
    ]
  },
  {
    id: "bao_cao_so_ket",
    name: "Báo cáo sơ kết",
    code: "BC",
    description: "Báo cáo tóm tắt, đánh giá kết quả thực hiện nhiệm vụ trong nửa kỳ hoặc kết thúc giai đoạn ngắn của một chương trình công tác.",
    co_quan_chu_quan: "ỦY BAN NHÂN DÂN TỈNH TUYÊN QUANG",
    co_quan_ban_hanh: "ỦY BAN NHÂN DÂN XÃ NHỮ KHÊ",
    so_ky_hieu: "Số:      /BC-UBND",
    dia_danh: "Nhữ Khê",
    trich_yeu: "Báo cáo sơ kết công tác thực hiện chuyển đổi số 6 tháng đầu năm 2026",
    noi_dung: "Thực hiện Kế hoạch chuyển đổi số năm 2026 của địa phương, UBND xã Nhữ Khê báo cáo sơ kết kết quả thực hiện trong 6 tháng đầu năm:\nI. KẾT QUẢ ĐẠT ĐƯỢC\n1. Phát triển hạ tầng số: 9/9 thôn bản đã phủ sóng di động 4G ổn định, thiết lập thành công 03 điểm phát wifi công cộng miễn phí tại các nhà văn hóa thôn kiểu mẫu.\n2. Xây dựng Chính quyền số: 100% hồ sơ công việc được luân chuyển trực tuyến trên hệ thống (trừ văn bản mật), tỷ lệ giải quyết thủ tục hành chính trực tuyến đạt 75%.\n3. Phát triển Kinh tế số và Xã hội số: Hỗ trợ 25 hộ gia đình sản xuất nông sản đặc sản (chè Shan tuyết, mật ong bạc hà) lập gian hàng trên sàn thương mại điện tử.\nII. TỒN TẠI HẠN CHẾ\n- Kỹ năng công nghệ thông tin của một số trưởng thôn còn hạn chế, chưa hỗ trợ đắc lực được người dân khai báo hồ sơ từ xa.\nIII. PHƯƠNG HƯỚNG 6 THÁNG CUỐI NĂM\n- Mở lớp bồi dưỡng kỹ năng công nghệ thông tin cho 100% tổ công nghệ số cộng đồng tại các thôn bản.",
    quyen_han_ky: "",
    chuc_vu_ky: "CHỦ TỊCH",
    nguoi_ky: "Nguyễn Văn Chiến",
    noi_nhan: [
      "Sở Thông tin và Truyền thông (để b/c);",
      "Thường trực Đảng ủy xã;",
      "Lưu: VT."
    ]
  },
  {
    id: "bao_cao_tong_ket",
    name: "Báo cáo tổng kết",
    code: "BC",
    description: "Báo cáo toàn diện kết quả thực hiện chương trình, nghị quyết hoặc tổng kết hoạt động cả năm của đơn vị.",
    co_quan_chu_quan: "ỦY BAN NHÂN DÂN TỈNH TUYÊN QUANG",
    co_quan_ban_hanh: "ỦY BAN NHÂN DÂN XÃ NHỮ KHÊ",
    so_ky_hieu: "Số:      /BC-UBND",
    dia_danh: "Nhữ Khê",
    trich_yeu: "Báo cáo tổng kết thực hiện phát triển kinh tế - xã hội, an ninh quốc phòng năm 2025",
    noi_dung: "Năm 2025, dưới sự lãnh đạo trực tiếp của Tỉnh ủy, HĐND tỉnh và Đảng ủy xã, UBND xã Nhữ Khê đã điều hành kinh tế - xã hội đạt kết quả nổi bật:\nI. LĨNH VỰC KINH TẾ\n- Tổng sản lượng lương thực có hạt đạt 1.200 tấn (vượt 2% kế hoạch).\n- Thu ngân sách trên địa bàn đạt 105% dự toán được giao.\nII. LĨNH VỰC VĂN HÓA - XÃ HỘI\n- Hoàn thành công tác xóa nhà tạm cho 12 hộ nghèo có hoàn cảnh đặc biệt khó khăn.\n- Tỷ lệ gia đình văn hóa đạt 88%.\nIII. LĨNH VỰC AN NINH QUỐC PHÒNG\n- Tình hình biên giới ổn định, chủ quyền lãnh thổ được giữ vững, tổ chức thành công cuộc diễn tập phòng thủ cấp xã đạt loại xuất sắc.\nHẠN CHẾ: Tiến độ giải ngân vốn đầu tư công ở một số công trình giao thông nông thôn còn chậm do vướng mắc giải phóng mặt bằng.\nBÀI HỌC KINH NGHIỆM: Cần phát huy tốt quy chế dân chủ, 'dân biết, dân bàn, dân làm, dân kiểm tra' trong giải phóng mặt bằng.",
    quyen_han_ky: "",
    chuc_vu_ky: "CHỦ TỊCH",
    nguoi_ky: "Nguyễn Văn Chiến",
    noi_nhan: [
      "UBND tỉnh Tuyên Quang (để b/c);",
      "HĐND xã (báo cáo tại kỳ họp);",
      "Lưu: VT."
    ]
  }
];
