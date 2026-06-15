'use client';

import React, { useState, useRef, useEffect } from 'react';
import { askAssistantQnA, ApiSettings } from '@/lib/ai';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export interface AssistantChatProps {
  apiSettings: ApiSettings;
}

// Helper function defined outside the component to bypass React Compiler render purity checks
const createMessageId = (prefix: string): string => {
  return `${prefix}-${Date.now()}`;
};

export default function AssistantChat({ apiSettings }: AssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Xin chào cán bộ! Tôi là Trợ lý AI chuyên trách về thể thức văn thư Việt Nam.\n\nTác vụ hỗ trợ của tôi bao gồm giải đáp chi tiết về:\n- Nghị định 30/2020/NĐ-CP (về công tác văn thư Nhà nước)\n- Hướng dẫn số 36-HD/VPTW (về thể thức văn bản Đảng)\n\nHãy chọn câu hỏi nhanh dưới đây hoặc nhập câu hỏi trực tiếp để trao đổi!'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isPartyContext, setIsPartyContext] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickQuestions = [
    "Căn lề chuẩn NĐ30 là bao nhiêu?",
    "Kính gửi có được in đậm không?",
    "Cách ký thay (KT.) và thừa lệnh (TL.) chuẩn?",
    "Sự khác biệt giữa văn bản Đảng và Nhà nước?",
    "Phần Nơi nhận trình bày dấu câu thế nào?"
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: createMessageId('msg'),
      sender: 'user',
      text: text
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const answer = await askAssistantQnA(
        text,
        isPartyContext,
        apiSettings.geminiKey || apiSettings.openaiKey || undefined,
        apiSettings.apiProvider
      );

      const assistantMsg: Message = {
        id: createMessageId('msg-ans'),
        sender: 'assistant',
        text: answer
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e: unknown) {
      const errMsgVal = e instanceof Error ? e.message : String(e);
      const errMsg: Message = {
        id: createMessageId('msg-err'),
        sender: 'assistant',
        text: 'Lỗi hệ thống: ' + (errMsgVal || 'Không thể lấy dữ liệu trả lời.')
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col lg:grid lg:grid-cols-12 gap-6 h-[75vh] max-h-[600px] items-stretch">
      
      {/* LEFT SIDEBAR: QUICK QUESTIONS & CONTEXT TOGGLE (4 Cols) */}
      <div className="lg:col-span-4 flex flex-col gap-5 border-r border-slate-100 pr-0 lg:pr-6">
        <div>
          <h3 className="font-bold text-sm text-slate-800">Thiết lập cuộc trò chuyện</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Tùy chỉnh ngữ cảnh hướng dẫn để AI trả lời đúng quy chế.</p>
        </div>

        {/* Toggle Context */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ngữ cảnh văn bản chính</label>
          <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200/50">
            <button
              onClick={() => setIsPartyContext(false)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                !isPartyContext ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              NĐ 30 (Nhà nước)
            </button>
            <button
              onClick={() => setIsPartyContext(true)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                isPartyContext ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              HD 36 (Bên Đảng)
            </button>
          </div>
        </div>

        {/* Quick Questions list */}
        <div className="flex flex-col gap-2 flex-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Câu hỏi tra cứu nhanh</label>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[200px] lg:max-h-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                className="w-full p-2.5 rounded-xl border border-slate-100 hover:border-blue-100 bg-slate-50 text-slate-600 hover:text-blue-600 text-xs font-semibold text-left transition-all active:scale-98 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: CHAT CONVERSATION WINDOW (8 Cols) */}
      <div className="lg:col-span-8 flex flex-col gap-4 h-full min-h-[300px]">
        {/* Messages list */}
        <div className="flex-1 border border-slate-200/70 bg-slate-50/50 rounded-2xl p-4 overflow-y-auto space-y-4 max-h-[380px] lg:max-h-none">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10 rounded-br-none'
                  : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200/80 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-2 text-xs text-slate-400 font-semibold">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-200"></span>
                <span>Trợ lý AI đang tra cứu...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex gap-2.5 items-center"
        >
          <input
            type="text"
            placeholder="Nhập câu hỏi của bạn về thể thức văn bản tại đây..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl text-xs outline-none focus:border-blue-500 bg-white"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-2xl flex items-center justify-center shadow-md shadow-blue-500/10 active:scale-98 transition-all"
          >
            <span className="material-icons-round">send</span>
          </button>
        </form>
      </div>

    </div>
  );
}
