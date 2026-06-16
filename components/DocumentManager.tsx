'use client';

import React, { useState } from 'react';
import { DocTemplate } from '@/lib/templateData';
import { getHistory, HistoryItem } from '@/lib/history';

export interface DocumentManagerProps {
  currentDoc: DocTemplate;
  onSelectDoc: (doc: DocTemplate) => void;
}

interface SavedDoc {
  uuid: string;
  template: DocTemplate;
  savedAt: string;
  isDeleted: boolean;
  tags: string[];
}

export default function DocumentManager({ currentDoc, onSelectDoc }: DocumentManagerProps) {
  const [savedDocs, setSavedDocs] = useState<SavedDoc[]>(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('ai_van_ban_saved_docs');
      if (data) {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activePane, setActivePane] = useState<'active' | 'trash' | 'history'>('active');
  const [historyDocs, setHistoryDocs] = useState<HistoryItem[]>([]);

  // Load history on mount
  React.useEffect(() => {
    if (activePane === 'history') {
      setHistoryDocs(getHistory());
    }
  }, [activePane]);

  // Save current document to database
  const handleSaveCurrentDoc = () => {
    const newDoc: SavedDoc = {
      uuid: 'doc-' + Date.now(),
      template: { ...currentDoc },
      savedAt: new Date().toISOString(),
      isDeleted: false,
      tags: [currentDoc.id === 'cong_van' ? 'Công văn' : currentDoc.id === 'quyet_dinh' ? 'Quyết định' : 'Khác']
    };

    const updated = [newDoc, ...savedDocs];
    setSavedDocs(updated);
    localStorage.setItem('ai_van_ban_saved_docs', JSON.stringify(updated));
    alert('Đã lưu văn bản hiện tại vào cơ sở dữ liệu thành công!');
  };

  // Move doc to trash
  const handleMoveToTrash = (uuid: string) => {
    const updated = savedDocs.map(doc => {
      if (doc.uuid === uuid) return { ...doc, isDeleted: true };
      return doc;
    });
    setSavedDocs(updated);
    localStorage.setItem('ai_van_ban_saved_docs', JSON.stringify(updated));
  };

  // Restore doc from trash
  const handleRestoreDoc = (uuid: string) => {
    const updated = savedDocs.map(doc => {
      if (doc.uuid === uuid) return { ...doc, isDeleted: false };
      return doc;
    });
    setSavedDocs(updated);
    localStorage.setItem('ai_van_ban_saved_docs', JSON.stringify(updated));
  };

  // Permanent Delete
  const handlePermanentDelete = (uuid: string) => {
    const updated = savedDocs.filter(doc => doc.uuid !== uuid);
    setSavedDocs(updated);
    localStorage.setItem('ai_van_ban_saved_docs', JSON.stringify(updated));
  };

  // Filter docs
  const activeDocs = savedDocs.filter(d => !d.isDeleted && d.template.trich_yeu.toLowerCase().includes(searchTerm.toLowerCase()));
  const trashDocs = savedDocs.filter(d => d.isDeleted && d.template.trich_yeu.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2.5 text-blue-600">
          <span className="material-icons-round text-2xl">folder_open</span>
          <h2 className="text-lg font-bold">Hồ sơ lưu trữ văn bản cá nhân</h2>
        </div>

        <button
          type="button"
          onClick={handleSaveCurrentDoc}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/10 transition-all active:scale-98"
        >
          <span className="material-icons-round text-sm">save</span>
          <span>Lưu văn bản đang soạn thảo</span>
        </button>
      </div>

      {/* Pane select tabs & search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActivePane('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              activePane === 'active' 
                ? 'bg-blue-50 border-blue-100 text-blue-600'
                : 'bg-transparent border-transparent hover:bg-slate-50 text-slate-500'
            }`}
          >
            Văn bản đang sử dụng ({savedDocs.filter(d => !d.isDeleted).length})
          </button>
          <button
            onClick={() => setActivePane('trash')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              activePane === 'trash'
                ? 'bg-red-50 border-red-100 text-red-600'
                : 'bg-transparent border-transparent hover:bg-slate-50 text-slate-500'
            }`}
          >
            Thùng rác ({savedDocs.filter(d => d.isDeleted).length})
          </button>
          <button
            onClick={() => setActivePane('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              activePane === 'history'
                ? 'bg-purple-50 border-purple-100 text-purple-600'
                : 'bg-transparent border-transparent hover:bg-slate-50 text-slate-500'
            }`}
          >
            Lịch sử tự động (7 ngày)
          </button>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu đã lưu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Document grid rendering */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activePane === 'active' ? (
          activeDocs.map(doc => (
            <div key={doc.uuid} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/40 hover:bg-white flex flex-col gap-3 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400">
                  Lưu lúc: {new Date(doc.savedAt).toLocaleString('vi-VN')}
                </span>
                <div className="flex gap-1">
                  {doc.tags.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-blue-50 text-blue-600">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{doc.template.trich_yeu || 'Văn bản không tiêu đề'}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{doc.template.noi_dung.substring(0, 150)}...</p>

              <div className="flex gap-2 mt-2 pt-3 border-t border-slate-100/60">
                <button
                  type="button"
                  onClick={() => onSelectDoc(doc.template)}
                  className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs rounded-lg flex items-center justify-center gap-1 transition-all"
                >
                  <span className="material-icons-round text-sm">edit</span>
                  <span>Mở soạn thảo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveToTrash(doc.uuid)}
                  className="px-3.5 py-2 hover:bg-red-50 text-red-500 rounded-lg transition-all"
                  title="Xóa tạm thời"
                >
                  <span className="material-icons-round text-sm">delete_outline</span>
                </button>
              </div>
            </div>
          ))
        ) : activePane === 'trash' ? (
          trashDocs.map(doc => (
            <div key={doc.uuid} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/40 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400">
                  Lưu lúc: {new Date(doc.savedAt).toLocaleString('vi-VN')}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-red-50 text-red-600">Đã xóa</span>
              </div>

              <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{doc.template.trich_yeu || 'Văn bản không tiêu đề'}</h4>

              <div className="flex gap-2 mt-2 pt-3 border-t border-slate-100/60">
                <button
                  type="button"
                  onClick={() => handleRestoreDoc(doc.uuid)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center justify-center gap-1 transition-all"
                >
                  <span className="material-icons-round text-sm">restore</span>
                  <span>Khôi phục</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePermanentDelete(doc.uuid)}
                  className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg flex items-center justify-center gap-1 transition-all"
                >
                  <span className="material-icons-round text-sm">delete_forever</span>
                  <span>Xóa vĩnh viễn</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          historyDocs.filter(d => d.doc.trich_yeu.toLowerCase().includes(searchTerm.toLowerCase())).map(item => (
            <div key={item.id} className="p-5 border border-purple-100 rounded-2xl bg-purple-50/20 hover:bg-white flex flex-col gap-3 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400">
                  Tạo lúc: {new Date(item.timestamp).toLocaleString('vi-VN')}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-purple-50 text-purple-600">Lịch sử (AI tạo)</span>
              </div>

              <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.doc.trich_yeu || 'Văn bản không tiêu đề'}</h4>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{item.doc.noi_dung.substring(0, 150)}...</p>

              <div className="flex gap-2 mt-2 pt-3 border-t border-purple-100/60">
                <button
                  type="button"
                  onClick={() => onSelectDoc(item.doc)}
                  className="flex-1 py-2 bg-purple-50 hover:bg-purple-100 text-purple-600 font-bold text-xs rounded-lg flex items-center justify-center gap-1 transition-all"
                >
                  <span className="material-icons-round text-sm">open_in_browser</span>
                  <span>Mở xem lại</span>
                </button>
              </div>
            </div>
          ))
        )}

        {activePane === 'active' && activeDocs.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 flex flex-col items-center gap-2">
            <span className="material-icons-round text-4xl">folder_off</span>
            <p className="text-xs">Chưa có hồ sơ lưu trữ nào. Hãy ấn nút &quot;Lưu văn bản đang soạn thảo&quot; để lưu trữ.</p>
          </div>
        )}

        {activePane === 'trash' && trashDocs.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 flex flex-col items-center gap-2">
            <span className="material-icons-round text-4xl">delete_sweep</span>
            <p className="text-xs">Thùng rác trống.</p>
          </div>
        )}

        {activePane === 'history' && historyDocs.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 flex flex-col items-center gap-2">
            <span className="material-icons-round text-4xl">history</span>
            <p className="text-xs">Chưa có lịch sử văn bản nào được AI tạo ra.</p>
          </div>
        )}
      </div>
    </div>
  );
}
