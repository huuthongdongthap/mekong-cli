import { Injectable, Logger } from '@nestjs/common'
import * as puppeteer from 'puppeteer'
import { CertificateData } from './pdf.types'

@Injectable()
export class PdfGenerationService {
  private readonly logger = new Logger(PdfGenerationService.name)

  async generateCertificate(data: CertificateData): Promise<Buffer> {
    const html = this.renderCertificateTemplate(data)

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    try {
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'networkidle0' })

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '25mm',
          right: '25mm',
          bottom: '25mm',
          left: '25mm',
        },
      })

      this.logger.log(`PDF generated for certificate: ${data.certificateNumber}`)
      return pdf
    } finally {
      await browser.close()
    }
  }

  async generateTranscript(data: any): Promise<Buffer> {
    const html = this.renderTranscriptTemplate(data)

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    try {
      const page = await browser.newPage()
      await page.setContent(html, { waitUntil: 'networkidle0' })

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm',
        },
      })

      return pdf
    } finally {
      await browser.close()
    }
  }

  private renderCertificateTemplate(data: CertificateData): string {
    const formatDate = (date: Date | string) => {
      const d = new Date(date)
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    }

    return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <style>
    @page { margin: 0; size: A4; }
    * { box-sizing: border-box; }
    body {
      margin: 0; padding: 0;
      font-family: 'Times New Roman', 'DejaVu Serif', serif;
      font-size: 13px;
      line-height: 1.6;
      color: #1a1a2e;
    }
    .certificate {
      border: 3px solid #1e3a5f;
      border-radius: 8px;
      padding: 50px 60px;
      max-width: 794px;
      margin: 0 auto;
      background: #ffffff;
      position: relative;
    }
    .certificate::before {
      content: '';
      position: absolute;
      top: 15px; left: 15px; right: 15px; bottom: 15px;
      border: 1px solid #1e3a5f;
      border-radius: 4px;
      pointer-events: none;
    }
    .header { text-align: center; margin-bottom: 40px; position: relative; z-index: 1; }
    .logo-placeholder {
      width: 80px; height: 80px;
      border: 2px dashed #1e3a5f;
      border-radius: 50%;
      margin: 0 auto 20px;
      display: flex; align-items: center; justify-content: center;
      color: #1e3a5f; font-size: 11px;
    }
    h1 {
      color: #1e3a5f;
      font-size: 34px;
      font-weight: bold;
      margin: 0 0 8px;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .subtitle {
      color: #4a5568;
      font-size: 16px;
      font-style: italic;
      margin: 0;
    }
    .cert-number {
      font-size: 13px;
      color: #718096;
      margin-top: 16px;
      font-family: monospace;
    }
    .content { position: relative; z-index: 1; }
    .declaration { text-align: center; margin: 30px 0; font-size: 15px; }
    .student-name {
      font-size: 22px;
      font-weight: bold;
      color: #1e3a5f;
      text-transform: uppercase;
      text-align: center;
      margin: 20px 0;
      letter-spacing: 0.5px;
    }
    .info-grid { display: grid; grid-template-columns: 200px 1fr; gap: 12px 16px; margin: 30px 0; }
    .info-row { display: contents; }
    .label {
      font-weight: 600;
      color: #2d3748;
      padding-right: 8px;
    }
    .value {
      color: #1e3a5f;
      font-weight: 500;
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #1e3a5f;
      text-transform: uppercase;
      margin: 30px 0 15px;
      padding-bottom: 5px;
      border-bottom: 1px solid #e2e8f0;
    }
    .skills-list, .achievements-list {
      display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;
    }
    .badge {
      background: #ebf4ff; color: #1e3a5f;
      padding: 4px 12px; border-radius: 20px;
      font-size: 12px; border: 1px solid #bee3f8;
    }
    .footer { margin-top: 50px; display: flex; justify-content: space-between; position: relative; z-index: 1; }
    .issue-info { text-align: left; }
    .issue-info p { margin: 6px 0; }
    .qr-container { width: 100px; height: 100px; border: 1px dashed #cbd5e0; display: flex; align-items: center; justify-content: center; }
    .qr-container img { max-width: 90px; max-height: 90px; }
    .signatures { display: flex; justify-content: space-between; margin-top: 60px; position: relative; z-index: 1; }
    .sig-block { text-align: center; width: 220px; }
    .sig-line {
      border-top: 1.5px solid #1e3a5f;
      margin-top: 50px;
      padding-top: 8px;
      font-weight: 600;
      color: #1e3a5f;
      font-size: 13px;
    }
    .sig-title { font-size: 12px; color: #718096; margin-top: 4px; }
    .watermark {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) rotate(-25deg);
      font-size: 120px;
      color: rgba(30, 58, 95, 0.03);
      font-weight: bold;
      pointer-events: none;
      z-index: 0;
      white-space: nowrap;
    }
    @media print {
      .certificate { border: none; box-shadow: none; }
      .certificate::before { border: 3px solid #1e3a5f; }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="watermark">CERTIFIED</div>
    <div class="header">
      <div class="logo-placeholder">LOGO</div>
      <h1>CHỨNG NHẬN THỰC TẬP</h1>
      <p class="subtitle">INTERNSHIP CERTIFICATE</p>
      <p class="cert-number">Số: ${data.certificateNumber}</p>
    </div>
    <div class="content">
      <p class="declaration">Chúng tôi xin chứng nhận rằng</p>
      <p class="student-name">${data.learnerName}</p>
      <p class="declaration">Đã hoàn thành chương trình thực tập tại</p>
      <div class="info-grid">
        <span class="label">Doanh nghiệp:</span>
        <span class="value">${data.enterpriseName} (MST: ${data.enterpriseTaxCode})</span>
        <span class="label">Chương trình:</span>
        <span class="value">${data.programName} (${data.programField})</span>
        <span class="label">Thời gian:</span>
        <span class="value">${formatDate(data.startDate)} - ${formatDate(data.endDate)}</span>
        <span class="label">Tổng số giờ:</span>
        <span class="value">${data.totalHours} giờ</span>
        <span class="label">Vị trí:</span>
        <span class="value">${data.position}${data.department ? ' - ' + data.department : ''}</span>
        <span class="label">Người hướng dẫn:</span>
        <span class="value">${data.supervisorName}${data.supervisorTitle ? ' - ' + data.supervisorTitle : ''}</span>
        ${data.evaluationScore !== undefined ? `
        <span class="label">Đánh giá:</span>
        <span class="value">${data.evaluationScore}/100${data.evaluationComment ? ' - ' + data.evaluationComment : ''}</span>
        ` : ''}
      </div>

      ${(data.skillsAcquired?.length || 0) > 0 ? `
      <div class="section-title">Kỹ năng đã 습득</div>
      <div class="skills-list">
        ${data.skillsAcquired.map(s => `<span class="badge">${s}</span>`).join('')}
      </div>
      ` : ''}

      ${(data.achievements?.length || 0) > 0 ? `
      <div class="section-title">Thành tích nổi bật</div>
      <div class="achievements-list">
        ${data.achievements.map(a => `<span class="badge">${a}</span>`).join('')}
      </div>
      ` : ''}

      <p style="margin-top: 30px; text-align: justify; color: #4a5568;">
        Chương trình thực tập này được thực hiện trong khuôn khổ hợp tác đào tạo liên kết giữa Nhà trường và Doanh nghiệp,
        tuân thủ quy định của Bộ Lao động - Thương binh và Xã hội và Bộ Giáo dục và Đào tạo.
      </p>
    </div>
    <div class="footer">
      <div class="issue-info">
        <p><strong>Ngày cấp:</strong> ${formatDate(data.issueDate)}</p>
        <p><strong>Nơi cấp:</strong> LinkEduVN Platform</p>
      </div>
      <div class="qr-container">
        ${data.qrCodeUrl ? `<img src="${data.qrCodeUrl}" alt="QR Code">` : '<span style="font-size:10px;color:#a0aec0;">QR Code</span>'}
      </div>
    </div>
    <div class="signatures">
      <div class="sig-block">
        <div class="sig-line">NGƯỜI HƯỚNG DẪN</div>
        <div class="sig-title">${data.supervisorName}</div>
      </div>
      <div class="sig-block">
        <div class="sig-line">NGƯỜI CẤP CHỨNG NHẬN</div>
        <div class="sig-title">LinkEduVN</div>
      </div>
      <div class="sig-block">
        <div class="sig-line">ĐẠI DIỆN DOANH NGHIỆP</div>
        <div class="sig-title">Ký và đóng dấu</div>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim()
  }

  private renderTranscriptTemplate(data: any): string {
    return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 30px; font-size: 12px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { margin: 0; font-size: 24px; color: #1e3a5f; }
    .header p { margin: 5px 0; color: #4a5568; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
    th { background: #1e3a5f; color: white; font-weight: 600; }
    tr:nth-child(even) td { background: #f7fafc; }
    .info { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
    .info-label { font-weight: bold; color: #2d3748; }
  </style>
</head>
<body>
  <div class="header">
    <h1>BẢNG ĐIỂM HỌC TẬP</h1>
    <p>ACADEMIC TRANSCRIPT</p>
  </div>
  <div class="info">
    <span class="info-label">Học sinh:</span><span>${data.learnerName}</span>
    <span class="info-label">Mã học viên:</span><span>${data.learnerCode}</span>
    <span class="info-label">Ngành:</span><span>${data.fieldOfStudy}</span>
    <span class="info-label">Khóa:</span><span>${data.cohort}</span>
  </div>
  <table>
    <thead>
      <tr>
        <th>STT</th>
        <th>Môn học</th>
        <th>Số tín chỉ</th>
        <th>Điểm QTH</th>
        <th>Điểm thi</th>
        <th>Điểm HP</th>
        <th>Kết quả</th>
      </tr>
    </thead>
    <tbody>
      ${data.subjects.map((s: any, i: number) => `
      <tr>
        <td>${i + 1}</td>
        <td>${s.name}</td>
        <td style="text-align:center">${s.credits}</td>
        <td style="text-align:center">${s.midtermScore ?? ''}</td>
        <td style="text-align:center">${s.finalScore ?? ''}</td>
        <td style="text-align:center"><strong>${s.totalScore}</strong></td>
        <td style="text-align:center">${s.passed ? 'Đạt' : 'Không đạt'}</td>
      </tr>`).join('')}
    </tbody>
  </table>
  <p><strong>GPA:</strong> ${data.gpa} | <strong>Tổng tín chỉ tích lũy:</strong> ${data.totalCredits}</p>
  <p style="margin-top: 40px; text-align: right;">Đại diện Nhà trường<br><br><br>____________________</p>
</body>
</html>
    `.trim()
  }
}