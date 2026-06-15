'use client';

import React from 'react';

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed?: boolean;
  setCollapsed?: (val: boolean) => void;
}

export interface MenuItem {
  id: string;
  name: string;
  icon: string;
  badge?: string;
}

export default function Sidebar({ activeTab, setActiveTab, collapsed = false, setCollapsed }: SidebarProps) {
  const menuItems: MenuItem[] = [
    { id: 'ai_compose', name: 'AI Soạn Thảo', icon: 'auto_awesome', badge: 'NEW' },
    { id: 'create', name: 'Soạn Thủ Công', icon: 'edit_document' },
    { id: 'checker', name: 'Kiểm tra thể thức', icon: 'fact_check', badge: 'NĐ30' },
    { id: 'converter', name: 'AI chuyển đổi VB', icon: 'swap_horiz' },
    { id: 'commune', name: 'Trợ lý cấp xã', icon: 'gavel' },
    { id: 'manager', name: 'Quản lý văn bản', icon: 'folder_open' },
    { id: 'assistant', name: 'Trợ lý hỏi đáp', icon: 'chat' },
    { id: 'settings', name: 'Cấu hình hệ thống', icon: 'settings' },
  ];

  return (
    <aside className={`bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-30 transition-all duration-300 ${collapsed ? 'w-20' : 'w-72'}`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="material-icons-round text-blue-500 text-3xl shrink-0">description</span>
          {!collapsed && (
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent whitespace-nowrap">
              AI Văn Bản 30
            </span>
          )}
        </div>
        {setCollapsed && (
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-icons-round text-lg">
              {collapsed ? 'menu_open' : 'menu'}
            </span>
          </button>
        )}
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium transition-all group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/15' 
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <span className={`material-icons-round text-[22px] transition-transform group-hover:scale-105 ${
                isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
              }`}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className="flex-1 text-left whitespace-nowrap">{item.name}</span>
              )}
              {!collapsed && item.badge && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-800 text-slate-500 text-center text-xs">
        {!collapsed ? (
          <div>
            <p className="font-semibold text-slate-400">Hệ thống SaaS v1.0.0</p>
            <p className="mt-1">Đáp ứng chuẩn thể thức NĐ30 & HD36</p>
          </div>
        ) : (
          <span className="material-icons-round text-slate-600">verified_user</span>
        )}
      </div>
    </aside>
  );
}
