'use client';

import React, { useState } from 'react';
import { ApiSettings, callRealAI } from '@/lib/ai';

export interface SettingsPanelProps {
  settings: ApiSettings;
  onSave: (newSettings: ApiSettings) => void;
}

export default function SettingsPanel({ settings, onSave }: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState<ApiSettings>({ ...settings });
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
    alert('Đã lưu cấu hình hệ thống thành công!');
  };

  const handleTestConnection = async () => {
    setTestStatus('loading');
    setTestMessage('');

    const provider = localSettings.apiProvider;
    const apiKey = provider === 'gemini' ? localSettings.geminiKey : localSettings.openaiKey;

    if (!apiKey) {
      setTestStatus('error');
      setTestMessage(`Vui lòng nhập API Key cho ${provider === 'gemini' ? 'Gemini' : 'OpenAI'} trước khi test.`);
      return;
    }

    try {
      const result = await callRealAI(
        'Trả lời ngắn gọn: 1 + 1 = ?',
        'Bạn là trợ lý AI. Trả lời ngắn gọn.',
        apiKey,
        provider
      );
      if (result) {
        setTestStatus('success');
        setTestMessage(`✅ Kết nối ${provider === 'gemini' ? 'Gemini' : 'OpenAI'} thành công! Phản hồi: "${result.slice(0, 80)}"`);
      } else {
        setTestStatus('error');
        setTestMessage('⚠️ API trả về kết quả rỗng. Kiểm tra lại API Key.');
      }
    } catch (err: unknown) {
      setTestStatus('error');
      const errMsg = err instanceof Error ? err.message : String(err);
      setTestMessage(`❌ Lỗi kết nối: ${errMsg}`);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center gap-2.5 text-blue-600">
        <span className="material-icons-round text-2xl">settings</span>
        <h2 className="text-lg font-bold">Cấu hình hệ thống</h2>
      </div>
      <p className="text-slate-500 text-xs leading-relaxed -mt-4">
        Quản lý các thông số điền tự động mặc định của cơ quan đơn vị hành chính.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* API KEY CONFIGURATION */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span className="text-lg">🔑</span>
            <span>Cấu Hình API Key</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Gemini API Key */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gemini API Key</label>
              <div className="relative">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  id="geminiKey"
                  value={localSettings.geminiKey || ''}
                  onChange={handleChange}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 pr-10 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span className="material-icons-round text-lg">
                    {showGeminiKey ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* OpenAI API Key */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">OpenAI API Key</label>
              <div className="relative">
                <input
                  type={showOpenaiKey ? 'text' : 'password'}
                  id="openaiKey"
                  value={localSettings.openaiKey || ''}
                  onChange={handleChange}
                  placeholder="sk-..."
                  className="w-full px-3.5 py-2.5 pr-10 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span className="material-icons-round text-lg">
                    {showOpenaiKey ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* API Provider Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nhà cung cấp API</label>
              <select
                id="apiProvider"
                value={localSettings.apiProvider}
                onChange={handleChange}
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
              >
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI (GPT)</option>
              </select>
            </div>
          </div>

          {/* Test Connection Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus === 'loading'}
              className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 border border-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-icons-round text-sm">
                {testStatus === 'loading' ? 'hourglass_top' : 'cable'}
              </span>
              <span>{testStatus === 'loading' ? 'Đang test...' : 'Test kết nối'}</span>
            </button>

            {testMessage && (
              <div className={`text-xs font-medium px-3 py-2 rounded-lg flex-1 ${
                testStatus === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : testStatus === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : ''
              }`}>
                {testMessage}
              </div>
            )}
          </div>
        </div>

        {/* DEFAULT ENTITY OPTIONS */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span className="material-icons-round text-blue-500">account_balance</span>
            <span>Thông tin mặc định của đơn vị cơ quan</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cơ quan chủ quản</label>
              <input
                type="text"
                id="co_quan_chu_quan"
                value={localSettings.co_quan_chu_quan || ''}
                onChange={handleChange}
                placeholder="VD: BỘ TÀI CHÍNH"
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cơ quan ban hành</label>
              <input
                type="text"
                id="co_quan_ban_hanh"
                value={localSettings.co_quan_ban_hanh || ''}
                onChange={handleChange}
                placeholder="VD: VỤ TỔ CHỨC CÁN BỘ"
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Địa danh mặc định</label>
              <input
                type="text"
                id="dia_danh"
                value={localSettings.dia_danh || ''}
                onChange={handleChange}
                placeholder="VD: Hà Nội"
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quyền hạn ký (TM. KT. TL.)</label>
              <input
                type="text"
                id="quyen_han_ky"
                value={localSettings.quyen_han_ky || ''}
                onChange={handleChange}
                placeholder="VD: TM. ỦY BAN NHÂN DÂN"
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chức danh người ký mặc định</label>
              <input
                type="text"
                id="chuc_vu_ky"
                value={localSettings.chuc_vu_ky || ''}
                onChange={handleChange}
                placeholder="VD: CHỦ TỊCH"
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tên người ký mặc định</label>
              <input
                type="text"
                id="nguoi_ky"
                value={localSettings.nguoi_ky || ''}
                onChange={handleChange}
                placeholder="VD: Nguyễn Văn A"
                className="px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/10 active:scale-98 transition-all"
          >
            <span className="material-icons-round text-sm">save</span>
            <span>Lưu cấu hình hệ thống</span>
          </button>
        </div>

      </form>
    </div>
  );
}
