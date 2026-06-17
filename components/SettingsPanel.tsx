'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ApiSettings, AdditionalSigner, callRealAI } from '@/lib/ai';

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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastUpdated, setLastUpdated] = useState<string>(settings.lastUpdated || '');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  // --- NEW PERSON FORM ---
  const [newChucDanh, setNewChucDanh] = useState('');
  const [newHoTen, setNewHoTen] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Sync from parent on mount
  useEffect(() => {
    setLocalSettings({ ...settings });
    setLastUpdated(settings.lastUpdated || '');
  }, [settings]);

  // Auto-save with debounce
  const triggerAutoSave = useCallback((updatedSettings: ApiSettings) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSaveStatus('saving');

    debounceRef.current = setTimeout(() => {
      const now = new Date().toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      });
      const settingsWithTimestamp = { ...updatedSettings, lastUpdated: now };
      onSave(settingsWithTimestamp);
      setLastUpdated(now);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2500);
    }, 1500);
  }, [onSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    const updated = { ...localSettings, [id]: value };
    setLocalSettings(updated);
    if (!isFirstRender.current) {
      triggerAutoSave(updated);
    }
  };

  // Mark first render done after mount
  useEffect(() => {
    isFirstRender.current = false;
  }, []);

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

  // --- ADD / REMOVE PERSON ---
  const handleAddPerson = () => {
    if (!newChucDanh.trim() || !newHoTen.trim()) return;
    const newSigner: AdditionalSigner = {
      id: Date.now().toString(),
      chuc_danh: newChucDanh.trim(),
      ho_ten: newHoTen.trim(),
    };
    const updatedSigners = [...(localSettings.additional_signers || []), newSigner];
    const updated = { ...localSettings, additional_signers: updatedSigners };
    setLocalSettings(updated);
    triggerAutoSave(updated);
    setNewChucDanh('');
    setNewHoTen('');
    setShowAddForm(false);
  };

  const handleRemovePerson = (id: string) => {
    const updatedSigners = (localSettings.additional_signers || []).filter(s => s.id !== id);
    const updated = { ...localSettings, additional_signers: updatedSigners };
    setLocalSettings(updated);
    triggerAutoSave(updated);
  };

  const handleEditPerson = (id: string, field: 'chuc_danh' | 'ho_ten', value: string) => {
    const updatedSigners = (localSettings.additional_signers || []).map(s =>
      s.id === id ? { ...s, [field]: value } : s
    );
    const updated = { ...localSettings, additional_signers: updatedSigners };
    setLocalSettings(updated);
    triggerAutoSave(updated);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-blue-600">
          <span className="material-icons-round text-2xl">settings</span>
          <h2 className="text-lg font-bold">Cấu hình hệ thống</h2>
        </div>

        {/* AUTO-SAVE STATUS INDICATOR */}
        <div className="flex items-center gap-3">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1.5 text-amber-600 text-xs font-semibold animate-pulse">
              <span className="material-icons-round text-sm animate-spin">sync</span>
              Đang lưu...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold"
              style={{ animation: 'fadeInScale 0.3s ease' }}>
              <span className="material-icons-round text-sm">check_circle</span>
              Đã tự động lưu!
            </span>
          )}
          {lastUpdated && (
            <span className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
              <span className="material-icons-round text-xs">schedule</span>
              Cập nhật lần cuối: {lastUpdated}
            </span>
          )}
        </div>
      </div>
      <p className="text-slate-500 text-xs leading-relaxed -mt-4">
        Quản lý các thông số điền tự động mặc định của cơ quan đơn vị hành chính. Mọi thay đổi sẽ được <strong>tự động lưu</strong>.
      </p>

      {/* INLINE STYLE FOR ANIMATION */}
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; max-height: 0; transform: translateY(-10px); }
          to { opacity: 1; max-height: 300px; transform: translateY(0); }
        }
        .slide-down { animation: slideDown 0.35s ease forwards; }
      `}</style>

      <div className="flex flex-col gap-6">

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

        {/* ADDITIONAL SIGNERS (PEOPLE + TITLES) */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <span className="material-icons-round text-purple-500">group_add</span>
              <span>Danh sách người ký &amp; Chức danh bổ sung</span>
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-500/15 active:scale-95 transition-all"
            >
              <span className="material-icons-round text-sm">{showAddForm ? 'close' : 'person_add'}</span>
              <span>{showAddForm ? 'Đóng' : 'Thêm người'}</span>
            </button>
          </div>

          {/* ADD FORM (slide down) */}
          {showAddForm && (
            <div className="slide-down bg-gradient-to-br from-purple-50/80 to-indigo-50/80 border border-purple-200/60 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-icons-round text-purple-500 text-lg">badge</span>
                <span className="font-bold text-sm text-purple-700">Thêm người ký mới</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Chức danh</label>
                  <input
                    type="text"
                    value={newChucDanh}
                    onChange={(e) => setNewChucDanh(e.target.value)}
                    placeholder="VD: CHỈ HUY TRƯỞNG BAN CHỈ HUY QUÂN SỰ XÃ"
                    className="px-3.5 py-2.5 border border-purple-200 rounded-xl text-sm outline-none focus:border-purple-500 bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Họ và tên</label>
                  <input
                    type="text"
                    value={newHoTen}
                    onChange={(e) => setNewHoTen(e.target.value)}
                    placeholder="VD: Lê Như Điện"
                    className="px-3.5 py-2.5 border border-purple-200 rounded-xl text-sm outline-none focus:border-purple-500 bg-white"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddPerson(); } }}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddPerson}
                  disabled={!newChucDanh.trim() || !newHoTen.trim()}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-purple-500/10 active:scale-95 transition-all disabled:cursor-not-allowed"
                >
                  <span className="material-icons-round text-sm">add_circle</span>
                  <span>Thêm vào danh sách</span>
                </button>
              </div>
            </div>
          )}

          {/* SIGNERS LIST */}
          {(localSettings.additional_signers && localSettings.additional_signers.length > 0) ? (
            <div className="flex flex-col gap-3">
              {localSettings.additional_signers.map((signer, index) => (
                <div
                  key={signer.id}
                  className="group flex items-center gap-4 bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-purple-200 rounded-2xl p-4 transition-all duration-200 hover:shadow-sm"
                  style={{ animation: `fadeInScale 0.3s ease ${index * 0.08}s both` }}
                >
                  {/* Number badge */}
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-purple-500/15 flex-shrink-0">
                    {index + 1}
                  </div>

                  {/* Editable fields */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Chức danh</span>
                      <input
                        type="text"
                        value={signer.chuc_danh}
                        onChange={(e) => handleEditPerson(signer.id, 'chuc_danh', e.target.value)}
                        className="px-3 py-2 border border-transparent hover:border-slate-200 focus:border-purple-400 rounded-lg text-sm outline-none bg-transparent transition-colors font-medium text-slate-700"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Họ và tên</span>
                      <input
                        type="text"
                        value={signer.ho_ten}
                        onChange={(e) => handleEditPerson(signer.id, 'ho_ten', e.target.value)}
                        className="px-3 py-2 border border-transparent hover:border-slate-200 focus:border-purple-400 rounded-lg text-sm outline-none bg-transparent transition-colors font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleRemovePerson(signer.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 flex-shrink-0"
                    title="Xóa người này"
                  >
                    <span className="material-icons-round text-lg">delete_outline</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <span className="material-icons-round text-4xl mb-2 opacity-30">people_outline</span>
              <p className="text-sm font-medium">Chưa có người ký bổ sung</p>
              <p className="text-xs mt-1">Nhấn &quot;Thêm người&quot; để thêm chức danh và người ký mới</p>
            </div>
          )}
        </div>

        {/* Manual Save (backup) + Auto-save note */}
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <span className="material-icons-round text-sm">info</span>
            <span>Mọi thay đổi được <strong>tự động lưu</strong> sau 1.5 giây</span>
          </div>
          <button
            type="button"
            onClick={() => {
              const now = new Date().toLocaleString('vi-VN', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
              });
              const settingsWithTimestamp = { ...localSettings, lastUpdated: now };
              onSave(settingsWithTimestamp);
              setLastUpdated(now);
              setSaveStatus('saved');
              setTimeout(() => setSaveStatus('idle'), 2500);
            }}
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-blue-500/10 active:scale-95 transition-all"
          >
            <span className="material-icons-round text-sm">save</span>
            <span>Lưu cấu hình hệ thống</span>
          </button>
        </div>

      </div>
    </div>
  );
}
