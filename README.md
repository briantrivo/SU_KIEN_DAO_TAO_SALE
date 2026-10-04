# OHANA AFFILIATE ĐÀO TẠO SALE & NETWORK 2026

Website sự kiện và hệ thống quản lý đăng ký (CRM) cho chương trình **Ohana Affiliate Đào Tạo Sale & Network** tổ chức vào ngày **11/10/2026** tại **Siha - The Happy Place** (Tầng M Home Hotel, 158 Nguyễn Đình Chính, P.8, Q. Phú Nhuận, TP.HCM).

## 🚀 Cấu trúc dự án

- `public/index.html`: Landing page sự kiện giao diện sang trọng, hiệu ứng vũ trụ lung linh, timeline chi tiết, hình ảnh diễn giả & địa điểm, form đăng ký kèm VietQR thanh toán.
- `public/admin.html`: Bảng điều khiển CRM thời gian thực để quản lý danh sách đăng ký, tìm kiếm, cập nhật trạng thái/ghi chú và xuất file Excel/CSV.
- `public/images/`: Chứa hình ảnh diễn giả Võ Quốc Trí, Nguyễn Thanh Sơn, ảnh Siha The Happy Place và logo thương hiệu.
- `server.js`: Máy chủ Express cung cấp API đăng ký, CRM, xuất Excel và tích hợp Webhook Google Sheet.
- `api/index.js`: Điểm kích hoạt Vercel Serverless Function.
- `vercel.json`: Cấu hình triển khai Vercel.
- `google_sheet_script.js`: Mã nguồn Google Apps Script đồng bộ tự động sang Google Sheet.

## 🛠️ Chạy cục bộ (Local Development)

```bash
cd 12-ohana-affiliate-training
npm install
node server.js
```

- **Trang chủ sự kiện:** `http://localhost:3000`
- **Trang quản trị CRM:** `http://localhost:3000/admin`
- **Mật khẩu quản trị mặc định:** `astronixa2026`

## 🌐 Triển khai lên Vercel

```bash
vercel --prod
```
