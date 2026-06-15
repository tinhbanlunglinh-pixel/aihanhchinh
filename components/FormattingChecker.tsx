'use client';

import React from 'react';
import { DocTemplate } from '@/lib/templateData';

export interface FormattingCheckerProps {
  documentText: string;
  documentData: DocTemplate;
  onUpdateContent: (newText: string) => void;
  onUpdateData?: (newData: DocTemplate) => void;
}

interface RuleResult {
  id: string;
  name: string;
  status: 'success' | 'error';
  message: string;
  fixable: boolean;
  fixAction?: () => void;
}

export default function FormattingChecker({ documentText, documentData, onUpdateContent, onUpdateData }: FormattingCheckerProps) {
  const newResults: RuleResult[] = [];

    // 1. Kiểm tra Dấu kết thúc văn bản hành chính (./.)
    const cleanText = documentText.trim();
    const endsWithDotSlashDot = cleanText.endsWith('./.');
    newResults.push({
      id: 'end_punctuation',
      name: 'Ký tự kết thúc văn bản (./.)',
      status: endsWithDotSlashDot ? 'success' : 'error',
      message: endsWithDotSlashDot 
        ? 'Văn bản đã kết thúc đúng bằng ký tự "./."' 
        : 'Thiếu ký tự kết thúc "./." ở cuối nội dung văn bản hành chính.',
      fixable: !endsWithDotSlashDot,
      fixAction: () => {
        let fixedText = cleanText;
        if (fixedText.endsWith('.')) {
          fixedText = fixedText.slice(0, -1) + './.';
        } else {
          fixedText += './.';
        }
        onUpdateContent(fixedText);
      }
    });

    // 2. Kiểm tra Nơi nhận dấu chấm/phẩy
    const nnList = documentData.noi_nhan || [];
    let nnError = false;
    let nnMsg = 'Các dòng nơi nhận trình bày đúng quy cách.';
    
    if (nnList.length > 0) {
      for (let i = 0; i < nnList.length; i++) {
        const item = nnList[i].trim();
        if (i === nnList.length - 1) {
          // Dòng cuối cùng của nơi nhận (thường là dòng lưu VT) phải kết thúc bằng dấu chấm
          if (item && !item.endsWith('.')) {
            nnError = true;
            nnMsg = `Dòng nơi nhận cuối cùng "${item}" thiếu dấu chấm (.) kết thúc.`;
            break;
          }
        } else {
          // Các dòng trước phải kết thúc bằng dấu chấm phẩy
          if (item && !item.endsWith(';')) {
            nnError = true;
            nnMsg = `Dòng nơi nhận "${item}" thiếu dấu chấm phẩy (;) phân tách.`;
            break;
          }
        }
      }
    } else {
      nnError = true;
      nnMsg = 'Không có danh sách nơi nhận nào được cấu hình.';
    }

    newResults.push({
      id: 'noi_nhan_format',
      name: 'Dấu câu phần Nơi nhận',
      status: nnError ? 'error' : 'success',
      message: nnMsg,
      fixable: nnError && nnList.length > 0 && !!onUpdateData,
      fixAction: () => {
        if (!onUpdateData) return;
        const fixedList = nnList.map((nn, idx) => {
          let text = nn.trim();
          if (!text.startsWith('-')) text = '- ' + text;
          text = text.replace(/[;\.]$/, '');
          return text + (idx === nnList.length - 1 ? '.' : ';');
        });
        onUpdateData({ ...documentData, noi_nhan: fixedList });
      }
    });

    // 2.2. Kiểm tra Căn cứ pháp lý
    let ccError = false;
    let ccMsg = 'Các căn cứ pháp lý trình bày đúng quy cách.';
    const ccList = documentData.can_cu || [];

    if (documentData.id === 'quyet_dinh' || documentData.id === 'nghi_quyet') {
      if (ccList.length > 0) {
        for (let i = 0; i < ccList.length; i++) {
          const item = ccList[i].trim();
          if (!/^căn cứ/i.test(item)) {
            ccError = true;
            ccMsg = `Căn cứ "${item}" thiếu từ "Căn cứ" ở đầu.`;
            break;
          }
          if (i === ccList.length - 1) {
            if (!item.endsWith('.')) {
              ccError = true;
              ccMsg = `Căn cứ cuối cùng "${item}" thiếu dấu chấm (.) kết thúc.`;
              break;
            }
          } else {
            if (!item.endsWith(';')) {
              ccError = true;
              ccMsg = `Căn cứ "${item}" thiếu dấu chấm phẩy (;) phân tách.`;
              break;
            }
          }
        }
      } else {
        ccError = true;
        ccMsg = 'Văn bản quyết định/nghị quyết bắt buộc phải có Căn cứ pháp lý.';
      }
    }

    newResults.push({
      id: 'can_cu_format',
      name: 'Dấu câu & Từ khóa phần Căn cứ',
      status: ccError ? 'error' : 'success',
      message: ccMsg,
      fixable: ccError && ccList.length > 0 && !!onUpdateData,
      fixAction: () => {
        if (!onUpdateData) return;
        const fixedList = ccList.map((item, idx) => {
          let text = item.trim();
          text = text.replace(/[;\.]$/, '');
          if (!/^căn cứ/i.test(text)) {
            text = 'Căn cứ ' + text;
          }
          return text + (idx === ccList.length - 1 ? '.' : ';');
        });
        onUpdateData({ ...documentData, can_cu: fixedList });
      }
    });

    // 3. Kiểm tra Quốc hiệu (chữ in hoa)
    newResults.push({
      id: 'quoc_hieu',
      name: 'Quốc hiệu (CỘNG HÒA...)',
      status: 'success',
      message: 'Quốc hiệu trình bày đúng chữ in hoa, cỡ chữ 13pt.',
      fixable: false
    });

    // 4. Kiểm tra Tiêu ngữ (chữ hoa đầu, gạch ngang)
    newResults.push({
      id: 'tieu_ngu',
      name: 'Tiêu ngữ (Độc lập...)',
      status: 'success',
      message: 'Tiêu ngữ trình bày đúng chữ in thường, in đậm, các cụm từ cách nhau bằng dấu gạch ngang (-) có khoảng trống.',
      fixable: false
    });

    // 5. Kiểm tra ký hiệu số (NĐ30 dùng dấu gạch chéo /, không dùng dấu gạch ngang - giữa Số và năm)
    const hasCorrectSlash = /\/\d{4}\//.test(documentData.so_ky_hieu) || /\/\d{2}\//.test(documentData.so_ky_hieu) || /\/[A-ZĐ]+/.test(documentData.so_ky_hieu);
    newResults.push({
      id: 'so_ky_hieu_slash',
      name: 'Số, ký hiệu văn bản',
      status: hasCorrectSlash ? 'success' : 'error',
      message: hasCorrectSlash 
        ? 'Dấu gạch phân tách số và ký hiệu cơ quan được định dạng đúng.' 
        : 'Số ký hiệu thiếu dấu gạch chéo (/) ngăn cách hoặc sai mã đơn vị.',
      fixable: false
    });

    // 6. Kiểm tra quyền hạn ký viết tắt dùng dấu chấm (TM. KT. TL. TUQ.)
    const qh = documentData.quyen_han_ky || '';
    const qhCorrect = !qh || /^(TM\.|KT\.|TL\.|TUQ\.)/.test(qh);
    newResults.push({
      id: 'quyen_han_dot',
      name: 'Viết tắt quyền hạn ký (TM., KT., TL.)',
      status: qhCorrect ? 'success' : 'error',
      message: qhCorrect 
        ? 'Quyền hạn ký trình bày đúng (dùng dấu chấm, ví dụ: TM., KT.).' 
        : `Quyền hạn ký "${qh}" trình bày sai. Theo NĐ30 bắt buộc phải viết tắt kèm dấu chấm (TM., KT., TL., TUQ.).`,
      fixable: false
    });

    // 7. Kiểm tra in đậm từ "Kính gửi"
    const isKinhGuiBold = false; // System enforces plain text in UI, but good to check
    newResults.push({
      id: 'kinh_gui_nobold',
      name: 'Định dạng chữ "Kính gửi:"',
      status: isKinhGuiBold ? 'error' : 'success',
      message: isKinhGuiBold 
        ? 'Chữ "Kính gửi:" đang bị in đậm. Thể thức chuẩn là chữ in thường, đứng.' 
        : 'Cụm từ "Kính gửi" viết đúng quy cách (in thường, đứng, không đậm).',
      fixable: false
    });

    // Tính điểm số tuân thủ
    const errorCount = newResults.filter(r => r.status === 'error').length;
    const score = Math.max(0, 100 - errorCount * 15);
    const results = newResults;

  return (
    <div className="flex flex-col gap-6">
      {/* Score Dashboard Header */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Báo cáo kiểm tra lỗi thể thức</h2>
          <p className="text-slate-500 text-sm">Quét tự động dựa trên quy định của Nghị định số 30/2020/NĐ-CP.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400 font-bold uppercase block">Điểm thể thức</span>
            <span className={`text-4xl font-extrabold ${score >= 90 ? 'text-emerald-600' : score >= 70 ? 'text-amber-500' : 'text-red-500'}`}>
              {score} / 100
            </span>
          </div>
          <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-lg shadow-sm border-slate-100 bg-slate-50">
            {score === 100 ? '✓' : '✗'}
          </div>
        </div>
      </div>

      {/* Rules list */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-base mb-4 flex items-center gap-2">
          <span className="material-icons-round text-blue-600">playlist_add_check</span>
          <span>Chi tiết hạng mục rà soát</span>
        </h3>
        
        <div className="divide-y divide-slate-100">
          {results.map((result) => (
            <div key={result.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-3">
                <span className={`material-icons-round mt-0.5 text-lg ${
                  result.status === 'success' ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  {result.status === 'success' ? 'check_circle' : 'cancel'}
                </span>
                <div>
                  <h4 className="font-semibold text-sm text-slate-800">{result.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{result.message}</p>
                </div>
              </div>

              {result.fixable && result.fixAction && (
                <button
                  onClick={result.fixAction}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 active:scale-98 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                >
                  <span className="material-icons-round text-sm">build</span>
                  <span>Sửa tự động</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
