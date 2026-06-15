'use client';

import React, { useState } from 'react';
import { PROMPTS, PromptTemplate } from '@/lib/promptTemplates';

export interface PromptLibraryProps {
  onSelectPrompt: (sampleInput: PromptTemplate['sample_user_input']) => void;
}

export default function PromptLibrary({ onSelectPrompt }: PromptLibraryProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredPrompts = PROMPTS.filter(p => 
    p.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyPrompt = (p: PromptTemplate) => {
    const text = `Hành động như một chuyên viên ${p.department}. Quy tắc: ${p.system_instructions}`;
    navigator.clipboard.writeText(text);
    alert('Đã sao chép prompt hệ thống!');
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2.5 text-blue-600">
          <span className="material-icons-round text-2xl">bookmarks</span>
          <h2 className="text-lg font-bold">Thư viện Prompt chuyên ngành cấp xã</h2>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Tìm theo ban ngành..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <p className="text-slate-500 text-xs leading-relaxed -mt-4">
        Bộ cẩm nang Prompt mẫu định hướng ngữ cảnh thông minh cho mô hình ngôn ngữ lớn (LLM). Giúp sinh văn bản chính xác nhất theo vai trò của từng bộ phận.
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPrompts.map(p => (
          <div key={p.id} className="border border-slate-200/60 hover:border-slate-300 rounded-2xl p-5 bg-slate-50/50 hover:bg-white transition-all flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                {p.department}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">{p.title}</span>
            </div>

            <p className="text-slate-600 text-xs font-semibold">{p.description}</p>
            
            <div className="bg-slate-100/50 border border-slate-200/40 rounded-xl p-3 text-[11px] text-slate-500 leading-relaxed font-mono select-all">
              {p.system_instructions}
            </div>

            <div className="flex gap-2.5 mt-auto pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleCopyPrompt(p)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all"
              >
                <span className="material-icons-round text-sm">content_copy</span>
                <span>Copy prompt</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectPrompt(p.sample_user_input)}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
              >
                <span className="material-icons-round text-sm">auto_awesome</span>
                <span>Dùng thử mẫu</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
