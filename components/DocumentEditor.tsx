'use client';

import React, { useState } from 'react';
import { DocTemplate, TEMPLATES } from '@/lib/templateData';
import { generateDocumentWithAI, ApiSettings } from '@/lib/ai';
import { exportToDocx } from '@/lib/docxExporter';

// ====== HELPERS FOR DECREE 30 FORMATTING ======
function formatDocDate(dateStr?: string): string {
  if (!dateStr) {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    return `ngày ${dd} tháng ${mm} năm ${yyyy}`;
  }
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const yyyy = parts[0];
    const mm = parts[1];
    const dd = parts[2];
    return `ngày ${dd} tháng ${mm} năm ${yyyy}`;
  }
  return dateStr;
}

function formatCanCu(cc: string, isLast: boolean): string {
  let text = cc.trim();
  text = text.replace(/[;\.]$/, '');
  if (!/^căn cứ/i.test(text)) {
    text = 'Căn cứ ' + text;
  }
  return text + (isLast ? '.' : ';');
}

function formatNoiNhanList(list: string[]): string[] {
  const nnList = list && list.length > 0 ? list : ['- Như trên', '- Lưu: VT'];
  return nnList.map((nn, idx) => {
    let text = nn.trim();
    if (!text.startsWith('-')) text = '- ' + text;
    text = text.replace(/[;\.]$/, '');
    if (idx === nnList.length - 1) {
      return text + '.';
    } else {
      return text + ';';
    }
  });
}

export interface DocumentEditorProps {
  data: DocTemplate;
  setData: React.Dispatch<React.SetStateAction<DocTemplate>>;
  apiSettings: ApiSettings;
}

