'use client';

import React, { useState } from 'react';
import { convertDocumentWithAI, ApiSettings } from '@/lib/ai';
import { DocTemplate } from '@/lib/templateData';

export interface AIConverterProps {
  apiSettings: ApiSettings;
  onGenerateDoc: (template: DocTemplate) => void;
}

export default function AIConverter({ apiSettings, onGenerateDoc }: AIConverterProps) {
  const [sourceText, setSourceText] = useState<string>('');
  const [targetType, setTargetType] = useState<string>('thong_bao');
  const [loading, setLoading] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string>('');

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceText.trim()) return;

    setLoading(true);
    setResultText('');

    try {
      const result = await convertDocumentWithAI(
        sourceText,
        targetType,
        apiSettings.geminiKey || apiSettings.openaiKey || undefined,
        apiSettings.apiProvider
      );
      setResultText(result);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      alert(errMsg || 'Lỗi khi chuyển đổi văn bản.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendToEditor = () => {
    if (!resultText) return;

    // Phân tích sơ bộ để tách trích yếu
    const lines = resultText.split('\n');
    let title = `V/v chuyển đổi tài liệu sang dạng ${targetType.toUpperCase()}`;
    const body = resultText;

    // Tìm dòng trích yếu
    const trichYeuLine = lines.find(l => l.toLowerCase().startsWith('trích yếu:') || l.toLowerCase().startsWith('v/v') || l.toLowerCase().startsWith('về việc'));
    if (trichYeuLine) {
      title = trichYeuLine.replace(/trích yếu:/i, '').trim();
    }

    const newDoc: DocTemplate = {
      id: targetType,
      name: targetType === 'thong_bao' ? 'Thông báo' : targetType === 'bien_ban' ? 'Biên bản' : targetType === 'bao_cao' ? 'Báo cáo' : targetType === 'to_trinh' ? 'Tờ trình' : 'Quyết định',
      code: targetType === 'thong_bao' ? 'TB' : targetType === 'bien_ban' ? 'BB' : targetType === 'bao_cao' ? 'BC' : targetType === 'to_trinh' ? 'TTr' : 'QĐ',
      description: 'Văn bản chuyển đổi bằng AI',
      co_quan_ban_hanh: apiSettings.co_quan_ban_hanh || 'ỦY BAN NHÂN DÂN XÃ LŨNG CÚ',
      so_ky_hieu: targetType === 'quyet_dinh' ? 'Số:      /QĐ-UBND' : targetType === 'thong_bao' ? 'Số:      /TB-UBND' : 'Số:      /UBND-VP',
      dia_danh: apiSettings.dia_danh || 'Lũng Cú',
      trich_yeu: title,
      noi_dung: body,
      noi_nhan: ['Như trên;', 'Lưu: VT.'],
      quyen_han_ky: apiSettings.quyen_han_ky || 'TM. ỦY BAN NHÂN DÂN',
      chuc_vu_ky: apiSettings.chuc_vu_ky || 'CHỦ TỊCH',
      nguoi_ky: apiSettings.nguoi_ky || 'Nguyễn Văn Chiến'
    };

    onGenerateDoc(newDoc);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center gap-2.5 text-blue-600">
        <span className="material-icons-round text-2xl">swap_horiz</span>
        <h2 className="text-lg font-bold">Chuyển đổi định dạng văn bản bằng AI</h2>
      </div>
      <p className="text-slate-500 text-xs leading-relaxed -mt-4">
        Nhập văn bản nguồn (ví dụ: Biên bản cuộc họp thô hoặc Đoạn hội thoại ghi âm) và chọn loại văn bản hành chính cần xuất ra. AI sẽ tự động định cấu trúc lại cho bạn.
      </p>

      <form onSubmit={handleConvert} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Source Text Area (Left) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Văn bản nguồn (Dữ liệu thô)</label>
            <textarea
              required
              rows={12}
              placeholder="Dán biên bản cuộc họp, nội dung hội thoại ghi âm, hoặc phác thảo ý kiến chỉ đạo tại đây..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="px-3.5 py-3.5 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 leading-relaxed font-sans"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 flex flex-col gap-1.5 w-full">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chuyển đổi thành loại văn bản</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
              >
                <option value="thong_bao">Thông báo kết luận cuộc họp</option>
                <option value="bien_ban">Biên bản (Từ ghi âm cuộc họp)</option>
                <option value="bao_cao">Báo cáo (Từ biên bản họp)</option>
                <option value="to_trinh">Tờ trình đề xuất (Từ báo cáo)</option>
                <option value="quyet_dinh">Quyết định (Từ kế hoạch)</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={loading || !sourceText}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 transition-all self-end h-[42px]"
            >
              <span className={`material-icons-round text-sm ${loading ? 'animate-spin' : ''}`}>
                {loading ? 'autorenew' : 'auto_awesome'}
              </span>
              <span>{loading ? 'Đang chuyển...' : 'Bắt đầu chuyển đổi'}</span>
            </button>
          </div>
        </div>

        {/* Result Area (Right) */}
        <div className="lg:col-span-6 flex flex-col gap-4 h-full">
          <div className="flex flex-col gap-1.5 h-full">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kết quả chuyển đổi bằng AI</label>
            <div className="flex-1 min-h-[300px] border border-slate-200 bg-slate-50 rounded-2xl p-4 text-sm font-mono whitespace-pre-wrap leading-relaxed overflow-y-auto">
              {resultText || (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 text-xs">
                  <span className="material-icons-round text-3xl">auto_awesome</span>
                  <p>Kết quả chuyển đổi AI sẽ xuất hiện tại đây.</p>
                </div>
              )}
            </div>
          </div>

          {resultText && (
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(resultText);
                  alert('Đã sao chép kết quả!');
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
              >
                <span className="material-icons-round text-sm">content_copy</span>
                <span>Sao chép</span>
              </button>
              
              <button
                type="button"
                onClick={handleSendToEditor}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
              >
                <span className="material-icons-round text-sm">edit_document</span>
                <span>Đưa vào Trình soạn thảo</span>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
