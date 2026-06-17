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
  
  // New State for PDF to Word
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [activeConverterTab, setActiveConverterTab] = useState<'text' | 'pdf'>('text');

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
      co_quan_ban_hanh: apiSettings.co_quan_ban_hanh || 'ỦY BAN NHÂN DÂN XÃ NHỮ KHÊ',
      so_ky_hieu: targetType === 'quyet_dinh' ? 'Số:      /QĐ-UBND' : targetType === 'thong_bao' ? 'Số:      /TB-UBND' : 'Số:      /UBND-VP',
      dia_danh: apiSettings.dia_danh || 'Nhữ Khê',
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
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5 text-blue-600">
          <span className="material-icons-round text-2xl">swap_horiz</span>
          <h2 className="text-lg font-bold">Trợ Lý Chuyển Đổi Định Dạng</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveConverterTab('text')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${activeConverterTab === 'text' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Chuyển Đổi Thông Minh (AI)
          </button>
          <button 
            onClick={() => setActiveConverterTab('pdf')}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${activeConverterTab === 'pdf' ? 'bg-red-50 text-red-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            PDF sang Word
          </button>
        </div>
      </div>

      {activeConverterTab === 'text' ? (
        <>
          <p className="text-slate-500 text-xs leading-relaxed -mt-2">
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
      </>
      ) : (
        /* PDF TO WORD TAB */
        <div className="flex flex-col gap-6 min-h-[400px]">
          <p className="text-slate-500 text-xs leading-relaxed -mt-2">
            Tải lên file PDF để hệ thống trích xuất nội dung và chuyển đổi sang file Word (.docx) tương ứng. Lưu ý: Tính năng tập trung phục hồi bố cục text cơ bản.
          </p>

          <div 
            className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-red-200 bg-red-50/30 rounded-2xl relative"
          >
            <input 
              type="file" 
              accept=".pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setPdfFile(file);
                setPdfLoading(true);

                try {
                  const formData = new FormData();
                  formData.append('file', file);
                  const res = await fetch('/api/extract-text', { method: 'POST', body: formData });
                  if (!res.ok) throw new Error('Lỗi khi đọc file PDF');
                  const data = await res.json();
                  
                  // Construct basic DocTemplate for export
                  const pdfDoc: DocTemplate = {
                    id: 'cong_van',
                    name: 'Văn bản chuyển đổi từ PDF',
                    code: 'PDF',
                    description: '',
                    co_quan_ban_hanh: apiSettings.co_quan_ban_hanh,
                    so_ky_hieu: 'Số:      /UBND-VP',
                    dia_danh: apiSettings.dia_danh,
                    trich_yeu: file.name,
                    noi_dung: data.text,
                    noi_nhan: [],
                    quyen_han_ky: '',
                    chuc_vu_ky: '',
                    nguoi_ky: ''
                  };
                  onGenerateDoc(pdfDoc);
                  alert('Chuyển đổi thành công! Văn bản đã được đưa vào trình soạn thảo để bạn tải về file Word.');
                } catch (err: any) {
                  alert(err.message || 'Lỗi xử lý file.');
                } finally {
                  setPdfLoading(false);
                  setPdfFile(null);
                }
              }}
            />
            <span className="material-icons-round text-5xl text-red-300 mb-3">picture_as_pdf</span>
            <p className="text-sm font-semibold text-slate-700 mb-1">
              {pdfLoading ? 'Đang phân tích PDF...' : 'Kéo thả hoặc click để chọn file PDF'}
            </p>
            {pdfLoading && <span className="material-icons-round animate-spin text-red-500 mt-2">autorenew</span>}
          </div>
        </div>
      )}
    </div>
  );
}
