/**
 * GOOGLE APPS SCRIPT CHO GOOGLE SHEET ĐỒNG BỘ ĐĂNG KÝ SỰ KIỆN OHANA AFFILIATE 2026
 * 
 * Hướng dẫn cài đặt:
 * 1. Mở Google Sheet mới hoặc trang tính hiện có.
 * 2. Đặt tiêu đề hàng 1 các cột:
 *    A: Thời gian | B: Họ tên | C: Số điện thoại | D: Email | E: Đơn vị/Nghề nghiệp | F: Hạng vé | G: Số lượng | H: Sự kiện | I: Nguồn | J: Ghi chú
 * 3. Vào menu: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 4. Dán toàn bộ mã nguồn bên dưới vào và Lưu lại.
 * 5. Bấm Triển khai (Deploy) -> Tùy chọn triển khai mới (New deployment) -> Loại: Ứng dụng web (Web app).
 * 6. Thiết lập:
 *    - Thực thi dưới dạng (Execute as): Tôi (Me)
 *    - Ai có quyền truy cập (Who has access): Bất kỳ ai (Anyone)
 * 7. Bấm Triển khai -> Sao chép URL Web App nhận được và dán vào file .env hoặc cấu hình Vercel biến:
 *    GOOGLE_SHEET_WEBHOOK_URL = [URL của bạn]
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    // Chuẩn bị dữ liệu từng hàng
    var row = [
      data.time || new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      data.full_name || '',
      "'" + (data.phone || ''), // Thêm dấu ' để không mất số 0 đầu
      data.email || '',
      data.company || '',
      data.ticket || 'VIP',
      data.attendees || 1,
      data.event || 'Ohana Affiliate Đào Tạo Sale & Network 2026',
      data.source || 'Website',
      data.note || 'Mới đăng ký'
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ "status": "active", "service": "Ohana Affiliate 2026 Sync" }))
    .setMimeType(ContentService.MimeType.JSON);
}
