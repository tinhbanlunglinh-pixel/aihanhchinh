'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 overflow-x-hidden">
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="material-icons-round text-indigo-400 text-3xl">description</span>
          <span className="font-extrabold text-xl lg:text-2xl tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI Văn Bản 30
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hidden sm:inline-flex text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            Tính năng
          </Link>
          <Link href="/login" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all active:scale-95">
            <span>Vào Dashboard</span>
            <span className="material-icons-round text-sm">arrow_forward</span>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-gradient relative px-6 lg:px-16 pt-20 lg:pt-32 pb-24 flex flex-col items-center text-center">
        {/* Decorative glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-full text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-8 backdrop-blur-sm">
            <span className="material-icons-round text-sm animate-pulse-slow">auto_awesome</span>
            <span>Trợ lý AI soạn văn bản hành chính Việt Nam</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight lg:leading-none mb-6">
            <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              AI Soạn Văn Bản
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Hành Chính
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-indigo-600/90 mb-4">
            Chuẩn Nghị Định 30/2020/NĐ-CP
          </p>

          {/* Description */}
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
            Chỉ cần chọn loại văn bản và mô tả nội dung — AI sẽ tự động soạn thảo văn bản hành chính đúng chuẩn thể thức Nhà nước
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="shimmer-btn inline-flex items-center justify-center gap-3 text-lg px-10 py-5 rounded-2xl"
            >
              <span className="material-icons-round text-2xl">edit_document</span>
              <span>Bắt đầu soạn thảo →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="px-6 lg:px-16 -mt-12 relative z-20">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 lg:gap-8">
          {[
            { value: '24+', label: 'Loại văn bản', icon: 'description' },
            { value: 'NĐ30', label: 'Chuẩn thể thức', icon: 'verified' },
            { value: 'DOCX', label: 'Xuất file Word', icon: 'download' },
          ].map((stat, i) => (
            <div key={i} className="glass-panel p-6 text-center animate-slide-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <span className="material-icons-round text-indigo-500 text-2xl mb-2 block">{stat.icon}</span>
              <div className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="px-6 lg:px-16 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Quy trình 3 bước đơn giản
              </span>
            </h2>
            <p className="text-slate-500 text-lg">Từ ý tưởng đến văn bản hoàn chỉnh chỉ trong vài phút</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-panel p-8 hover:bg-white transition-all duration-300 hover:-translate-y-2 group shadow-sm hover:shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-indigo-500 text-2xl">checklist</span>
              </div>
              <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Bước 1</div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Chọn loại văn bản</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Lựa chọn 1 trong 24 loại văn bản hành chính: Công văn, Quyết định, Tờ trình, Thông báo, Biên bản, Kế hoạch, Báo cáo và nhiều loại khác.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel p-8 hover:bg-white transition-all duration-300 hover:-translate-y-2 group shadow-sm hover:shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-purple-500 text-2xl">psychology</span>
              </div>
              <div className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-2">Bước 2</div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">AI tự động soạn</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                AI phân tích yêu cầu và tự động soạn thảo nội dung văn bản đúng chuẩn thể thức Nghị định 30/2020/NĐ-CP, văn phong hành chính chuẩn mực.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-8 hover:bg-white transition-all duration-300 hover:-translate-y-2 group shadow-sm hover:shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-emerald-500 text-2xl">sim_card_download</span>
              </div>
              <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-2">Bước 3</div>
              <h3 className="font-bold text-xl mb-3 text-slate-800">Xuất file Word</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Xuất file .docx đạt độ chính xác cao về căn lề (30-20-20-20mm), kiểu chữ Times New Roman, khoảng trống ký tên và đường kẻ gạch chân chuẩn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="px-6 lg:px-16 pb-24">
        <div className="max-w-3xl mx-auto glass-panel p-12 text-center relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
          <div className="relative z-10">
            <span className="material-icons-round text-indigo-500 text-5xl mb-4 block float-glow">rocket_launch</span>
            <h3 className="text-2xl lg:text-3xl font-extrabold mb-4 text-slate-800">Sẵn sàng soạn văn bản?</h3>
            <p className="text-slate-600 mb-8 max-w-lg mx-auto">
              Trải nghiệm công cụ soạn thảo văn bản hành chính thông minh nhất, được thiết kế riêng cho cán bộ công chức Việt Nam.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-base font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all active:scale-95"
            >
              <span className="material-icons-round">edit_document</span>
              <span>Bắt đầu soạn thảo ngay</span>
              <span className="material-icons-round">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto px-6 lg:px-16 py-8 border-t border-slate-200 text-center text-xs lg:text-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-icons-round text-indigo-500">description</span>
            <span className="font-bold text-slate-700">AI Văn Bản 30</span>
          </div>
          <p className="text-slate-500">© 2026 AI Văn Bản 30. Thiết kế phục vụ chuyên nghiệp nền Hành chính công vụ Việt Nam.</p>
        </div>
      </footer>
    </div>
  );
}
