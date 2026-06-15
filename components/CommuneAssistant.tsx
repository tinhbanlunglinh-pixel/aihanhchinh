'use client';

import React, { useState } from 'react';
import { generateDocumentWithAI, ApiSettings } from '@/lib/ai';
import { DocTemplate } from '@/lib/templateData';

export interface CommuneAssistantProps {
  apiSettings: ApiSettings;
  onGenerateDoc: (template: DocTemplate) => void;
}

interface AssistantJob {
  id: string;
  name: string;
  loai_vb: string;
  icon: string;
  metricsLabel: string;
  placeholderMetrics: string;
  defaultTopic: string;
}

export default function CommuneAssistant({ apiSettings, onGenerateDoc }: CommuneAssistantProps) {
  const [selectedJob, setSelectedJob] = useState<AssistantJob | null>(null);
  const [metricsText, setMetricsText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const jobs: AssistantJob[] = [
    { 
      id: 'bc_thang', 
      name: 'Báo cáo công tác tháng', 
      loai_vb: 'bao_cao', 
      icon: 'calendar_month',
      metricsLabel: 'Các kết quả nổi bật trong tháng',
      placeholderMetrics: 'VD: Tiếp nhận 120 hồ sơ tư pháp, dọn vệ sinh 3 tuyến đường thôn, thu ngân sách đạt 12 triệu...',
      defaultTopic: 'Báo cáo kết quả công tác hoạt động tháng'
    },
    { 
      id: 'bc_quy', 
      name: 'Báo cáo công tác quý', 
      loai_vb: 'bao_cao', 
      icon: 'date_range',
      metricsLabel: 'Các chỉ tiêu và số liệu đạt được trong quý',
      placeholderMetrics: 'VD: Hoàn thành tiêm chủng cho 80 trẻ em, giải quyết 98% hồ sơ đúng hạn, kết nạp 2 đảng viên mới...',
      defaultTopic: 'Báo cáo tình hình thực hiện nhiệm vụ quý'
    },
    { 
      id: 'bc_6thang', 
      name: 'Báo cáo 6 tháng đầu năm', 
      loai_vb: 'bao_cao', 
      icon: 'analytics',
      metricsLabel: 'Số liệu sơ kết kinh tế, văn hóa xã hội 6 tháng',
      placeholderMetrics: 'VD: Năng suất lúa đạt 5.5 tấn/ha, giải ngân vốn đầu tư công đạt 45%, quốc phòng giữ vững ổn định...',
      defaultTopic: 'Báo cáo tình hình phát triển kinh tế - xã hội 6 tháng đầu năm'
    },
    { 
      id: 'bc_nam', 
      name: 'Báo cáo tổng kết năm', 
      loai_vb: 'bao_cao', 
      icon: 'summarize',
      metricsLabel: 'Số liệu tổng kết toàn diện cả năm',
      placeholderMetrics: 'VD: Đạt 15/15 chỉ tiêu tỉnh giao, xóa 5 nhà tạm, tỷ lệ hộ nghèo giảm 2%, hoàn thành chỉ tiêu tuyển quân...',
      defaultTopic: 'Báo cáo tổng kết phát triển kinh tế - xã hội và quốc phòng an ninh năm'
    },
    { 
      id: 'ctr_tuan', 
      name: 'Chương trình công tác tuần', 
      loai_vb: 'chuong_trinh', 
      icon: 'view_week',
      metricsLabel: 'Lịch họp và các buổi làm việc chính',
      placeholderMetrics: 'VD: Thứ Hai họp giao ban UBND; Thứ Tư kiểm tra nương chè Lô Lô Chải; Thứ Sáu tiếp công dân định kỳ...',
      defaultTopic: 'Chương trình công tác tuần của Ủy ban nhân dân xã'
    },
    { 
      id: 'ctr_thang', 
      name: 'Chương trình công tác tháng', 
      loai_vb: 'chuong_trinh', 
      icon: 'calendar_view_month',
      metricsLabel: 'Các nhiệm vụ trọng tâm của tháng tới',
      placeholderMetrics: 'VD: Tập trung thu hoạch lúa chiêm xuân; Tổ chức diễn tập phòng cháy chữa cháy rừng; Tiếp tục nâng cấp bộ phận Một cửa...',
      defaultTopic: 'Chương trình công tác tháng của Ủy ban nhân dân xã'
    },
    { 
      id: 'kh_nghi_quyet', 
      name: 'Kế hoạch thực hiện nghị quyết', 
      loai_vb: 'ke_hoach', 
      icon: 'assignment',
      metricsLabel: 'Các biện pháp triển khai nghị quyết chuyên đề',
      placeholderMetrics: 'VD: Phân công Công an xã rà soát các hộ tạm trú; Giao Đoàn thanh niên lắp đặt đèn chiếu sáng các ngõ thôn...',
      defaultTopic: 'Kế hoạch triển khai thực hiện Nghị quyết chuyên đề của Đảng ủy xã'
    },
    { 
      id: 'bc_dxs', 
      name: 'Báo cáo chuyển đổi số cấp xã', 
      loai_vb: 'bao_cao', 
      icon: 'devices',
      metricsLabel: 'Các thành tích, tỷ lệ hồ sơ trực tuyến',
      placeholderMetrics: 'VD: Tỷ lệ dịch vụ công trực tuyến đạt 80%; Phủ sóng wifi miễn phí tại 5 nhà văn hóa thôn; 100% cán bộ ký số...',
      defaultTopic: 'Báo cáo kết quả thực hiện công tác Chuyển đổi số cấp xã năm 2026'
    },
    { 
      id: 'bc_cchc', 
      name: 'Báo cáo cải cách hành chính (CCHC)', 
      loai_vb: 'bao_cao', 
      icon: 'badge',
      metricsLabel: 'Số liệu tiếp nhận, xử lý Một cửa, đo lường hài lòng',
      placeholderMetrics: 'VD: Tiếp nhận 600 hồ sơ, giải quyết đúng hạn 99%; Chỉ số hài lòng của người dân đạt 95%; Rút ngắn 2 ngày giải quyết đất đai...',
      defaultTopic: 'Báo cáo kết quả thực hiện công tác Cải cách hành chính năm 2026'
    }
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setLoading(true);

    try {
      const currentYear = new Date().getFullYear();
      const topic = `${selectedJob.defaultTopic} ${selectedJob.id.includes('tuan') ? 'tuần này' : selectedJob.id.includes('thang') ? 'này' : currentYear}`;
      
      const aiResult = await generateDocumentWithAI(
        {
          loai_van_ban: selectedJob.loai_vb,
          chu_de: topic,
          muc_dich: `Đánh giá tiến độ, tổng kết chỉ tiêu công tác và định hướng nhiệm vụ phối hợp hành chính trên địa bàn xã.`,
          doi_tuong: `Các ban ngành đoàn thể, công chức chuyên môn và Ban chỉ sự các thôn bản.`,
          can_cu: `Quyết định chương trình công tác của UBND tỉnh và Nghị quyết Đảng ủy xã năm ${currentYear}.`,
          yeu_cau: `Số liệu báo cáo thực tế: ${metricsText || '[Không bổ sung số liệu]'}`
        },
        apiSettings.geminiKey || apiSettings.openaiKey || undefined,
        apiSettings.apiProvider
      );

      const newDoc: DocTemplate = {
        id: selectedJob.loai_vb,
        name: selectedJob.loai_vb === 'bao_cao' ? 'Báo cáo' : selectedJob.loai_vb === 'chuong_trinh' ? 'Chương trình công tác' : 'Kế hoạch',
        code: selectedJob.loai_vb === 'bao_cao' ? 'BC' : selectedJob.loai_vb === 'chuong_trinh' ? 'CTr' : 'KH',
        description: `Sinh tự động chuyên đề ${selectedJob.name}`,
        co_quan_ban_hanh: apiSettings.co_quan_ban_hanh || 'ỦY BAN NHÂN DÂN XÃ LŨNG CÚ',
        so_ky_hieu: `Số:      /${selectedJob.loai_vb === 'bao_cao' ? 'BC' : selectedJob.loai_vb === 'chuong_trinh' ? 'CTr' : 'KH'}-UBND`,
        dia_danh: apiSettings.dia_danh || 'Lũng Cú',
        trich_yeu: (selectedJob.loai_vb === 'bao_cao' ? 'Báo cáo ' : selectedJob.loai_vb === 'chuong_trinh' ? 'Chương trình ' : 'Kế hoạch ') + topic,
        noi_dung: aiResult,
        noi_nhan: ['Đảng ủy, HĐND xã (để b/c);', 'Ủy viên UBND xã;', 'Lưu: VT.'],
        quyen_han_ky: apiSettings.quyen_han_ky || 'TM. ỦY BAN NHÂN DÂN',
        chuc_vu_ky: apiSettings.chuc_vu_ky || 'CHỦ TỊCH',
        nguoi_ky: apiSettings.nguoi_ky || 'Nguyễn Văn Chiến'
      };

      onGenerateDoc(newDoc);
      setSelectedJob(null);
      setMetricsText('');
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      alert(errMsg || 'Lỗi khi sinh văn bản trợ lý.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center gap-2.5 text-blue-600">
        <span className="material-icons-round text-2xl">gavel</span>
        <h2 className="text-lg font-bold">Trợ lý AI chuyên trách cho cán bộ chính quyền cấp xã</h2>
      </div>
      <p className="text-slate-500 text-xs leading-relaxed -mt-4">
        Hệ thống tự động hóa lập biểu và viết báo cáo chuyên đề cho Ủy ban nhân dân và Đảng ủy xã. Hãy chọn một nghiệp vụ và bổ sung số liệu thực tế nhanh.
      </p>

      {/* Grid of Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map(job => (
          <button
            key={job.id}
            onClick={() => {
              setSelectedJob(job);
              setMetricsText('');
            }}
            className="p-5 rounded-2xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-blue-50/10 text-left flex gap-4 items-start transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <span className="material-icons-round text-lg">{job.icon}</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-800">{job.name}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Sinh file {job.loai_vb === 'bao_cao' ? 'Báo cáo' : job.loai_vb === 'chuong_trinh' ? 'Chương trình' : 'Kế hoạch'} chuẩn NĐ30</p>
            </div>
          </button>
        ))}
      </div>

      {/* PARAMETERS CONFIG MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full flex flex-col animate-scaleUp">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-800">Cấu hình nhanh: {selectedJob.name}</h3>
                <p className="text-slate-500 text-xs mt-0.5">Bổ sung số liệu thực tế để AI viết báo cáo chính xác.</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-icons-round">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleGenerate}>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{selectedJob.metricsLabel}</label>
                  <textarea
                    rows={4}
                    placeholder={selectedJob.placeholderMetrics}
                    value={metricsText}
                    onChange={(e) => setMetricsText(e.target.value)}
                    className="px-3.5 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 leading-relaxed font-sans"
                  />
                  <span className="text-[10px] text-slate-400 italic">Các số liệu thực tế sẽ được AI phân tích và diễn giải theo đúng văn phong công sở chính thống.</span>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2.5 hover:bg-slate-100 rounded-xl text-slate-600 font-semibold text-xs transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10 disabled:opacity-50"
                >
                  <span className={`material-icons-round text-sm ${loading ? 'animate-spin' : ''}`}>
                    {loading ? 'autorenew' : 'auto_awesome'}
                  </span>
                  <span>{loading ? 'AI đang viết...' : 'Bắt đầu sinh báo cáo'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
