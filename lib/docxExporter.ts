import { 
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
  BorderStyle, WidthType, AlignmentType, Header, PageNumber, LineRuleType
} from 'docx';
import { DocTemplate } from './templateData';

// Detect major heading lines (Roman numeral or numbered headings in ALL CAPS)
function isHeadingLine(text: string): boolean {
  const trimmed = text.trim();
  // Roman numeral headings: I. II. III. IV. V. etc followed by uppercase
  if (/^(I{1,3}|IV|VI{0,3}|IX|X{0,3})[\.\)]\s+[A-ZÀ-ỹĐ]/.test(trimmed)) return true;
  // Section headings like 'Phần I', 'Phần II'
  if (/^Phần\s+(I|II|III|IV|V|thứ)/i.test(trimmed)) return true;
  return false;
}

// ====== KHAI BÁO HẰNG SỐ THỂ THỨC (NĐ30) ======
const FONT_NAME = 'Times New Roman';

function formatDocDate(dateStr?: string): string {
  if (!dateStr) {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    return `ngày ${dd} tháng ${mm} năm ${yyyy}`;
  }
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const yyyy = parts[0];
    const mm = parts[1];
    const dd = parts[2];
    return `ngày ${dd} tháng ${mm} năm ${yyyy}`;
  }
  return dateStr;
}

const BORDERS_NONE = {
  top: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  left: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  right: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'auto' },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: 'auto' },
};

