'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone === '0378644766' && password === '123') {
      localStorage.setItem('user', JSON.stringify({ name: 'Đặng Thanh Tuyền', role: 'Cán bộ BCHQS xã Nhữ Khê' }));
      router.push('/dashboard');
    } else {
      setError('Số điện thoại hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="max-w-md w-full glass-panel p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Đăng nhập</h2>
          <p className="text-slate-400">Hệ thống AI Văn Bản 30</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Số điện thoại</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="Nhập mật khẩu"
            />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button 
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            Đăng nhập
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
