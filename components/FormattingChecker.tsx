'use client';

import React, { useState } from 'react';
import { ApiSettings, analyzeDocumentErrorsWithAI } from '@/lib/ai';

export interface FormattingCheckerProps {
  apiSettings: ApiSettings;
}

interface AIErrorResult {
  type: 'spelling' | 'format';
  message: string;
  context: string;
  suggestion: string;
}

export default function FormattingChecker({ apiSettings }: FormattingCheckerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<AIErrorResult[] | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setErrors(null);
    setLoading(true);

    try {
      // 1. Extract text
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errObj = await res.json();
        throw new Error(errObj.error || 'Lỗi trích xuất text từ file.');
      }

      const data = await res.json();
      const extractedText = data.text;

      if (!extractedText || extractedText.trim() === '') {
        throw new Error('File không có nội dung văn bản.');
      }

      // 2. Analyze with AI
      const apiKey = apiSettings.apiProvider === 'gemini' ? apiSettings.geminiKey : apiSettings.openaiKey;
      if (!apiKey) {
        throw new Error('Cần cấu hình API Key (Gemini/OpenAI) trong phần Cài đặt.');
      }

      const aiResult = await analyzeDocumentErrorsWithAI(extractedText, apiKey, apiSettings.apiProvider);
      setErrors(aiResult);
    } catch (err: any) {
      alert(err.message || 'Có lỗi xảy ra trong quá trình kiểm tra.');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center gap-2.5 text-blue-600">
        <span className="material-icons-round text-2xl">rule</span>
        <h2 className="text-lg font-bold">Kiểm Tra Thể Thức NĐ30 Bằng AI</h2>
      </div>
      <p className="text-slate-500 text-xs leading-relaxed -mt-4">
        Tải file văn bản (.docx, .pdf, .txt) của bạn lên để Trí tuệ Nhân tạo tự động rà soát toàn bộ lỗi chính tả và các vi phạm thể thức theo Nghị định 30/2020/NĐ-CP.
      </p>

      {/* Upload Area */}
      <div 
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
        } ${loading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept=".docx,.pdf,.txt" 
          onChange={handleFileChange} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <span className="material-icons-round text-5xl text-slate-300 mb-3">cloud_upload</span>
        <p className="text-sm font-semibold text-slate-600 mb-1">Kéo thả file vào đây hoặc click để chọn file</p>
        <p className="text-xs text-slate-400">Hỗ trợ định dạng: .docx, .pdf, .txt</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-blue-600">
          <span className="material-icons-round text-4xl animate-spin">autorenew</span>
          <p className="text-sm font-bold">AI đang phân tích và tìm kiếm lỗi...</p>
        </div>
      )}

      {/* Results Area */}
      {errors !== null && !loading && (
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="material-icons-round text-emerald-500">fact_check</span>
              Kết quả phân tích
            </h3>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
              Phát hiện {errors.length} lỗi
            </span>
          </div>

          {errors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-emerald-600 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="material-icons-round text-5xl mb-2">check_circle</span>
              <p className="font-bold">Tuyệt vời!</p>
              <p className="text-sm mt-1 text-emerald-700">Văn bản của bạn không có lỗi chính tả hay thể thức nào.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {errors.map((error, idx) => (
                <div key={idx} className={`p-4 rounded-xl border flex flex-col gap-3 ${error.type === 'spelling' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`material-icons-round text-lg ${error.type === 'spelling' ? 'text-amber-500' : 'text-red-500'}`}>
                        {error.type === 'spelling' ? 'spellcheck' : 'error_outline'}
                      </span>
                      <h4 className={`font-bold text-sm ${error.type === 'spelling' ? 'text-amber-800' : 'text-red-800'}`}>
                        {error.message}
                      </h4>
                    </div>
                  </div>
                  
                  <div className="bg-white/60 p-3 rounded-lg border border-white/40 text-sm">
                    <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Trích dẫn vị trí sai:</p>
                    <p className="text-slate-800 italic">"...{error.context}..."</p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="material-icons-round text-emerald-600 text-sm">lightbulb</span>
                    <p className="text-sm font-semibold text-emerald-700">
                      Đề xuất sửa: <span className="font-bold underline decoration-emerald-300">{error.suggestion}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
