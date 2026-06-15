'use client';

import React, { useState } from 'react';
import { ApiSettings, generateFullDocumentWithAI, SmartComposeInput, TEN_LOAI_VB } from '@/lib/ai';
import { DocTemplate } from '@/lib/templateData';

export interface AISmartComposerProps {
  apiSettings: ApiSettings;
  onDocumentReady: (doc: DocTemplate) => void;
}

const DOCUMENT_TYPES = [
  { id: 'cong_van', name: 'Công văn', icon: 'mail', group: 'Phổ biến', desc: 'Giao dịch, trao đổi công việc' },
  { id: 'quyet_dinh', name: 'Quyết định', icon: 'gavel', group: 'Phổ biến', desc: 'Ban hành quy chế, nhân sự' },
  { id: 'bao_cao', name: 'Báo cáo', icon: 'assessment', group: 'Phổ biến', desc: 'Báo cáo định kỳ, sơ/tổng kết' },
  { id: 'ke_hoach', name: 'Kế hoạch', icon: 'event_note', group: 'Phổ biến', desc: 'Triển khai công việc, sự kiện' },
  
  { id: 'thong_bao', name: 'Thông báo', icon: 'campaign', group: 'Hành chính', desc: 'Thông tin chủ trương, lịch họp' },
  { id: 'to_trinh', name: 'Tờ trình', icon: 'file_present', group: 'Hành chính', desc: 'Đề xuất, xin ý kiến cấp trên' },
  { id: 'bien_ban', name: 'Biên bản', icon: 'history_edu', group: 'Hành chính', desc: 'Ghi chép sự kiện, cuộc họp' },
  { id: 'chuong_trinh', name: 'Chương trình', icon: 'format_list_bulleted', group: 'Hành chính', desc: 'Chương trình công tác' },
  
  { id: 'nghi_quyet', name: 'Nghị quyết', icon: 'account_balance', group: 'Đặc thù', desc: 'Quyết định tập thể' },
  { id: 'chi_thi', name: 'Chỉ thị', icon: 'assignment', group: 'Đặc thù', desc: 'Chỉ đạo cấp dưới' },
  { id: 'huong_dan', name: 'Hướng dẫn', icon: 'menu_book', group: 'Đặc thù', desc: 'Giải thích, hướng dẫn NV' },
  { id: 'quy_che', name: 'Quy chế', icon: 'rule', group: 'Đặc thù', desc: 'Quy định nội bộ' },
];

