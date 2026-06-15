'use client';

import React, { useState } from 'react';
import { TEMPLATES, DocTemplate } from '@/lib/templateData';

export interface TemplateLibraryProps {
  onSelectTemplate: (template: DocTemplate) => void;
}

export default function TemplateLibrary({ onSelectTemplate }: TemplateLibraryProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [previewDoc, setPreviewDoc] = useState<DocTemplate | null>(null);

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'cong_van', name: 'Công văn' },
    { id: 'quyet_dinh', name: 'Quyết định' },
    { id: 'bao_cao', name: 'Báo cáo' },
    { id: 'khac', name: 'Nhiệm vụ khác' }
  ];

  // Filter templates
  const filteredTemplates = TEMPLATES.filter(tmpl => {
    const matchesSearch = 
      tmpl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.trich_yeu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    if (activeCategory === 'khac') {
      return tmpl.id !== 'cong_van' && tmpl.id !== 'quyet_dinh' && !tmpl.id.startsWith('bao_cao');
    }
    if (activeCategory === 'bao_cao') {
      return tmpl.id.startsWith('bao_cao');
    }
    return tmpl.id === activeCategory;
  });

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Search and Filters */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <span className="material-icons-round absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            placeholder="Tìm kiếm mẫu văn bản..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeCategory === cat.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(tmpl => (
          <div key={tmpl.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-100/50 hover:border-slate-200 flex flex-col gap-4 transition-all">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                {tmpl.code}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 border border-slate-200/30 px-2 py-0.5 rounded-md">
                chuẩn NĐ30
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h3 className="font-bold text-base text-slate-800 line-clamp-1">{tmpl.name}</h3>
              <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed min-h-[36px]">{tmpl.description}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1 text-[11px] text-slate-500">
              <div><span className="font-bold text-slate-700">CQ ban hành:</span> {tmpl.co_quan_ban_hanh}</div>
              <div className="line-clamp-1"><span className="font-bold text-slate-700">Trích yếu:</span> {tmpl.trich_yeu}</div>
            </div>

            <div className="flex gap-2.5 mt-auto pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewDoc(tmpl)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <span className="material-icons-round text-sm">visibility</span>
                <span>Xem nhanh</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectTemplate(tmpl)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
              >
                <span className="material-icons-round text-sm">edit_document</span>
                <span>Chọn mẫu</span>
              </button>
            </div>
          </div>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 flex flex-col items-center gap-3">
            <span className="material-icons-round text-5xl">folder_off</span>
            <p className="font-semibold text-sm">Không tìm thấy mẫu văn bản nào phù hợp.</p>
          </div>
        )}
      </div>

      {/* QUICK PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[85vh] flex flex-col animate-scaleUp">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-800">Xem nhanh mẫu: {previewDoc.name}</h3>
                <p className="text-slate-500 text-xs mt-0.5">{previewDoc.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-icons-round">close</span>
              </button>
            </div>

            {/* Modal Body (Pre-formatted preview) */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm font-serif text-[11px] leading-relaxed max-w-[620px] mx-auto text-slate-950">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-center w-[40%] text-[10px]">
                    <div className="uppercase">{previewDoc.co_quan_chu_quan || ''}</div>
                    <div className="uppercase font-bold">{previewDoc.co_quan_ban_hanh}</div>
                    <div className="w-12 border-t border-slate-950 mx-auto mt-1"></div>
                    <div className="mt-1 font-sans text-[9px]">{previewDoc.so_ky_hieu}</div>
                  </div>
                  <div className="text-center w-[60%]">
                    <div className="uppercase font-bold text-[10px]">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div className="font-bold text-[11px]">Độc lập - Tự do - Hạnh phúc</div>
                    <div className="w-24 border-t border-slate-950 mx-auto mt-1"></div>
                    <div className="italic text-[10.5px] mt-1">{previewDoc.dia_danh}, ngày 17 tháng 03 năm 2026</div>
                  </div>
                </div>

                {previewDoc.id !== 'cong_van' && (
                  <div className="text-center my-6">
                    <div className="uppercase font-bold text-[11px]">{previewDoc.name}</div>
                    <div className="font-bold italic text-[11px] px-8">{previewDoc.trich_yeu}</div>
                    <div className="w-10 border-t border-slate-950 mx-auto mt-1"></div>
                  </div>
                )}

                {previewDoc.kinh_gui && previewDoc.kinh_gui.length > 0 && (
                  <div className="mb-4 pl-12 text-justify">
                    <span className="italic">Kính gửi:</span>
                    <span className="pl-1">
                      {previewDoc.kinh_gui.map((kg, i) => (
                        <span key={i} className="block pl-12 -mt-4 first:inline first:pl-0 first:mt-0">{kg}</span>
                      ))}
                    </span>
                  </div>
                )}

                {previewDoc.can_cu && previewDoc.can_cu.length > 0 && (
                  <div className="mb-4">
                    {previewDoc.can_cu.map((cc, i) => (
                      <div key={i} className="italic text-justify mb-1" style={{ textIndent: '2.5em' }}>Căn cứ {cc};</div>
                    ))}
                    <div className="font-bold uppercase text-center my-4">{previewDoc.dong_quyet_dinh || 'QUYẾT ĐỊNH:'}</div>
                  </div>
                )}

                <div className="text-justify mb-4 whitespace-pre-wrap" style={{ textIndent: '2.5em' }}>{previewDoc.noi_dung}</div>

                {previewDoc.cac_dieu && previewDoc.cac_dieu.length > 0 && (
                  <div className="mb-4">
                    {previewDoc.cac_dieu.map((dieu, i) => (
                      <div key={i} className="text-justify mb-2" style={{ textIndent: '2.5em' }}>
                        <span className="font-bold">Điều {i+1}. </span>
                        <span>{dieu}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-start mt-8">
                  <div className="text-left w-[40%] text-[9px] leading-tight">
                    <div className="font-bold italic text-[9.5px] mb-1">Nơi nhận:</div>
                    {previewDoc.noi_nhan.map((nn, i) => (
                      <div key={i}>{nn}</div>
                    ))}
                  </div>
                  <div className="text-center w-[60%]">
                    {previewDoc.quyen_han_ky && (
                      <div className="font-bold uppercase text-[9.5px]">{previewDoc.quyen_han_ky}</div>
                    )}
                    {previewDoc.kt_chuc_vu && (
                      <div className="font-bold uppercase text-[9.5px]">{previewDoc.kt_chuc_vu}</div>
                    )}
                    <div className="font-bold uppercase text-[9.5px]">{previewDoc.chuc_vu_ky}</div>
                    <div className="h-12"></div>
                    <div className="font-bold text-[10.5px]">{previewDoc.nguoi_ky}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2.5 hover:bg-slate-100 rounded-xl text-slate-600 font-semibold text-xs transition-colors"
              >
                Đóng lại
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectTemplate(previewDoc);
                  setPreviewDoc(null);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
              >
                <span className="material-icons-round text-sm">edit_document</span>
                <span>Chọn mẫu này</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
