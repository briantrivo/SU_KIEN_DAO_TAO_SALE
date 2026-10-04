# HƯỚNG DẪN SỬ DỤNG & VẬN HÀNH WEBSITE OHANA AFFILIATE 2026

Chào bạn, website **Ohana Affiliate Đào Tạo Sale & Network 2026** đã được xây dựng hoàn chỉnh với đầy đủ tính năng:
1. **Giao diện Landing Page cao cấp:** Phong cách vũ trụ sang trọng, hiệu ứng Ken-Burns sống động, đếm ngược thời gian, timeline lịch trình, hình ảnh địa điểm Siha The Happy Place và thẻ diễn giả Võ Quốc Trí, Nguyễn Thanh Sơn.
2. **Form Đăng Ký Giữ Chỗ & Mã QR Chuyển Khoản (VietQR):** Khách điền thông tin và có thể quét QR thanh toán vé VIP 500.000đ ngay.
3. **Hệ thống CRM Quản Lý Khách Hàng:** Quản lý danh sách đăng ký theo thời gian thực tại `/admin`.
4. **Tự động đồng bộ Google Sheets & Xuất File Excel:** Giúp quản lý và chia sẻ dữ liệu dễ dàng cho đội ngũ chăm sóc khách hàng.

---

## 📌 1. Thông Tin Sự Kiện Đã Được Cấu Hình

- **Tên sự kiện:** Ohana Affiliate Đào Tạo Sale & Network
- **Chủ đề chính:** Đột phá hiệu suất – Làm chủ kỷ nguyên Affiliate Ohana Super App
- **Thời gian:** 13h30 – 21h00, Chủ Nhật ngày 11/10/2026
- **Địa điểm:** Siha - Cafe, Bar & Eatery – 158 Nguyễn Đình Chính, Phú Nhuận, Hồ Chí Minh
- **Google Maps:** [https://maps.app.goo.gl/b5eNPSRiXaansPj3A](https://maps.app.goo.gl/b5eNPSRiXaansPj3A)
- **Diễn giả:**
  - **Võ Quốc Trí:** Giám Đốc Phát Triển Thị Trường Astronixa Việt Nam (Phụ trách: Chương trình Affiliate Ohana Career 14h30 - 15h30)
  - **Nguyễn Thanh Sơn:** Co-Founder & COO Astronixa Châu Á Thái Bình Dương (Phụ trách: Con Đường Sự Nghiệp 15h30 - 16h30)
- **Thư mời VIP:** 500.000đ (Bao gồm Vé Hội trường & Tiệc tối giao lưu 17h30 - 21h00)
- **Hotline Ban tổ chức:** 0931 332 671

---

## 💻 2. Khởi Động Website Cục Bộ

Mở Terminal tại thư mục `12-ohana-affiliate-training` và chạy lệnh:

```bash
npm install
node server.js
```

Sau đó mở trình duyệt truy cập:
- **Trang chủ:** [http://localhost:3001](http://localhost:3001)
- **Trang CRM Quản Trị:** [http://localhost:3001/admin](http://localhost:3001/admin) *(Mật khẩu mặc định: `astronixa2026`)*

---

## 📊 3. Hướng Dẫn Kết Nối Google Sheet Tự Động

1. Mở file [google_sheet_script.js](file:///d:/AI%20AGENT%20ANTIGRAVITY/12-ohana-affiliate-training/google_sheet_script.js).
2. Tạo 1 file Google Sheet mới trên Google Drive của bạn.
3. Vào menu **Tiện ích mở rộng (Extensions) -> Apps Script**, dán toàn bộ mã nguồn trong file `google_sheet_script.js` vào.
4. Bấm **Triển khai (Deploy) -> Tùy chọn triển khai mới (New deployment) -> Loại: Ứng dụng web (Web app)**:
   - Thực thi dưới dạng (Execute as): **Tôi (Me)**
   - Ai có quyền truy cập (Who has access): **Bất kỳ ai (Anyone)**
5. Nhận đường link Web App (kết thúc bằng `/exec`) và dán vào biến `GOOGLE_SHEET_WEBHOOK_URL` trong file `.env` hoặc cài đặt môi trường trên Vercel.

---

## 🚀 4. Hướng Dẫn Đưa Lên Vercel (Deploy)

Bạn có thể liên kết thư mục này với GitHub hoặc chạy lệnh:

```bash
npx vercel --prod
```
Website sẽ hoạt động 24/7 trên tên miền miễn phí của Vercel (ví dụ: `ohana-affiliate-2026.vercel.app`).