export default function AISmartComposer({ apiSettings, onDocumentReady }: AISmartComposerProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<string>('cong_van');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [inputs, setInputs] = useState<SmartComposeInput>({
    loai_van_ban: 'cong_van',
    mo_ta: '',
    can_cu_phap_ly: '',
    tai_lieu_tham_khao: '',
  });

  const handleNextStep = () => {
    setInputs(prev => ({ ...prev, loai_van_ban: selectedType }));
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = async () => {
    if (!inputs.mo_ta.trim()) {
      setError('Vui lòng nhập mô tả nội dung văn bản.');
      return;
    }
    
    setError(null);
    setIsGenerating(true);

    try {
      // Use config from settings
      const finalInputs: SmartComposeInput = {
        ...inputs,
        co_quan_chu_quan: apiSettings.co_quan_chu_quan,
        co_quan_ban_hanh: apiSettings.co_quan_ban_hanh,
        dia_danh: apiSettings.dia_danh,
        nguoi_ky: apiSettings.nguoi_ky,
        chuc_vu_ky: apiSettings.chuc_vu_ky,
        quyen_han_ky: apiSettings.quyen_han_ky,
      };

      const doc = await generateFullDocumentWithAI(
        finalInputs, 
        apiSettings.apiProvider === 'gemini' ? apiSettings.geminiKey : apiSettings.openaiKey,
        apiSettings.apiProvider
      );
      
      onDocumentReady(doc);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra khi tạo văn bản.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto composer-dark rounded-3xl p-8 shadow-2xl border border-slate-700 min-h-[800px] flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

      {/* Header & Steps Indicator */}
      <div className="flex flex-col items-center mb-12 relative z-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-8">
          AI Soạn Thảo Văn Bản Chuẩn NĐ30
        </h1>
        
        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? 'active' : 'inactive'} ${step > 1 ? 'completed' : ''}`}>
            {step > 1 ? <span className="material-icons-round text-lg">check</span> : '1'}
          </div>
          <div className={`step-line ${step > 1 ? 'completed' : ''}`}></div>
          <div className={`step-dot ${step >= 2 ? 'active' : 'inactive'}`}>
            2
          </div>
          <div className={`step-line ${isGenerating ? 'completed' : ''}`}></div>
          <div className={`step-dot ${isGenerating ? 'active pulse-ring' : 'inactive'}`}>
            <span className="material-icons-round text-lg">auto_awesome</span>
          </div>
        </div>
        
        <div className="flex w-[320px] justify-between mt-3 text-sm font-medium text-slate-400">
          <span className={step >= 1 ? 'text-indigo-300' : ''}>Chọn loại VB</span>
          <span className={step >= 2 ? 'text-indigo-300' : ''}>Nhập yêu cầu</span>
          <span className={isGenerating ? 'text-indigo-300' : ''}>AI xử lý</span>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3 animate-slide-up relative z-10">
          <span className="material-icons-round">error_outline</span>
          <p>{error}</p>
        </div>
      )}

      {/* STEP 1: CHOOSE DOCUMENT TYPE */}
      {step === 1 && (
        <div className="flex-1 animate-slide-up relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">Bạn muốn soạn loại văn bản nào?</h2>
            <p className="text-slate-400">Chọn một trong các loại văn bản hành chính phổ biến dưới đây</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {DOCUMENT_TYPES.map(type => (
              <div 
                key={type.id}
                className={`doc-type-card ${selectedType === type.id ? 'selected' : ''}`}
                onClick={() => setSelectedType(type.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedType === type.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-indigo-400'}`}>
                    <span className="material-icons-round text-2xl">{type.icon}</span>
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${selectedType === type.id ? 'text-white' : 'text-slate-200'}`}>{type.name}</h3>
                    <p className="text-sm text-slate-400 mt-1 line-clamp-2">{type.desc}</p>
                  </div>
                </div>
                {selectedType === type.id && (
                  <div className="absolute top-3 right-3 text-indigo-400">
                    <span className="material-icons-round">check_circle</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <button 
              onClick={handleNextStep}
              className="shimmer-btn flex items-center gap-2"
            >
              Tiếp tục <span className="material-icons-round">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ENTER REQUIREMENTS */}
      {step === 2 && !isGenerating && (
        <div className="flex-1 animate-slide-in-right relative z-10 flex flex-col lg:flex-row gap-8">
          {/* Main Input Area */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setStep(1)}
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 text-slate-300 transition-colors"
                title="Quay lại"
              >
                <span className="material-icons-round">arrow_back</span>
              </button>
              <h2 className="text-xl font-semibold text-white">
                Mô tả nội dung <span className="text-indigo-400">{TEN_LOAI_VB[selectedType] || selectedType}</span>
              </h2>
            </div>

            <div className="glass-panel p-6 flex flex-col gap-5 flex-1">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <span className="material-icons-round text-indigo-400 text-sm">edit_note</span>
                  Nội dung chi tiết bạn muốn truyền đạt
                  <span className="text-red-400">*</span>
                </label>
                <textarea 
                  className="w-full h-40 resize-none"
                  placeholder="Ví dụ: Lên kế hoạch tổ chức tiêm chủng cho trẻ em. Thời gian từ ngày 15/7 đến 20/7. Yêu cầu Trạm y tế chuẩn bị vaccine..."
                  value={inputs.mo_ta}
                  onChange={e => setInputs({...inputs, mo_ta: e.target.value})}
                  autoFocus
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <span className="material-icons-round text-emerald-400 text-sm">gavel</span>
                  Căn cứ pháp lý (Tùy chọn)
                </label>
                <textarea 
                  className="w-full h-24 resize-none"
                  placeholder="Ví dụ:&#10;Luật Tổ chức chính quyền địa phương năm 2015;&#10;Quyết định số 123/QĐ-UBND ngày 01/01/2026..."
                  value={inputs.can_cu_phap_ly}
                  onChange={e => setInputs({...inputs, can_cu_phap_ly: e.target.value})}
                ></textarea>
                <p className="text-xs text-slate-500 mt-2 italic">Mỗi căn cứ một dòng. AI sẽ tự động định dạng nghiêng chuẩn NĐ30.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <span className="material-icons-round text-amber-400 text-sm">attach_file</span>
                  Tài liệu tham khảo / Dữ liệu nguồn (Tùy chọn)
                </label>
                <textarea 
                  className="w-full h-24 resize-none"
                  placeholder="Dán các số liệu báo cáo, danh sách đại biểu, hoặc nội dung từ văn bản cũ để AI trích xuất và đưa vào văn bản mới..."
                  value={inputs.tai_lieu_tham_khao}
                  onChange={e => setInputs({...inputs, tai_lieu_tham_khao: e.target.value})}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-slate-400">
                AI sẽ tự động áp dụng thông tin cơ quan, người ký từ <span className="text-indigo-400 font-medium">Cài đặt hệ thống</span>.
              </p>
              <button 
                onClick={handleGenerate}
                disabled={!inputs.mo_ta.trim()}
                className="shimmer-btn flex items-center gap-2 px-8"
              >
                <span className="material-icons-round">auto_awesome</span> 
                Tạo Văn Bản
              </button>
            </div>
          </div>

          {/* Right Panel - Tips */}
          <div className="w-full lg:w-80 flex flex-col gap-4">
            <div className="glass-panel p-5">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-icons-round text-amber-400">lightbulb</span> Mẹo viết prompt
              </h3>
              
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="material-icons-round text-indigo-400 text-sm mt-0.5">check_circle</span>
                  <span>Cung cấp rõ <strong>thời gian, địa điểm</strong> và <strong>người phụ trách</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-icons-round text-indigo-400 text-sm mt-0.5">check_circle</span>
                  <span>Nếu thiếu thông tin, AI sẽ tự động đánh dấu <code>[Chờ bổ sung]</code> để bạn dễ dàng điền sau.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-icons-round text-indigo-400 text-sm mt-0.5">check_circle</span>
                  <span>Không cần quan tâm căn lề, in đậm hay dấu chấm phẩy, AI sẽ tự lo định dạng chuẩn NĐ30.</span>
                </li>
              </ul>
            </div>

            <div className="glass-panel p-5 bg-indigo-500/10 border-indigo-500/20">
              <h3 className="font-bold text-white mb-3 text-sm">Gợi ý cho {TEN_LOAI_VB[selectedType] || 'loại văn bản này'}:</h3>
              <p className="text-sm text-indigo-200 italic">
                {selectedType === 'quyet_dinh' && '"Thành lập Ban chỉ đạo phòng chống lụt bão gồm Chủ tịch xã làm Trưởng ban, Trưởng công an xã làm phó ban..."'}
                {selectedType === 'cong_van' && '"Gửi các thôn bản yêu cầu tổng vệ sinh đường làng ngõ xóm trước ngày 15/8. Giao Đoàn thanh niên phối hợp thực hiện..."'}
                {selectedType === 'bao_cao' && '"Báo cáo kết quả thu ngân sách quý 3. Tổng thu 1.5 tỷ đồng, đạt 85% kế hoạch. Tồn tại: thu phí rác thải còn chậm..."'}
                {selectedType === 'to_trinh' && '"Xin kinh phí sửa chữa hội trường xã. Ngân sách dự kiến 50 triệu đồng từ nguồn vốn tự có. Tình trạng: mái dột, tường nứt..."'}
                {!['quyet_dinh', 'cong_van', 'bao_cao', 'to_trinh'].includes(selectedType) && '"Mô tả ngắn gọn mục đích, nội dung chính và phân công tổ chức thực hiện..."'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: GENERATING (LOADING) */}
      {isGenerating && (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 animate-slide-up">
          <div className="w-24 h-24 mb-8 relative flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
            <span className="material-icons-round text-4xl text-indigo-400 float-glow">auto_awesome</span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3 typewriter-text">Đang phân tích & soạn thảo...</h2>
          
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <p className="flex items-center gap-2">
              <span className="material-icons-round text-sm text-emerald-400">check</span> Áp dụng quy tắc thể thức NĐ30
            </p>
            <p className="flex items-center gap-2">
              <span className="material-icons-round text-sm text-emerald-400">check</span> Xác định quyền hạn ký & nơi nhận
            </p>
            <p className="flex items-center gap-2 loading-dots">
              Đang hoàn thiện nội dung <span></span><span></span><span></span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
