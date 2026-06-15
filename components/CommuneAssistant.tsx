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
  group: 'UBND' | 'BCHQS';
}

export default function CommuneAssistant({ apiSettings, onGenerateDoc }: CommuneAssistantProps) {
  const [selectedJob, setSelectedJob] = useState<AssistantJob | null>(null);
  const [metricsText, setMetricsText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const jobs: AssistantJob[] = [
    // === THAM MƯU UBND XÃ ===
    { 
      id: 'kh_qs_ubnd', 
      name: 'Kế hoạch QP, QS địa phương', 
      loai_vb: 'ke_hoach', 
      icon: 'military_tech',
      metricsLabel: 'Các chỉ tiêu quốc phòng, quân sự trọng tâm',
      placeholderMetrics: 'VD: Hoàn thành 100% chỉ tiêu giao quân, huấn luyện 100% quân số...',
      defaultTopic: 'Kế hoạch công tác quốc phòng, quân sự địa phương năm',
      group: 'UBND'
    },
    { 
      id: 'bc_qs_ubnd', 
      name: 'Báo cáo công tác QP, QS', 
      loai_vb: 'bao_cao', 
      icon: 'shield',
      metricsLabel: 'Kết quả thực hiện công tác quốc phòng, quân sự',
      placeholderMetrics: 'VD: Tuyển quân đạt 15 thanh niên, an ninh chính trị ổn định...',
      defaultTopic: 'Báo cáo kết quả công tác quốc phòng, quân sự địa phương',
      group: 'UBND'
    },
    { 
      id: 'qd_tuyen_quan', 
      name: 'Quyết định giao chỉ tiêu nhập ngũ', 
      loai_vb: 'quyet_dinh', 
      icon: 'group_add',
      metricsLabel: 'Chỉ tiêu tuyển quân chi tiết',
      placeholderMetrics: 'VD: Giao thôn Nhữ Khê 3 công dân, thôn 2 là 2 công dân...',
      defaultTopic: 'Quyết định về việc giao chỉ tiêu gọi công dân nhập ngũ năm',
      group: 'UBND'
    },
    // === THAM MƯU CHỈ HUY TRƯỞNG ===
    { 
      id: 'ctr_tuan_bchqs', 
      name: 'Chương trình công tác tuần BCHQS', 
      loai_vb: 'chuong_trinh', 
      icon: 'event',
      metricsLabel: 'Lịch làm việc và huấn luyện tuần',
      placeholderMetrics: 'VD: Thứ 2 giao ban BCHQS; Thứ 3-5 huấn luyện dân quân...',
      defaultTopic: 'Chương trình công tác tuần của Ban Chỉ huy quân sự xã',
      group: 'BCHQS'
    },
    { 
      id: 'bc_huan_luyen', 
      name: 'Báo cáo kết quả huấn luyện', 
      loai_vb: 'bao_cao', 
      icon: 'fitness_center',
      metricsLabel: 'Kết quả kiểm tra huấn luyện dân quân',
      placeholderMetrics: 'VD: 100% đạt yêu cầu, 75% khá giỏi, đảm bảo an toàn tuyệt đối...',
      defaultTopic: 'Báo cáo kết quả công tác huấn luyện dân quân tự vệ năm',
      group: 'BCHQS'
    },
    { 
      id: 'kh_dqtv', 
      name: 'Kế hoạch công tác DQTV', 
      loai_vb: 'ke_hoach', 
      icon: 'security',
      metricsLabel: 'Mục tiêu, nhiệm vụ xây dựng lực lượng DQTV',
      placeholderMetrics: 'VD: Biên chế 1 trung đội cơ động, 3 tiểu đội tại chỗ, trực sẵn sàng chiến đấu...',
      defaultTopic: 'Kế hoạch công tác dân quân tự vệ năm',
      group: 'BCHQS'
    }
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setLoading(true);

    try {
      const currentYear = new Date().getFullYear();
      const topic = `${selectedJob.defaultTopic} ${selectedJob.id.includes('tuan') ? 'tuần này' : selectedJob.id.includes('thang') ? 'này' : currentYear}`;
      const isUBND = selectedJob.group === 'UBND';
      
      const aiResult = await generateDocumentWithAI(
        {
          loai_van_ban: selectedJob.loai_vb,
          chu_de: topic,
          muc_dich: `Tham mưu cho ${isUBND ? 'UBND xã' : 'Chỉ huy trưởng BCHQS xã'} trong công tác lãnh đạo, chỉ đạo nhiệm vụ quân sự, quốc phòng địa phương.`,
          doi_tuong: `Các ban ngành đoàn thể, thôn bản, và lực lượng vũ trang địa phương.`,
          can_cu: `Luật Dân quân tự vệ; Luật Nghĩa vụ quân sự; Nghị quyết của Đảng ủy xã năm ${currentYear}.`,
          yeu_cau: `Số liệu báo cáo thực tế: ${metricsText || '[Không bổ sung số liệu]'}`
        },
        apiSettings.geminiKey || apiSettings.openaiKey || undefined,
        apiSettings.apiProvider
      );

      const newDoc: DocTemplate = {
        id: selectedJob.loai_vb,
        name: selectedJob.loai_vb === 'bao_cao' ? 'Báo cáo' : selectedJob.loai_vb === 'chuong_trinh' ? 'Chương trình công tác' : selectedJob.loai_vb === 'quyet_dinh' ? 'Quyết định' : 'Kế hoạch',
        code: selectedJob.loai_vb === 'bao_cao' ? 'BC' : selectedJob.loai_vb === 'chuong_trinh' ? 'CTr' : selectedJob.loai_vb === 'quyet_dinh' ? 'QĐ' : 'KH',
        description: `Sinh tự động chuyên đề ${selectedJob.name}`,
        co_quan_chu_quan: isUBND ? '' : 'ỦY BAN NHÂN DÂN XÃ NHỮ KHÊ',
        co_quan_ban_hanh: isUBND ? 'ỦY BAN NHÂN DÂN XÃ NHỮ KHÊ' : 'BAN CHỈ HUY QUÂN SỰ',
        so_ky_hieu: `Số:      /${selectedJob.loai_vb === 'bao_cao' ? 'BC' : selectedJob.loai_vb === 'chuong_trinh' ? 'CTr' : selectedJob.loai_vb === 'quyet_dinh' ? 'QĐ' : 'KH'}-${isUBND ? 'UBND' : 'BCH'}`,
        dia_danh: apiSettings.dia_danh || 'Nhữ Khê',
        trich_yeu: (selectedJob.loai_vb === 'bao_cao' ? 'Báo cáo ' : selectedJob.loai_vb === 'chuong_trinh' ? 'Chương trình ' : selectedJob.loai_vb === 'quyet_dinh' ? 'Về việc ' : 'Kế hoạch ') + topic,
        noi_dung: aiResult,
        noi_nhan: isUBND ? ['Bộ CHQS tỉnh (để b/c);', 'Đảng ủy, HĐND xã (để b/c);', 'Lưu: VT, BCHQS.'] : ['Chủ tịch UBND xã (để b/c);', 'Bộ CHQS tỉnh (để b/c);', 'Lưu: VT.'],
        quyen_han_ky: isUBND ? 'TM. ỦY BAN NHÂN DÂN' : '',
        chuc_vu_ky: isUBND ? 'CHỦ TỊCH' : 'CHỈ HUY TRƯỞNG',
        nguoi_ky: isUBND ? (apiSettings.nguoi_ky || 'Nguyễn Văn Chiến') : 'Đặng Thanh Tuyền'
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

  const ubndJobs = jobs.filter(j => j.group === 'UBND');
  const bchqsJobs = jobs.filter(j => j.group === 'BCHQS');

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center gap-2.5 text-blue-700">
        <span className="material-icons-round text-2xl">military_tech</span>
        <h2 className="text-lg font-bold">Trợ lý AI chuyên trách BCHQS Xã Nhữ Khê</h2>
      </div>
      <p className="text-slate-500 text-xs leading-relaxed -mt-4">
        Hệ thống tự động hóa lập biểu, viết báo cáo chuyên đề tham mưu cho UBND xã và Ban Chỉ huy quân sự xã.
      </p>

      {/* THAM MƯU UBND XÃ */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide">Tham mưu cho UBND Xã</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ubndJobs.map(job => (
            <button
              key={job.id}
              onClick={() => {
                setSelectedJob(job);
                setMetricsText('');
              }}
              className="p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50 text-left flex gap-4 items-start transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-icons-round text-lg">{job.icon}</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">{job.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Sinh file {job.loai_vb === 'bao_cao' ? 'Báo cáo' : job.loai_vb === 'chuong_trinh' ? 'Chương trình' : job.loai_vb === 'quyet_dinh' ? 'Quyết định' : 'Kế hoạch'}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* THAM MƯU CHỈ HUY TRƯỞNG */}
      <div className="mt-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
          <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide">Tham mưu Chỉ huy trưởng BCHQS</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bchqsJobs.map(job => (
            <button
              key={job.id}
              onClick={() => {
                setSelectedJob(job);
                setMetricsText('');
              }}
              className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50 text-left flex gap-4 items-start transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-icons-round text-lg">{job.icon}</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">{job.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Sinh file {job.loai_vb === 'bao_cao' ? 'Báo cáo' : job.loai_vb === 'chuong_trinh' ? 'Chương trình' : 'Kế hoạch'}</p>
              </div>
            </button>
          ))}
        </div>
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
                  <span>{loading ? 'AI đang viết...' : 'Bắt đầu sinh văn bản'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
