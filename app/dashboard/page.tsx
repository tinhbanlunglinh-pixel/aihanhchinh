'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DocumentEditor from '@/components/DocumentEditor';
import FormattingChecker from '@/components/FormattingChecker';
import AIConverter from '@/components/AIConverter';
import AISmartComposer from '@/components/AISmartComposer';
import CommuneAssistant from '@/components/CommuneAssistant';
import DocumentManager from '@/components/DocumentManager';
import AssistantChat from '@/components/AssistantChat';
import SettingsPanel from '@/components/SettingsPanel';
import { DocTemplate } from '@/lib/templateData';
import { ApiSettings } from '@/lib/ai';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<string>('ai_compose');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [editorData, setEditorData] = useState<DocTemplate>({
    id: 'cong_van',
    name: 'Công văn',
    code: 'CV',
    description: 'Văn bản hành chính soạn thảo tự do',
    co_quan_chu_quan: 'ỦY BAN NHÂN DÂN TỈNH TUYÊN QUANG',
    co_quan_ban_hanh: 'ỦY BAN NHÂN DÂN XÃ NHỮ KHÊ',
    so_ky_hieu: 'Số:      /UBND-VP',
    dia_danh: 'Nhữ Khê',
    trich_yeu: 'V/v chỉ đạo tăng cường công tác cải cách hành chính năm 2026',
    kinh_gui: ['Các cơ quan, đơn vị thuộc UBND xã Nhữ Khê'],
    noi_dung: 'Nhằm đẩy mạnh chuyển đổi số và nâng cao chỉ số cải cách hành chính (CCHC) tại địa phương. UBND xã Nhữ Khê yêu cầu các ban ngành đoàn thể, công chức chuyên môn và Ban chỉ sự các thôn bản tập trung triển khai các giải pháp sau:\n1. Nâng cao tinh thần trách nhiệm, thái độ phục vụ nhân dân tại bộ phận Một cửa.\n2. Tăng cường tuyên truyền, hướng dẫn người dân nộp hồ sơ trực tuyến thông qua cổng dịch vụ công.\n3. Định kỳ báo cáo tiến độ và kết quả thực hiện trước ngày 25 hàng tháng.\nYêu cầu các đơn vị nghiêm túc thực hiện./.',
    quyen_han_ky: 'TM. ỦY BAN NHÂN DÂN',
    chuc_vu_ky: 'CHỦ TỊCH',
    nguoi_ky: 'Nguyễn Văn Chiến',
    noi_nhan: ['Như trên;', 'Lưu: VT, VP.']
  });

  const [apiSettings, setApiSettings] = useState<ApiSettings>({
    geminiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
    openaiKey: process.env.NEXT_PUBLIC_OPENAI_KEY || '',
    apiProvider: 'gemini' as 'gemini' | 'openai',
    co_quan_chu_quan: 'ỦY BAN NHÂN DÂN TỈNH TUYÊN QUANG',
    co_quan_ban_hanh: 'ỦY BAN NHÂN DÂN XÃ NHỮ KHÊ',
    dia_danh: 'Nhữ Khê',
    nguoi_ky: 'Nguyễn Văn Chiến',
    chuc_vu_ky: 'CHỦ TỊCH',
    quyen_han_ky: 'TM. ỦY BAN NHÂN DÂN'
  });

  // Load Settings from LocalStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('ai_van_ban_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setTimeout(() => {
          setApiSettings(prev => ({ ...prev, ...parsed }));
          
          // Sync defaults to current editor document
          setEditorData(prev => ({
            ...prev,
            co_quan_chu_quan: parsed.co_quan_chu_quan || prev.co_quan_chu_quan,
            co_quan_ban_hanh: parsed.co_quan_ban_hanh || prev.co_quan_ban_hanh,
            dia_danh: parsed.dia_danh || prev.dia_danh,
            nguoi_ky: parsed.nguoi_ky || prev.nguoi_ky,
            chuc_vu_ky: parsed.chuc_vu_ky || prev.chuc_vu_ky,
            quyen_han_ky: parsed.quyen_han_ky || prev.quyen_han_ky,
          }));
        }, 0);
      } catch {
        console.error('Lỗi đọc settings');
      }
    }
  }, []);

  // Update defaults in editor if settings change
  const handleSettingsUpdate = (newSettings: ApiSettings) => {
    setApiSettings(newSettings);
    localStorage.setItem('ai_van_ban_settings', JSON.stringify(newSettings));
    
    setEditorData(prev => ({
      ...prev,
      co_quan_chu_quan: newSettings.co_quan_chu_quan,
      co_quan_ban_hanh: newSettings.co_quan_ban_hanh,
      dia_danh: newSettings.dia_danh,
      nguoi_ky: newSettings.nguoi_ky,
      chuc_vu_ky: newSettings.chuc_vu_ky,
      quyen_han_ky: newSettings.quyen_han_ky,
    }));
  };

  const handleSelectTemplate = (template: DocTemplate) => {
    // Fill selected template and inject user-configured defaults if available
    setEditorData({
      ...template,
      co_quan_chu_quan: apiSettings.co_quan_chu_quan || template.co_quan_chu_quan,
      co_quan_ban_hanh: apiSettings.co_quan_ban_hanh || template.co_quan_ban_hanh,
      dia_danh: apiSettings.dia_danh || template.dia_danh,
      nguoi_ky: apiSettings.nguoi_ky || template.nguoi_ky,
      chuc_vu_ky: apiSettings.chuc_vu_ky || template.chuc_vu_ky,
      quyen_han_ky: apiSettings.quyen_han_ky || template.quyen_han_ky,
    });
    setActiveTab('create'); // Switch to editor
  };

  // Main Render View based on activeTab
  const renderMainView = () => {
    switch (activeTab) {
      case 'ai_compose':
        return (
          <AISmartComposer
            apiSettings={apiSettings}
            onDocumentReady={(doc) => {
              setEditorData(doc);
              setActiveTab('create');
            }}
          />
        );
      case 'create':
        return (
          <DocumentEditor 
            data={editorData} 
            setData={setEditorData} 
            apiSettings={apiSettings} 
          />
        );
      case 'checker':
        return (
          <FormattingChecker 
            documentText={editorData.noi_dung} 
            documentData={editorData}
            onUpdateContent={(val) => setEditorData(prev => ({ ...prev, noi_dung: val }))}
            onUpdateData={(newData) => setEditorData(newData)}
          />
        );
      case 'converter':
        return (
          <AIConverter 
            apiSettings={apiSettings} 
            onGenerateDoc={handleSelectTemplate} 
          />
        );
      case 'commune':
        return (
          <CommuneAssistant 
            apiSettings={apiSettings} 
            onGenerateDoc={handleSelectTemplate} 
          />
        );
      case 'manager':
        return (
          <DocumentManager 
            currentDoc={editorData} 
            onSelectDoc={handleSelectTemplate} 
          />
        );
      case 'assistant':
        return (
          <AssistantChat 
            apiSettings={apiSettings} 
          />
        );
      case 'settings':
        return (
          <SettingsPanel 
            settings={apiSettings} 
            onSave={handleSettingsUpdate} 
          />
        );
      default:
        return <div>Tính năng đang cập nhật...</div>;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />

      {/* Main Layout Area */}
      <div 
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ paddingLeft: sidebarCollapsed ? '80px' : '288px' }}
      >
        {/* Header Bar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg text-slate-700 uppercase tracking-wide">
              {activeTab === 'ai_compose' && 'AI Soạn Thảo Văn Bản'}
              {activeTab === 'create' && 'Trình Soạn Thảo Văn Bản Thủ Công'}
              {activeTab === 'checker' && 'Kiểm Tra Thể Thức NĐ30'}
              {activeTab === 'converter' && 'AI Chuyển Đổi Định Dạng'}
              {activeTab === 'commune' && 'Trợ Lý AI Cán Bộ Cấp Xã'}
              {activeTab === 'manager' && 'Quản Lý Văn Bản & Lưu Trữ'}
              {activeTab === 'assistant' && 'Trợ Lý AI Hỏi Đáp Thể Thức'}
              {activeTab === 'settings' && 'Cấu Hình Hệ Thống'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span>Offline/Online Mode</span>
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/10">
              CB
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-600">
              Cán bộ xã Lũng Cú
            </span>
          </div>
        </header>

        {/* Dynamic Main Page Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {renderMainView()}
        </main>
      </div>
    </div>
  );
}