// Hàm xuất file .docx từ dữ liệu văn bản
export async function exportToDocx(data: DocTemplate): Promise<Blob> {
  const loai = data.id || 'cong_van';
  const children: (Paragraph | Table)[] = [];

  // === 1. DỰNG HEADER (Table 2 cột x 2 dòng ẩn viền) ===
  const headerTable = new Table({
    width: { size: 9071, type: WidthType.DXA }, // Chiều rộng nội dung = 11906 - 1701 - 1134 = 9071 dxa
    borders: BORDERS_NONE,
    columnWidths: [3500, 5571],
    rows: [
      // Dòng 1: Cơ quan (Trái) & Quốc hiệu (Phải)
      new TableRow({
        children: [
          new TableCell({
            width: { size: 3500, type: WidthType.DXA },
            borders: BORDERS_NONE,
            children: [
              ...(data.co_quan_chu_quan ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: data.co_quan_chu_quan.toUpperCase(), font: FONT_NAME, size: 24 })] // 12pt
                })
              ] : []),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: data.co_quan_ban_hanh.toUpperCase(), font: FONT_NAME, size: 24, bold: true })] // 12pt bold
              }),
              // Đường gạch 1/3 dưới cơ quan
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 20, after: 0 },
                border: { top: { style: BorderStyle.SINGLE, size: 2, color: '000000', space: 1 } },
                indent: { left: 1200, right: 1200 },
                children: []
              })
            ]
          }),
          new TableCell({
            width: { size: 5571, type: WidthType.DXA },
            borders: BORDERS_NONE,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', font: FONT_NAME, size: 26, bold: true })] // 13pt bold
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: 'Độc lập - Tự do - Hạnh phúc', font: FONT_NAME, size: 28, bold: true })] // 14pt bold
              }),
              // Đường gạch dưới Quốc hiệu
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 20, after: 0 },
                border: { top: { style: BorderStyle.SINGLE, size: 2, color: '000000', space: 1 } },
                indent: { left: 1100, right: 1100 },
                children: []
              })
            ]
          })
        ]
      }),
      // Dòng 2: Số hiệu (Trái) & Địa danh ngày tháng (Phải)
      new TableRow({
        children: [
          new TableCell({
            width: { size: 3500, type: WidthType.DXA },
            borders: BORDERS_NONE,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 120 },
                children: [new TextRun({ text: data.so_ky_hieu, font: FONT_NAME, size: 26 })] // 13pt
              }),
              // Nếu là công văn thì trích yếu 'V/v...' nằm ngay dưới Số
              ...(loai === 'cong_van' ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 40 },
                  children: [new TextRun({ text: data.trich_yeu, font: FONT_NAME, size: 24, italics: false })] // 12pt
                })
              ] : [])
            ]
          }),
          new TableCell({
            width: { size: 5571, type: WidthType.DXA },
            borders: BORDERS_NONE,
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 120 },
                children: [
                  new TextRun({ 
                    text: `${data.dia_danh}, ${formatDocDate(data.ngay_ban_hanh)}`, 
                    font: FONT_NAME, 
                    size: 28, 
                    italics: true 
                  })
                ] // 14pt italic
              })
            ]
          })
        ]
      })
    ]
  });
  children.push(headerTable);

  // Khoảng cách sau header
  children.push(new Paragraph({ spacing: { before: 360 } }));

  // === 2. DỰNG TIÊU ĐỀ GIỮA TRANG (Nếu KHÔNG PHẢI công văn) ===
  if (loai !== 'cong_van') {
    const loaiLabel = data.name.toUpperCase();
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: loaiLabel, font: FONT_NAME, size: 28, bold: true })] // 14pt bold
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: data.trich_yeu, font: FONT_NAME, size: 28, bold: true, italics: true })] // 14pt bold italic
      }),
      // Kẻ vạch tiêu đề
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: { top: { style: BorderStyle.SINGLE, size: 4, color: '000000', space: 1 } },
        indent: { left: 3500, right: 3500 },
        children: []
      }),
      new Paragraph({ spacing: { before: 240 } })
    );
  }

  // === 3. KÍNH GỬI (Cho Công văn / Tờ trình) ===
  if ((loai === 'cong_van' || loai === 'to_trinh') && data.kinh_gui && data.kinh_gui.length > 0) {
    const kgParagraphs = data.kinh_gui.map((kg, idx) => {
      return new Paragraph({
        indent: { left: 720 }, // Thụt lề kính gửi
        spacing: { before: 120, after: 60 },
        children: [
          new TextRun({ 
            text: idx === 0 ? `Kính gửi: ${kg}` : `              ${kg}`, 
            font: FONT_NAME, 
            size: 28 
          }) // 14pt thường
        ]
      });
    });
    children.push(...kgParagraphs);
    children.push(new Paragraph({ spacing: { before: 120 } }));
  }

  // === 4. CĂN CỨ & ĐỒNG QUYẾT ĐỊNH (Cho Quyết định / Nghị quyết) ===
  if ((loai === 'quyet_dinh' || loai === 'nghi_quyet') && data.can_cu && data.can_cu.length > 0) {
    const ccParagraphs = data.can_cu.map(cc => {
      let text = cc;
      if (!/^căn cứ/i.test(text) && !/^xét/i.test(text) && !/^theo/i.test(text)) text = 'Căn cứ ' + text;
      return new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        indent: { firstLine: 720 }, // Thụt dòng đầu 1.27cm (NĐ30)
        spacing: { before: 80, after: 80 },
        children: [new TextRun({ text: text, font: FONT_NAME, size: 28, italics: true })] // 14pt italic
      });
    });
    children.push(...ccParagraphs);

    if (data.theo_de_nghi) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          indent: { firstLine: 720 },
          spacing: { before: 80, after: 120 },
          children: [new TextRun({ text: data.theo_de_nghi, font: FONT_NAME, size: 28, italics: true })]
        })
      );
    }

    // Dòng "QUYẾT ĐỊNH:"
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 180, after: 180 },
        children: [new TextRun({ text: data.dong_quyet_dinh || 'QUYẾT ĐỊNH:', font: FONT_NAME, size: 28, bold: true })]
      })
    );
  }

  // === 5. NỘI DUNG CHÍNH (BODY TEXT) ===
  const lines = data.noi_dung.split('\n');
  const bodyParagraphs = lines.map((pText, index) => {
    let formattedText = pText.trim();
    
    // Check if this line is the absolute end of the document text
    const hasCacDieu = (loai === 'quyet_dinh' || loai === 'nghi_quyet') && data.cac_dieu && data.cac_dieu.length > 0;
    const isLastBodyLine = index === lines.length - 1;
    const isDocEnd = isLastBodyLine && !hasCacDieu;

    if (isDocEnd) {
      // Ensure the very end of the document has "./."
      if (formattedText && !formattedText.endsWith('./.')) {
        if (formattedText.endsWith('.')) {
          formattedText = formattedText.substring(0, formattedText.length - 1) + './.';
        } else {
          formattedText += './.';
        }
      }
    } else {
      // Intermediate body lines: must NOT end with "./."
      if (formattedText && formattedText.endsWith('./.')) {
        formattedText = formattedText.substring(0, formattedText.length - 3).trim();
        if (!formattedText.endsWith('.') && !formattedText.endsWith(':') && !formattedText.endsWith(';') && !formattedText.endsWith('?')) {
          formattedText += '.';
        }
      }
    }

    const isMajorHeading = /^\s*(I{1,3}|IV|VI{0,3}|IX|X{0,3})[\.\)]\s+[A-ZÀ-ỹĐ]/.test(formattedText.trim());
    const isCenterHeading = /^Phần\s+(I|II|III|IV|V|thứ)/i.test(formattedText.trim());
    const heading = isMajorHeading || isCenterHeading;
    const isList = formattedText.startsWith('-') || formattedText.startsWith('+');

    return new Paragraph({
      alignment: heading ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
      indent: heading ? undefined : (isList ? { left: 720 } : { firstLine: 720 }), 
      spacing: { before: 120, after: 120, line: 360, lineRule: LineRuleType.AUTO }, 
      children: [new TextRun({ text: formattedText, font: FONT_NAME, size: 28, bold: heading })]
    });
  });
  children.push(...bodyParagraphs);

  // === 6. CÁC ĐIỀU KHOẢN (Cho Quyết định / Nghị quyết) ===
  if ((loai === 'quyet_dinh' || loai === 'nghi_quyet') && data.cac_dieu && data.cac_dieu.length > 0) {
    const dieuParagraphs = data.cac_dieu.map((dieu, idx) => {
      let text = dieu.trim();
      const prefixPattern = new RegExp(`^Điều\\s+${idx + 1}[\\s\\.:]`, 'i');
      if (!prefixPattern.test(text)) {
        text = `Điều ${idx + 1}. ${text}`;
      }
      
      const label = `Điều ${idx + 1}. `;
      const content = text.replace(prefixPattern, '').trim();

      // Đảm bảo kết thúc bằng ./. cho điều cuối cùng, và các điều trước đó không có ./.
      let finalContent = content;
      if (idx === data.cac_dieu!.length - 1) {
        if (finalContent.endsWith('./.')) {
          // Already correct
        } else if (finalContent.endsWith('.')) {
          finalContent = finalContent.substring(0, finalContent.length - 1) + './.';
        } else {
          finalContent += './.';
        }
      } else {
        if (finalContent.endsWith('./.')) {
          finalContent = finalContent.substring(0, finalContent.length - 3).trim();
          if (!finalContent.endsWith('.') && !finalContent.endsWith(':') && !finalContent.endsWith(';') && !finalContent.endsWith('?')) {
            finalContent += '.';
          }
        }
      }

      return new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        indent: { firstLine: 720 }, // Thụt dòng đầu 1.27cm (NĐ30)
        spacing: { before: 120, after: 120, line: 360, lineRule: LineRuleType.AT_LEAST },
        children: [
          new TextRun({ text: label, font: FONT_NAME, size: 28, bold: true }),
          new TextRun({ text: finalContent, font: FONT_NAME, size: 28 })
        ]
      });
    });
    children.push(...dieuParagraphs);
  }

  // === 7. CHỮ KÝ & NƠI NHẬN (Table 2 cột ẩn viền ở chân trang) ===
  const sigTableWidth = 9071;
  const colLeft = 4000;
  const colRight = 5071;

  // Xây dựng nội dung cột nơi nhận
  const noiNhanChildren: (Paragraph | Table)[] = [];
  noiNhanChildren.push(
    new Paragraph({
      children: [new TextRun({ text: 'Nơi nhận:', font: FONT_NAME, size: 24, bold: true, italics: true })] // 12pt bold italic
    })
  );

  const noiNhanList = data.noi_nhan && data.noi_nhan.length > 0 ? data.noi_nhan : ['- Như trên;', '- Lưu: VT.'];
  noiNhanList.forEach((nn, idx) => {
    let text = nn.trim();
    if (!text.startsWith('-')) text = '- ' + text;
    
    // Rà soát dấu chấm phẩy và dấu chấm cho Nơi nhận
    if (idx === noiNhanList.length - 1) {
      if (!text.endsWith('.')) text += '.';
    } else {
      if (!text.endsWith(';')) text += ';';
    }

    noiNhanChildren.push(
      new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text: text, font: FONT_NAME, size: 22 })] // 11pt thường
      })
    );
  });

  // Xây dựng nội dung cột chữ ký
  const chuKyChildren: (Paragraph | Table)[] = [];
  
  if (loai === 'bien_ban') {
    // Biên bản họp có 2 chữ ký ngang hàng
    const halfWidth = Math.floor(sigTableWidth / 2);
    
    const buildSignCol = (label: string, name: string) => {
      const pList = [];
      pList.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: label.toUpperCase(), font: FONT_NAME, size: 28, bold: true })]
        })
      );
      // 4 dòng trống ký
      for (let i = 0; i < 4; i++) {
        pList.push(new Paragraph({ children: [new TextRun({ text: '' })] }));
      }
      pList.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: name, font: FONT_NAME, size: 28, bold: true })]
        })
      );
      return pList;
    };

    const doubleSigTable = new Table({
      width: { size: sigTableWidth, type: WidthType.DXA },
      borders: BORDERS_NONE,
      columnWidths: [halfWidth, halfWidth],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: halfWidth, type: WidthType.DXA },
              borders: BORDERS_NONE,
              children: buildSignCol(data.chuc_vu_ky || 'THƯ KÝ', data.nguoi_ky || '')
            }),
            new TableCell({
              width: { size: halfWidth, type: WidthType.DXA },
              borders: BORDERS_NONE,
              children: buildSignCol('CHỦ TRÌ', data.dong_quyet_dinh || 'Đỗ Chí Thanh')
            })
          ]
        })
      ]
    });
    
    children.push(new Paragraph({ spacing: { before: 360 } }));
    children.push(doubleSigTable);

  } else {
    // Văn bản thông thường (1 chữ ký góc phải)
    if (data.quyen_han_ky) {
      chuKyChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: data.quyen_han_ky.toUpperCase(), font: FONT_NAME, size: 26, bold: true })] // 13pt bold
        })
      );
    }
    if (data.kt_chuc_vu) {
      chuKyChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: data.kt_chuc_vu.toUpperCase(), font: FONT_NAME, size: 26, bold: true })]
        })
      );
    }
    chuKyChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ 
          text: data.chuc_vu_ky.toUpperCase(), 
          font: FONT_NAME, 
          size: 26, 
          bold: !(data.quyen_han_ky && data.kt_chuc_vu) // NĐ30: Chỉ in thường khi cả TL + KT đồng thời xuất hiện (combo 3 dòng)
        })]
      })
    );

    // 4 Paragraph rỗng tạo khoảng trống chữ ký chuẩn NĐ30
    for (let i = 0; i < 4; i++) {
      chuKyChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: '', font: FONT_NAME, size: 28 })]
        })
      );
    }

    // Họ tên người ký
    chuKyChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: data.nguoi_ky, font: FONT_NAME, size: 28, bold: true })] // 14pt bold
      })
    );

    // Dựng bảng chữ ký + nơi nhận
    const sigTable = new Table({
      width: { size: sigTableWidth, type: WidthType.DXA },
      borders: BORDERS_NONE,
      columnWidths: [colLeft, colRight],
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: colLeft, type: WidthType.DXA },
              borders: BORDERS_NONE,
              children: noiNhanChildren
            }),
            new TableCell({
              width: { size: colRight, type: WidthType.DXA },
              borders: BORDERS_NONE,
              children: chuKyChildren
            })
          ]
        })
      ]
    });

    children.push(new Paragraph({ spacing: { before: 360 } }));
    children.push(sigTable);
  }

  // === 8. THIẾT LẬP ĐÁNH SỐ TRANG TRÊN ĐẦU (Header bỏ trang 1) ===
  const pageNumberHeader = new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            children: [PageNumber.CURRENT],
            font: FONT_NAME,
            size: 28, // 14pt
          }),
        ],
      }),
    ],
  });

  // === 9. KHỞI TẠO ĐÓNG GÓI DOCUMENT ===
  const doc = new Document({
    sections: [
      {
        properties: {
          titlePage: true, // Trang đầu tiên không đánh số trang
          page: {
            margin: {
              top: 1134,    // 20mm
              bottom: 1134, // 20mm
              left: 1701,   // 30mm
              right: 1134,  // 20mm
            },
            size: {
              width: 11906,  // A4 Width
              height: 16838, // A4 Height
            }
          }
        },
        headers: {
          default: pageNumberHeader,
        },
        children: children
      }
    ]
  });

  return await Packer.toBlob(doc);
}
