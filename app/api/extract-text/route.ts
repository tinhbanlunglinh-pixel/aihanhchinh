import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Fix ESM/Turbopack import issue with pdf-parse in Next.js 
const pdfParse = typeof window === 'undefined' ? eval("require('pdf-parse')") : null;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = '';

    if (file.name.endsWith('.docx')) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (file.name.endsWith('.pdf')) {
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else if (file.name.endsWith('.txt')) {
      extractedText = buffer.toString('utf-8');
    } else {
      return NextResponse.json({ error: 'Định dạng file không được hỗ trợ. Vui lòng tải lên file .docx, .pdf hoặc .txt.' }, { status: 400 });
    }

    return NextResponse.json({ text: extractedText });
  } catch (error: any) {
    console.error('Lỗi khi trích xuất text:', error);
    return NextResponse.json({ error: 'Lỗi khi trích xuất nội dung file: ' + error.message }, { status: 500 });
  }
}