export default function DocumentEditor({ data, setData, apiSettings }: DocumentEditorProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'ai'>('editor');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(0.65); // Zoom control for screen sizes
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'danger' | 'info' | null }>({ message: '', type: null });

  // AI Prompt Inputs State
  const [aiPromptInputs, setAiPromptInputs] = useState({
    chu_de: '',
    muc_dich: '',
    doi_tuong: '',
    can_cu: '',
    yeu_cau: '',
    tai_lieu_tham_khao: '' // Added support for source reference data
  });

  // Local state to track inputs to prevent cursor jump during contenteditable sync
  const [localNoiDung, setLocalNoiDung] = useState(data.noi_dung);
  const [localTrichYeu, setLocalTrichYeu] = useState(data.trich_yeu);
  const [localCqBanHanh, setLocalCqBanHanh] = useState(data.co_quan_ban_hanh);
  const [localNguoiKy, setLocalNguoiKy] = useState(data.nguoi_ky);

  const [prevData, setPrevData] = useState(data);
  if (data.noi_dung !== prevData.noi_dung ||
      data.trich_yeu !== prevData.trich_yeu ||
      data.co_quan_ban_hanh !== prevData.co_quan_ban_hanh ||
      data.nguoi_ky !== prevData.nguoi_ky) {
    setPrevData(data);
    setLocalNoiDung(data.noi_dung);
    setLocalTrichYeu(data.trich_yeu);
    setLocalCqBanHanh(data.co_quan_ban_hanh);
    setLocalNguoiKy(data.nguoi_ky);
  }


  // Show Toast Helper
  const showToast = (msg: string, type: 'success' | 'danger' | 'info') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast({ message: '', type: null }), 3000);
  };

  // Sync Form to State
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle Dynamic List Changes
  const handleListChange = (field: 'kinh_gui' | 'can_cu' | 'cac_dieu' | 'noi_nhan', index: number, value: string) => {
    setData(prev => {
      const newList = [...(prev[field] || [])];
      newList[index] = value;
      return { ...prev, [field]: newList };
    });
  };

  const addListItem = (field: 'kinh_gui' | 'can_cu' | 'cac_dieu' | 'noi_nhan', placeholderValue = '') => {
    setData(prev => {
      const newList = [...(prev[field] || []), placeholderValue];
      return { ...prev, [field]: newList };
    });
  };

  const removeListItem = (field: 'kinh_gui' | 'can_cu' | 'cac_dieu' | 'noi_nhan', index: number) => {
    setData(prev => {
      const newList = (prev[field] || []).filter((_, idx) => idx !== index);
      return { ...prev, [field]: newList };
    });
  };

  // Run AI Generation
  const handleAIGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPromptInputs.chu_de) {
      showToast('Vui lòng nhập chủ đề văn bản.', 'danger');
      return;
    }

    setAiLoading(true);
    showToast('AI đang phân tích và soạn thảo văn bản...', 'info');

    try {
      const aiResult = await generateDocumentWithAI(
        {
          loai_van_ban: data.id,
          chu_de: aiPromptInputs.chu_de,
          muc_dich: aiPromptInputs.muc_dich,
          doi_tuong: aiPromptInputs.doi_tuong,
          can_cu: aiPromptInputs.can_cu,
          yeu_cau: aiPromptInputs.yeu_cau,
          tai_lieu_tham_khao: aiPromptInputs.tai_lieu_tham_khao,
          co_quan_ban_hanh: data.co_quan_ban_hanh,
          dia_danh: data.dia_danh
        },
        apiSettings.geminiKey || apiSettings.openaiKey || undefined,
        apiSettings.apiProvider
      );

      // Populate editor with AI result
      setData(prev => ({
        ...prev,
        trich_yeu: (data.id === 'cong_van' ? 'V/v ' : 'Về việc ') + aiPromptInputs.chu_de,
        can_cu: aiPromptInputs.can_cu ? [aiPromptInputs.can_cu] : prev.can_cu,
        noi_dung: aiResult,
        cac_dieu: prev.cac_dieu && prev.cac_dieu.length > 0 ? prev.cac_dieu : []
      }));

      showToast('Đã soạn thảo văn bản thành công bằng AI!', 'success');
      setActiveTab('editor'); // Switch back to editor
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      showToast(errMsg || 'Lỗi khi gọi AI.', 'danger');
    } finally {
      setAiLoading(false);
    }
  };

  // Trigger Word Export
  const handleExportWord = async () => {
    try {
      showToast('Đang tạo file Word...', 'info');
      const blob = await exportToDocx(data);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.id}_${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      showToast('Đã tải xuống file Word thành công!', 'success');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      showToast('Lỗi khi xuất Word: ' + errMsg, 'danger');
    }
  };

  // Copy document text
  const handleCopyText = () => {
    let copyString = `${data.co_quan_ban_hanh}\nSố: ${data.so_ky_hieu}\n\n${data.name.toUpperCase()}\n${data.trich_yeu}\n\n`;
    if (data.kinh_gui && data.kinh_gui.length > 0) {
      copyString += `Kính gửi: ${data.kinh_gui.join('\n         ')}\n\n`;
    }
    if (data.can_cu && data.can_cu.length > 0) {
      copyString += data.can_cu.map(cc => `Căn cứ ${cc}`).join('\n') + '\n\n';
    }
    copyString += `${data.noi_dung}\n\n`;
    if (data.cac_dieu && data.cac_dieu.length > 0) {
      copyString += data.cac_dieu.map((d, i) => `Điều ${i+1}. ${d}`).join('\n') + '\n\n';
    }
    copyString += `Nơi nhận:\n${data.noi_nhan.join('\n')}\n\n${data.quyen_han_ky ? data.quyen_han_ky + '\n' : ''}${data.chuc_vu_ky}\n${data.nguoi_ky}`;

    navigator.clipboard.writeText(copyString);
    showToast('Đã sao chép văn bản vào bộ nhớ tạm!', 'success');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative items-start">
      {/* Toast Notification */}
      {toast.type && (
        <div className={`fixed bottom-8 right-8 z-50 px-5 py-3.5 rounded-xl shadow-lg backdrop-blur-md flex items-center gap-2.5 text-sm font-semibold border transition-all animate-bounce ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 
          toast.type === 'danger' ? 'bg-red-50 text-red-800 border-red-200' : 
          'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          <span className="material-icons-round">
            {toast.type === 'success' ? 'check_circle' : toast.type === 'danger' ? 'error' : 'info'}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* LEFT FORM/EDITOR COLUMN (7 Cols) */}
      <div className="xl:col-span-6 flex flex-col gap-6">
        {/* Document Type Selector */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="material-icons-round text-blue-500">description</span>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chọn loại văn bản cần soạn thảo</label>
          </div>
          <select
            value={data.id}
            onChange={(e) => {
              const selectedTemplate = TEMPLATES.find(t => t.id === e.target.value);
              if (selectedTemplate) {
                setData({
                  ...selectedTemplate,
                  co_quan_chu_quan: apiSettings.co_quan_chu_quan || selectedTemplate.co_quan_chu_quan,
                  co_quan_ban_hanh: apiSettings.co_quan_ban_hanh || selectedTemplate.co_quan_ban_hanh,
                  dia_danh: apiSettings.dia_danh || selectedTemplate.dia_danh,
                  nguoi_ky: apiSettings.nguoi_ky || selectedTemplate.nguoi_ky,
                  chuc_vu_ky: apiSettings.chuc_vu_ky || selectedTemplate.chuc_vu_ky,
                  quyen_han_ky: apiSettings.quyen_han_ky || selectedTemplate.quyen_han_ky,
                });
                showToast(`Đã chuyển sang mẫu: ${selectedTemplate.name}`, 'info');
              }
            }}
            className="px-3.5 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white font-semibold text-slate-700"
          >
            {TEMPLATES.map(t => (
              <option key={t.id} value={t.id}>{t.name} (mẫu {t.code})</option>
            ))}
          </select>
        </div>

        {/* Toggle Mode */}
        <div className="bg-slate-200/60 p-1.5 rounded-2xl flex gap-1 border border-slate-300/40">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'editor' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-icons-round text-lg">edit</span>
            <span>Soạn Thảo & Điền Form</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'ai' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-icons-round text-lg">auto_awesome</span>
            <span>Soạn Thảo Bằng AI</span>
          </button>
        </div>

        {/* EDITOR CARD */}
        {activeTab === 'editor' ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm p-6 flex flex-col gap-6">
            {/* Header info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cơ quan ban hành</label>
                <input
                  type="text"
                  id="co_quan_ban_hanh"
                  value={data.co_quan_ban_hanh}
                  onChange={handleChange}
                  className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cơ quan chủ quản</label>
                <input
                  type="text"
                  id="co_quan_chu_quan"
                  value={data.co_quan_chu_quan || ''}
                  onChange={handleChange}
                  className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Số, ký hiệu</label>
                <input
                  type="text"
                  id="so_ky_hieu"
                  value={data.so_ky_hieu}
                  onChange={handleChange}
                  className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Địa danh</label>
                <input
                  type="text"
                  id="dia_danh"
                  value={data.dia_danh}
                  onChange={handleChange}
                  className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngày tháng ban hành</label>
                <input
                  type="date"
                  id="ngay_ban_hanh"
                  value={data.ngay_ban_hanh || ''}
                  onChange={handleChange}
                  className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Trích yếu */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Trích yếu nội dung</label>
              <input
                type="text"
                id="trich_yeu"
                value={data.trich_yeu}
                onChange={handleChange}
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-semibold"
              />
            </div>

            {/* Kính gửi (Công văn / Tờ trình) */}
            {(data.id === 'cong_van' || data.id === 'to_trinh') && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kính gửi</label>
                  <button 
                    type="button" 
                    onClick={() => addListItem('kinh_gui', '')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    <span className="material-icons-round text-sm">add</span> Thêm kính gửi
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {(data.kinh_gui || []).map((kg, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={kg}
                        onChange={(e) => handleListChange('kinh_gui', idx, e.target.value)}
                        placeholder="VD: Trưởng các thôn bản..."
                        className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                      />
                      <button 
                        type="button"
                        onClick={() => removeListItem('kinh_gui', idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <span className="material-icons-round text-lg">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Căn cứ (Quyết định / Nghị quyết) */}
            {(data.id === 'quyet_dinh' || data.id === 'nghi_quyet') && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Căn cứ pháp lý</label>
                  <button 
                    type="button" 
                    onClick={() => addListItem('can_cu', '')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    <span className="material-icons-round text-sm">add</span> Thêm căn cứ
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {(data.can_cu || []).map((cc, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={cc}
                        onChange={(e) => handleListChange('can_cu', idx, e.target.value)}
                        placeholder="VD: Luật tổ chức chính quyền địa phương ngày..."
                        className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                      />
                      <button 
                        type="button"
                        onClick={() => removeListItem('can_cu', idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <span className="material-icons-round text-lg">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nội dung chính */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nội dung văn bản</label>
              <textarea
                id="noi_dung"
                value={data.noi_dung}
                onChange={handleChange}
                rows={9}
                placeholder="Nhập nội dung văn bản. Xuống dòng tự động sinh đoạn mới..."
                className="px-3.5 py-3.5 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 leading-relaxed"
              />
            </div>

            {/* Các Điều khoản (Quyết định / Nghị quyết) */}
            {(data.id === 'quyet_dinh' || data.id === 'nghi_quyet') && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Các Điều khoản</label>
                  <button 
                    type="button" 
                    onClick={() => addListItem('cac_dieu', '')}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    <span className="material-icons-round text-sm">add</span> Thêm Điều
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {(data.cac_dieu || []).map((dieu, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <span className="text-sm font-bold mt-2.5 text-slate-500">Điều {idx+1}.</span>
                      <textarea
                        value={dieu}
                        onChange={(e) => handleListChange('cac_dieu', idx, e.target.value)}
                        placeholder={`Nội dung Điều ${idx+1}...`}
                        rows={2}
                        className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                      />
                      <button 
                        type="button"
                        onClick={() => removeListItem('cac_dieu', idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-1"
                      >
                        <span className="material-icons-round text-lg">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chữ ký & Người ký */}
            {data.id !== 'bien_ban' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quyền hạn ký (TM./KT./TL.)</label>
                  <input
                    type="text"
                    id="quyen_han_ky"
                    value={data.quyen_han_ky || ''}
                    onChange={handleChange}
                    placeholder="VD: TM. ỦY BAN NHÂN DÂN"
                    className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ký thay chức danh (nếu có)</label>
                  <input
                    type="text"
                    id="kt_chuc_vu"
                    value={data.kt_chuc_vu || ''}
                    onChange={handleChange}
                    placeholder="VD: KT. CHỦ TỊCH"
                    className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chức danh người ký</label>
                  <input
                    type="text"
                    id="chuc_vu_ky"
                    value={data.chuc_vu_ky}
                    onChange={handleChange}
                    className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Họ tên người ký</label>
                  <input
                    type="text"
                    id="nguoi_ky"
                    value={data.nguoi_ky}
                    onChange={handleChange}
                    className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Nơi nhận */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nơi nhận</label>
                <button 
                  type="button" 
                  onClick={() => addListItem('noi_nhan', '')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <span className="material-icons-round text-sm">add</span> Thêm nơi nhận
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {(data.noi_nhan || []).map((nn, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={nn}
                      onChange={(e) => handleListChange('noi_nhan', idx, e.target.value)}
                      placeholder="VD: - Như trên;"
                      className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                    />
                    <button 
                      type="button"
                      onClick={() => removeListItem('noi_nhan', idx)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <span className="material-icons-round text-lg">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-4 justify-between">
              <button
                type="button"
                onClick={handleCopyText}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 font-semibold text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all"
              >
                <span className="material-icons-round text-lg">content_copy</span>
                <span>Sao chép</span>
              </button>
              
              <button
                type="button"
                onClick={handleExportWord}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-md shadow-blue-500/15 hover:shadow-blue-500/25 transition-all"
              >
                <span className="material-icons-round text-lg">save_alt</span>
                <span>Tải File Word (.docx)</span>
              </button>
            </div>
          </div>
        ) : (
          /* AI PROMPT FORM CARD */
          <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-blue-600">
              <span className="material-icons-round">auto_awesome</span>
              <h3 className="font-bold text-lg">Soạn thảo văn bản nhanh bằng AI</h3>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed -mt-3">
              Điền các thông tin gợi ý bên dưới, Trí tuệ nhân tạo sẽ tự động liên kết dữ liệu và tạo văn bản chuẩn phong cách hành chính.
            </p>

            <form onSubmit={handleAIGenerate} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chủ đề văn bản (V/v...)</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Chỉ đạo dọn dẹp vệ sinh môi trường phòng chống sốt xuất huyết"
                  value={aiPromptInputs.chu_de}
                  onChange={(e) => setAiPromptInputs(prev => ({ ...prev, chu_de: e.target.value }))}
                  className="px-3.5 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mục đích ban hành</label>
                <input
                  type="text"
                  placeholder="VD: Ngăn chặn ổ bệnh phát sinh, nâng cao ý thức giữ gìn vệ sinh của người dân"
                  value={aiPromptInputs.muc_dich}
                  onChange={(e) => setAiPromptInputs(prev => ({ ...prev, muc_dich: e.target.value }))}
                  className="px-3.5 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đối tượng thực hiện</label>
                <input
                  type="text"
                  placeholder="VD: Ban chỉ sự các thôn bản và Trạm y tế xã chủ trì phối hợp"
                  value={aiPromptInputs.doi_tuong}
                  onChange={(e) => setAiPromptInputs(prev => ({ ...prev, doi_tuong: e.target.value }))}
                  className="px-3.5 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Căn cứ pháp lý (nếu có)</label>
                <input
                  type="text"
                  placeholder="VD: Luật Bảo vệ môi trường 2020; Kế hoạch 78/KH-UBND của tỉnh"
                  value={aiPromptInputs.can_cu}
                  onChange={(e) => setAiPromptInputs(prev => ({ ...prev, can_cu: e.target.value }))}
                  className="px-3.5 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Yêu cầu/Chỉ thị cụ thể</label>
                <textarea
                  placeholder="VD: Tổ chức dọn vệ sinh vào sáng Chủ nhật hàng tuần. Trạm y tế phun thuốc diệt muỗi định kỳ."
                  rows={3}
                  value={aiPromptInputs.yeu_cau}
                  onChange={(e) => setAiPromptInputs(prev => ({ ...prev, yeu_cau: e.target.value }))}
                  className="px-3.5 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tài liệu tham khảo / Số liệu nguồn (Nếu có)</label>
                <textarea
                  placeholder="VD: Dán báo cáo dự thảo, ghi chép cuộc họp hoặc số liệu nguồn tại đây để AI đọc, phân tích và trích xuất đúng thông tin số liệu..."
                  rows={4}
                  value={aiPromptInputs.tai_lieu_tham_khao}
                  onChange={(e) => setAiPromptInputs(prev => ({ ...prev, tai_lieu_tham_khao: e.target.value }))}
                  className="px-3.5 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={aiLoading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all mt-3 disabled:opacity-50 disabled:pointer-events-none"
              >
                <span className={`material-icons-round text-xl ${aiLoading ? 'animate-spin' : ''}`}>
                  {aiLoading ? 'autorenew' : 'auto_awesome'}
                </span>
                <span>{aiLoading ? 'Đang tạo văn bản...' : 'Tạo văn bản bằng AI'}</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* RIGHT LIVE PREVIEW A4 SHEET (5 Cols) */}
      <div className="xl:col-span-6 sticky top-24 flex flex-col gap-4">
        {/* Helper title */}
        <div className="flex justify-between items-center px-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-icons-round text-base text-blue-500">visibility</span>
            <span>Bản Xem Trước A4 Thể Thức (Live)</span>
          </span>
          <span className="text-[10px] text-slate-400 italic">Click trực tiếp vào giấy để chỉnh sửa nhanh</span>
        </div>

        {/* Zoom Controls & Wrapper */}
        <div className="flex flex-col items-center w-full">
          <div className="flex gap-1.5 mb-3.5 bg-slate-200/80 p-1 rounded-xl text-[11px] font-bold text-slate-600 border border-slate-300/40 shadow-sm self-end">
            <button 
              type="button"
              onClick={() => setZoom(0.5)} 
              className={`px-2.5 py-1 rounded-lg transition-all ${zoom === 0.5 ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-950'}`}
            >
              50%
            </button>
            <button 
              type="button"
              onClick={() => setZoom(0.65)} 
              className={`px-2.5 py-1 rounded-lg transition-all ${zoom === 0.65 ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-950'}`}
            >
              65% (Vừa vặn)
            </button>
            <button 
              type="button"
              onClick={() => setZoom(0.85)} 
              className={`px-2.5 py-1 rounded-lg transition-all ${zoom === 0.85 ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-950'}`}
            >
              85%
            </button>
            <button 
              type="button"
              onClick={() => setZoom(1.0)} 
              className={`px-2.5 py-1 rounded-lg transition-all ${zoom === 1.0 ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-950'}`}
            >
              100% (Thực tế)
            </button>
          </div>

          <div className="w-full bg-slate-950/85 border border-slate-800 rounded-3xl p-5 shadow-inner flex justify-center overflow-auto max-h-[720px]">
            <div 
              style={{ zoom: zoom }}
              className="origin-top transition-transform duration-150"
            >
              {/* Simulated A4 Page */}
              <div className="preview-a4-page select-text" id="a4-page">
                {/* Header: Cơ quan & Quốc hiệu */}
                <table className="a4-header-table">
                  <tbody>
                    <tr>
                      <td className="a4-header-left">
                        {data.co_quan_chu_quan && (
                          <div className="a4-upper text-[11pt] leading-tight tracking-wide">{data.co_quan_chu_quan}</div>
                        )}
                        <div className="relative inline-block pb-1.5 leading-snug">
                          <div 
                            className="a4-upper a4-bold text-[12pt] outline-none"
                            contentEditable="true"
                            suppressContentEditableWarning
                            onBlur={(e) => setLocalCqBanHanh(e.target.textContent || '')}
                            onInput={(e) => setData(prev => ({ ...prev, co_quan_ban_hanh: e.currentTarget.textContent || '' }))}
                          >
                            {localCqBanHanh || 'CƠ QUAN BAN HÀNH'}
                          </div>
                          <span className="absolute bottom-0 left-[25%] right-[25%] h-[1px] bg-black"></span>
                        </div>
                        <div className="a4-so-ky-hieu font-normal">{data.so_ky_hieu}</div>
                        {data.id === 'cong_van' && (
                          <div className="a4-trich-yeu font-normal text-[12pt] mt-1.5 text-center leading-tight">
                            {data.trich_yeu}
                          </div>
                        )}
                      </td>
                      <td className="a4-header-right">
                        <div className="a4-upper a4-bold text-[12pt] leading-tight">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                        <div className="relative inline-block pb-1.5 leading-snug">
                          <div className="a4-bold text-[13pt]">Độc lập - Tự do - Hạnh phúc</div>
                          <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-black"></span>
                        </div>
                        <div className="a4-italic text-[13pt] mt-1.5">
                          {data.dia_danh}, {formatDocDate(data.ngay_ban_hanh)}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Document Title (Named type only) */}
                {data.id !== 'cong_van' && (
                  <div className="a4-title-block">
                    <div className="relative inline-block pb-1.5">
                      <div className="a4-upper a4-bold text-[14pt]">{data.name}</div>
                      <div 
                        className="a4-bold a4-italic text-[14pt] leading-snug outline-none"
                        contentEditable="true"
                        suppressContentEditableWarning
                        onBlur={(e) => setLocalTrichYeu(e.target.textContent || '')}
                        onInput={(e) => setData(prev => ({ ...prev, trich_yeu: e.currentTarget.textContent || '' }))}
                      >
                        {localTrichYeu || 'Về việc...'}
                      </div>
                      <span className="absolute bottom-0 left-[35%] right-[35%] h-[1px] bg-black"></span>
                    </div>
                  </div>
                )}

                {/* Kính gửi (Công văn / Tờ trình) */}
                {(data.id === 'cong_van' || data.id === 'to_trinh') && data.kinh_gui && data.kinh_gui.length > 0 && (
                  <div className="a4-kinh-gui-block font-normal">
                    <span>Kính gửi:</span>
                    <div className="inline-block align-top pl-1.5">
                      {data.kinh_gui.map((kg, i) => (
                        <div key={i} className="leading-relaxed">
                          {data.kinh_gui!.length > 1 ? `- ${kg || '...;'}` : (kg || '...;')}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Căn cứ (Quyết định / Nghị quyết) */}
                {(data.id === 'quyet_dinh' || data.id === 'nghi_quyet') && data.can_cu && data.can_cu.length > 0 && (
                  <div className="mb-3 text-[14pt]">
                    {data.can_cu.map((cc, i) => (
                      <div key={i} className="a4-italic text-justify leading-relaxed" style={{ textIndent: '1.27cm' }}>
                        {formatCanCu(cc, i === data.can_cu!.length - 1)}
                      </div>
                    ))}
                    {data.theo_de_nghi && (
                      <div className="a4-italic text-justify leading-relaxed mt-1" style={{ textIndent: '1.27cm' }}>
                        {data.theo_de_nghi.endsWith('.') ? data.theo_de_nghi : (data.theo_de_nghi + '.')}
                      </div>
                    )}
                    <div className="a4-bold a4-upper text-center my-4 text-[14pt] tracking-wide">
                      {data.dong_quyet_dinh || 'QUYẾT ĐỊNH:'}
                    </div>
                  </div>
                )}

                <div
                  className="a4-noi-dung-block outline-none text-[14pt]"
                  contentEditable="true"
                  suppressContentEditableWarning
                  onBlur={(e) => setLocalNoiDung(e.target.innerText)}
                  onInput={(e) => setData(prev => ({ ...prev, noi_dung: e.currentTarget.innerText }))}
                >
                  {(localNoiDung || 'Nội dung chính...')
                    .replace(/\n{2,}/g, '\n') // Remove excessive empty lines
                    .split('\n')
                    .filter(p => p.trim() !== '') // Remove completely empty paragraphs
                    .map((paragraph, idx) => {
                      const isList = paragraph.trim().startsWith('-') || paragraph.trim().startsWith('+');
                      const isHeading = /^\s*(I{1,3}|IV|VI{0,3}|IX|X{0,3})[\.\)]\s+[A-ZÀ-ỹĐ]/.test(paragraph.trim());
                      return (
                        <div key={idx} style={{ 
                          textIndent: (isList || isHeading) ? '0' : '1.27cm', 
                          paddingLeft: isList ? '1.27cm' : '0',
                          textAlign: isHeading ? 'center' as const : 'justify' as const, 
                          marginBottom: '6pt',
                          fontWeight: isHeading ? 'bold' : 'normal',
                        }}>
                          {paragraph}
                        </div>
                      );
                  })}
                </div>

                {/* Các Điều khoản (Quyết định / Nghị quyết) */}
                {(data.id === 'quyet_dinh' || data.id === 'nghi_quyet') && data.cac_dieu && data.cac_dieu.length > 0 && (
                  <div className="a4-cac-dieu-block mt-3">
                    {data.cac_dieu.map((dieu, i) => (
                      <div key={i} className="text-justify text-[14pt] leading-relaxed mb-2" style={{ textIndent: '1.27cm' }}>
                        <span className="a4-bold">Điều {i+1}. </span>
                        <span>{dieu}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Chữ ký & Nơi nhận */}
                <table className="a4-footer-table">
                  <tbody>
                    <tr>
                      <td className="a4-footer-left">
                        <div className="a4-noi-nhan-title a4-bold a4-italic">Nơi nhận:</div>
                        <div className="a4-noi-nhan-list">
                          {formatNoiNhanList(data.noi_nhan).map((nn, i) => (
                            <div key={i}>{nn}</div>
                          ))}
                        </div>
                      </td>
                      <td className="a4-footer-right">
                        {data.id === 'bien_ban' ? (
                          /* Chữ ký đôi cho biên bản */
                          <table className="a4-double-sig">
                            <tbody>
                              <tr>
                                <td>
                                  <div className="a4-bold text-[12pt] uppercase">{data.chuc_vu_ky || 'THƯ KÝ'}</div>
                                  <div className="a4-sig-space"></div>
                                  <div className="a4-bold text-[13pt]">{data.nguoi_ky}</div>
                                </td>
                                <td>
                                  <div className="a4-bold text-[12pt] uppercase">CHỦ TRÌ</div>
                                  <div className="a4-sig-space"></div>
                                  <div className="a4-bold text-[13pt]">{data.dong_quyet_dinh || 'Đỗ Chí Thanh'}</div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        ) : (
                          /* Chữ ký đơn văn bản thông thường */
                          <div>
                            {data.quyen_han_ky && (
                              <div className="a4-bold a4-upper text-[12pt]">{data.quyen_han_ky}</div>
                            )}
                            {data.kt_chuc_vu && (
                              <div className="a4-bold a4-upper text-[12pt]">{data.kt_chuc_vu}</div>
                            )}
                            <div className={`a4-upper text-[12pt] ${
                              (data.quyen_han_ky && data.kt_chuc_vu) ? 'font-normal' : 'a4-bold'
                            }`}>
                              {data.chuc_vu_ky}
                            </div>
                            <div className="a4-sig-space"></div>
                            <div 
                              className="a4-bold text-[13pt] outline-none inline-block border-b border-transparent hover:border-blue-300"
                              contentEditable="true"
                              suppressContentEditableWarning
                              onBlur={(e) => setLocalNguoiKy(e.target.textContent || '')}
                              onInput={(e) => setData(prev => ({ ...prev, nguoi_ky: e.currentTarget.textContent || '' }))}
                            >
                              {localNguoiKy || 'Họ tên người ký'}
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
