export interface PromptTemplate {
  id: string;
  department: string;
  title: string;
  description: string;
  system_instructions: string;
  sample_user_input: {
    loai_van_ban: string;
    chu_de: string;
    muc_dich: string;
    doi_tuong: string;
    can_cu: string;
    yeu_cau: string;
  };
}

export const PROMPTS: PromptTemplate[] = [
  {
    id: "dang_uy",
    department: "Văn phòng Đảng ủy",
    title: "Nghị quyết/Kế hoạch Đảng ủy",
    description: "Tập trung vào công tác lãnh đạo, tư tưởng chỉ đạo, quán triệt nghị quyết cấp trên và phân công các Chi bộ trực thuộc.",
    system_instructions: "Sinh văn bản với đại từ xưng hô và thể thức Đảng (chuẩn Hướng dẫn 36-HD/VPTW). Sử dụng văn phong mang tính chính trị cao, chỉ đạo quyết liệt. Sử dụng các thuật ngữ chuyên ngành: 'quán triệt', 'tư tưởng chỉ đạo', 'kiểm tra giám sát', 'nâng cao năng lực lãnh đạo', 'xây dựng tổ chức cơ sở đảng vững mạnh'.",
    sample_user_input: {
      loai_van_ban: "nq_dang_uy",
      chu_de: "Tăng cường sự lãnh đạo của Đảng đối với công tác dân vận khéo tại các chi bộ thôn bản giai đoạn 2026-2030",
      muc_dich: "Nâng cao nhận thức của cấp ủy, đảng viên về tầm quan trọng của công tác dân vận, xây dựng các tổ tự quản kiểu mẫu về vệ sinh môi trường.",
      doi_tuong: "Các Chi bộ trực thuộc, Ban Dân vận Đảng ủy, Ủy ban MTTQ và các đoàn thể xã.",
      can_cu: "Nghị quyết Đại hội Đảng bộ xã khóa XV nhiệm kỳ 2025-2030; Kế hoạch dân vận của Tỉnh ủy.",
      yeu_cau: "Đề ra chỉ tiêu mỗi chi bộ xây dựng ít nhất 01 mô hình dân vận khéo hoạt động hiệu quả trong năm 2026."
    }
  },
  {
    id: "ubnd_xa",
    department: "UBND xã",
    title: "Quyết định hành chính/Báo cáo kinh tế",
    description: "Giải quyết các công việc quản lý hành chính Nhà nước tại địa phương: hộ tịch, địa chính, an ninh nông thôn, ngân sách.",
    system_instructions: "Văn phong chuẩn hành chính công theo Nghị định 30/2020/NĐ-CP. Ngôn từ chặt chẽ, chính xác, sử dụng thuật ngữ pháp lý. Đảm bảo có đầy đủ các căn cứ Luật, Quyết định của tỉnh để ban hành các văn bản điều hành, quản lý.",
    sample_user_input: {
      loai_van_ban: "quyet_dinh",
      chu_de: "Ban hành Quy chế quản lý chất thải rắn sinh hoạt và bảo vệ môi trường nông thôn trên địa bàn xã Nhữ Khê",
      muc_dich: "Quy định rõ trách nhiệm thu gom rác của các hộ dân, mức đóng góp phí vệ sinh môi trường tự nguyện và phân công giám sát cho các thôn bản.",
      doi_tuong: "Công chức Địa chính - Xây dựng - Đô thị và Môi trường, Trưởng các thôn bản và toàn thể nhân dân trên địa bàn xã.",
      can_cu: "Luật Bảo vệ môi trường ngày 17 tháng 11 năm 2020; Nghị định số 08/2022/NĐ-CP của Chính phủ hướng dẫn chi tiết Luật BVMT.",
      yeu_cau: "Mức phí thu gom rác đề xuất là 15.000đ/hộ/tháng đối với hộ dân thường và 30.000đ/hộ/tháng đối với hộ kinh doanh dịch vụ homestay."
    }
  },
  {
    id: "mttq",
    department: "Mặt trận Tổ quốc",
    title: "Kế hoạch giám sát/Vận động nhân dân",
    description: "Công tác phối hợp giám sát phản biện xã hội, phát động các phong trào thi đua yêu nước, quỹ vì người nghèo.",
    system_instructions: "Sử dụng ngôn từ mang tính đoàn kết, đồng thuận xã hội, thuyết phục và hiệp thương. Tập trung vào 'khối đại đoàn kết', 'phát huy quyền làm chủ của nhân dân', 'hiệp thương dân chủ', 'giám sát và phản biện xã hội'.",
    sample_user_input: {
      loai_van_ban: "ke_hoach",
      chu_de: "Giám sát công tác giải quyết thủ tục hành chính liên quan đến cấp Giấy chứng nhận quyền sử dụng đất tại bộ phận Một cửa xã năm 2026",
      muc_dich: "Phát hiện những bất cập, chậm trễ trong quy trình tiếp nhận hồ sơ đất đai gây phiền hà cho nhân dân, đề xuất giải pháp chấn chỉnh.",
      doi_tuong: "Thường trực HĐND xã, bộ phận Một cửa xã và Ban Thanh tra nhân dân xã.",
      can_cu: "Luật Mặt trận Tổ quốc Việt Nam năm 2015; Quyết định số 217-QĐ/TW của Bộ Chính trị về giám sát và phản biện xã hội.",
      yeu_cau: "Kiểm tra thực tế ngẫu nhiên ít nhất 15 hồ sơ giao dịch đất đai trong quý II/2026, đối thoại trực tiếp với người dân đi làm thủ tục."
    }
  },
  {
    id: "phu_nu",
    department: "Hội Phụ nữ",
    title: "Kế hoạch phong trào phụ nữ/Hỗ trợ gia đình",
    description: "Phát động các phong trào '5 không 3 sạch', hỗ trợ phụ nữ khởi nghiệp, bảo vệ quyền lợi trẻ em và phụ nữ.",
    system_instructions: "Văn phong gần gũi, vận động nhân văn nhưng vẫn đảm bảo khuôn mẫu văn bản hành chính. Sử dụng thuật ngữ: 'bình đẳng giới', 'gia đình hạnh phúc', 'hỗ trợ sinh kế', 'xây dựng nông thôn mới'.",
    sample_user_input: {
      loai_van_ban: "ke_hoach",
      chu_de: "Phát động phong trào 'Xây dựng gia đình 5 không, 3 sạch' góp phần chung tay xây dựng nông thôn mới kiểu mẫu năm 2026",
      muc_dich: "Nâng cao chất lượng cuộc sống cho hội viên, giữ gìn cảnh quan đường làng ngõ xóm sáng - xanh - sạch - đẹp.",
      doi_tuong: "Chi hội trưởng phụ nữ các thôn, bản và toàn thể hội viên phụ nữ xã.",
      can_cu: "Nghị quyết Đại hội đại biểu Phụ nữ toàn quốc lần thứ XIII; Kế hoạch phát triển nông thôn mới của xã Nhữ Khê.",
      yeu_cau: "Tổ chức tổng vệ sinh đường làng ngõ xóm vào sáng Chủ nhật hàng tuần. Trồng hoa ven đường trục chính của thôn."
    }
  },
  {
    id: "doan_thanh_nien",
    department: "Đoàn Thanh niên",
    title: "Kế hoạch tình nguyện/Hoạt động hè",
    description: "Chiến dịch Thanh niên tình nguyện hè, phát triển phong trào thanh niên lập nghiệp, chuyển đổi số cộng đồng.",
    system_instructions: "Văn phong sôi nổi, nhiệt huyết, thể hiện tinh thần xung kích của tuổi trẻ nhưng giữ đúng bố cục văn bản hành chính công vụ. Từ khóa: 'xung kích', 'tình nguyện', 'tiên phong', 'chuyển đổi số', 'sức trẻ'.",
    sample_user_input: {
      loai_van_ban: "ke_hoach",
      chu_de: "Chiến dịch Thanh niên tình nguyện hè năm 2026 - Ra quân hỗ trợ người dân cài đặt dịch vụ công trực tuyến VNeID mức độ 2",
      muc_dich: "Phát huy tinh thần xung kích của đoàn viên trong chuyển đổi số, giúp địa phương hoàn thành chỉ tiêu cài đặt định danh điện tử quốc gia.",
      doi_tuong: "Đoàn viên thanh niên, học sinh sinh viên nghỉ hè sinh hoạt tại địa phương.",
      can_cu: "Chương trình công tác Đoàn và phong trào thanh thiếu nhi năm 2026 của Tỉnh đoàn; Nghị quyết Đảng ủy xã về chuyển đổi số.",
      yeu_cau: "Thành lập 09 đội hình thanh niên tình nguyện đi từng ngõ, gõ từng nhà hướng dẫn nhân dân cài đặt và kích hoạt tài khoản định danh."
    }
  },
  {
    id: "nong_dan",
    department: "Hội Nông dân",
    title: "Kế hoạch sản xuất nông nghiệp/Vay vốn",
    description: "Hướng dẫn hội viên tiếp cận khoa học kỹ thuật, vay vốn chính sách ưu đãi, phát triển kinh tế hộ gia đình.",
    system_instructions: "Văn phong thực tiễn, cụ thể, dễ hiểu. Tập trung vào: 'nông dân sản xuất kinh doanh giỏi', 'hỗ trợ nguồn vốn vay', 'chuyển giao khoa học kỹ thuật', 'xây dựng chuỗi liên kết sản xuất'.",
    sample_user_input: {
      loai_van_ban: "ke_hoach",
      chu_de: "Tổ chức lớp tập huấn chuyển giao khoa học kỹ thuật trồng chè Shan tuyết hữu cơ định hướng tiêu chuẩn VietGAP năm 2026",
      muc_dich: "Giúp nông dân thay đổi phương thức canh tác truyền thống, ứng dụng tiến bộ sinh học nâng cao giá trị sản phẩm chè hữu cơ Nhữ Khê.",
      doi_tuong: "Các hộ gia đình trồng chè tại các thôn bản trên địa bàn xã.",
      can_cu: "Chương trình phối hợp công tác giữa Hội Nông dân tỉnh và Sở Nông nghiệp năm 2026.",
      yeu_cau: "Mời chuyên gia nông nghiệp từ tỉnh về hướng dẫn thực hành ủ phân hữu cơ vi sinh tại nương chè. Lớp tập huấn kéo dài 02 ngày."
    }
  },
  {
    id: "cong_an_xa",
    department: "Công an xã",
    title: "Kế hoạch tuần tra/Phòng chống tội phạm",
    description: "Đảm bảo an ninh trật tự, quản lý cư trú, phòng chống tệ nạn xã hội và bảo vệ an toàn biên giới.",
    system_instructions: "Văn phong quân lệnh, nghiêm ngặt, bảo mật và chính xác tuyệt đối. Sử dụng các thuật ngữ nghiệp vụ công an: 'tuần tra kiểm soát', 'đấu tranh phòng chống tội phạm', 'quản lý cư trú', 'tình hình địa bàn', 'chủ động nắm tình hình'.",
    sample_user_input: {
      loai_van_ban: "ke_hoach",
      chu_de: "Tăng cường tuần tra, kiểm soát đảm bảo an ninh trật tự và phòng chống trộm cắp tài sản trong mùa thu hoạch nông sản năm 2026",
      muc_dich: "Bảo vệ tài sản của nhân dân, kịp thời phát hiện ngăn chặn các đối tượng lạ vãng lai trộm cắp, phá hoại nương rẫy trong mùa thu hoạch.",
      doi_tuong: "Cán bộ chiến sĩ Công an xã, lực lượng bảo vệ an ninh trật tự cơ sở tại các thôn bản.",
      can_cu: "Chỉ thị của Công an tỉnh Tuyên Quang về công tác bảo vệ trật tự an toàn xã hội năm 2026.",
      yeu_cau: "Tổ chức tuần tra khép kín địa bàn từ 22 giờ đêm hôm trước đến 4 giờ sáng ngày hôm sau tại các khu vực nương rẫy giáp ranh."
    }
  },
  {
    id: "quan_su_xa",
    department: "Ban Chỉ huy quân sự",
    title: "Kế hoạch huấn luyện/Trực phòng thủ",
    description: "Huấn luyện dân quân tự vệ, tuyển chọn gọi công dân nhập ngũ, ứng phó thiên tai, bão lũ cứu nạn cứu hộ.",
    system_instructions: "Văn phong quân sự, kỷ luật thép, mệnh lệnh ngắn gọn, phân công rõ thời gian quân số. Từ khóa: 'huấn luyện dân quân', 'sẵn sàng chiến đấu', 'tác chiến phòng thủ', 'tuyển quân', 'phòng chống thiên tai'.",
    sample_user_input: {
      loai_van_ban: "ke_hoach",
      chu_de: "Tổ chức huấn luyện lực lượng Dân quân cơ động và Dân quân tại chỗ xã Nhữ Khê năm 2026",
      muc_dich: "Nâng cao trình độ kỹ chiến thuật, sử dụng thành thạo vũ khí trang bị và sẵn sàng cơ động ứng phó khi có tình huống xảy ra.",
      doi_tuong: "Lực lượng dân quân cơ động xã và dân quân tại chỗ thuộc 9 thôn bản.",
      can_cu: "Luật Dân quân tự vệ ngày 22 tháng 11 năm 2019; Mệnh lệnh huấn luyện chiến đấu của Chỉ huy trưởng Bộ CHQS tỉnh.",
      yeu_cau: "Thời gian huấn luyện tập trung 15 ngày đối với dân quân cơ động và 7 ngày đối với dân quân tại chỗ. Tỷ lệ quân số tham gia đạt trên 95%."
    }
  }
];
