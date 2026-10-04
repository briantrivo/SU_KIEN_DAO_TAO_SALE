const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'astronixa2026';
const DATA_FILE = process.env.VERCEL
  ? path.join('/tmp', 'leads.json')
  : path.join(__dirname, 'data', 'leads.json');
const INITIAL_DATA_FILE = path.join(__dirname, 'data', 'leads.json');
const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL || '';

// Helper: Forward lead data to Google Sheet Webhook
async function forwardToGoogleSheet(lead) {
  if (!GOOGLE_SHEET_WEBHOOK_URL) return;
  try {
    const payload = {
      time: new Date(lead.received_at || Date.now()).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      full_name: lead.full_name,
      phone: lead.phone,
      email: lead.email,
      company: lead.company,
      ticket: lead.ticket,
      attendees: lead.attendees,
      event: lead.event,
      source: [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(' / ') || lead.source,
      note: lead.note || 'Mới đăng ký'
    };

    if (typeof fetch === 'function') {
      const resp = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });
      const text = await resp.text();
      console.log('✅ Forwarded lead to Google Sheet:', lead.full_name, 'Response:', text.substring(0, 100));
    }
  } catch (err) {
    console.error('Google Sheet forward failed:', err.message);
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper: Ensure data directory and file exist
function getLeads() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      if (fs.existsSync(INITIAL_DATA_FILE)) {
        try {
          const initData = fs.readFileSync(INITIAL_DATA_FILE, 'utf8');
          fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
          fs.writeFileSync(DATA_FILE, initData, 'utf8');
          return JSON.parse(initData || '[]');
        } catch (_) {}
      }
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading leads:', err);
    return [];
  }
}

function saveLeads(leads) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving leads:', err);
    return false;
  }
}

// Admin Authentication Middleware
function checkAdminAuth(req, res, next) {
  const reqPw = req.headers['x-admin-password'] || req.query.pw;
  if (!reqPw || reqPw !== ADMIN_PASSWORD) {
    return res.status(401).json({ ok: false, error: 'Mật khẩu quản trị không chính xác hoặc đã hết hạn.' });
  }
  next();
}

// API: Public Config
app.get('/api/config', (req, res) => {
  res.json({
    ok: true,
    eventName: process.env.EVENT_NAME || 'Ohana Affiliate Đào Tạo Sale & Network',
    eventDate: process.env.EVENT_DATE || '2026-10-11',
    eventTime: process.env.EVENT_TIME || '13:30 - 21:00',
    eventLocation: process.env.EVENT_LOCATION || 'Siha - Cafe, Bar & Eatery - 158 Nguyễn Đình Chính, Phú Nhuận, Hồ Chí Minh',
    hotline: process.env.HOTLINE || '0931332671',
    hotlineDisplay: process.env.HOTLINE_DISPLAY || '0931 332 671',
    repName: process.env.REPRESENTATIVE_NAME || 'Võ Quốc Trí',
    repTitle: process.env.REPRESENTATIVE_TITLE || 'Giám Đốc Phát Triển Thị Trường Astronixa Việt Nam'
  });
});

// API: Register Lead
app.post('/api/leads', async (req, res) => {
  try {
    const {
      full_name,
      phone,
      email,
      company,
      ticket = 'VIP',
      attendees = '1',
      event = 'Ohana Affiliate Đào Tạo Sale & Network - 11/10/2026 - Siha The Happy Place',
      source = 'landing-page',
      website,
      utm_source,
      utm_medium,
      utm_campaign,
      submitted_at
    } = req.body;

    // Honeypot spam check
    if (website && website.trim().length > 0) {
      return res.status(400).json({ ok: false, error: 'Phát hiện yêu cầu bất thường.' });
    }

    if (!full_name || !phone) {
      return res.status(400).json({ ok: false, error: 'Vui lòng nhập đầy đủ Họ tên và Số điện thoại.' });
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 9 || cleanPhone.length > 13) {
      return res.status(400).json({ ok: false, error: 'Số điện thoại không hợp lệ. Vui lòng kiểm tra lại.' });
    }

    const leads = getLeads();
    const newLead = {
      id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      full_name: full_name.trim(),
      phone: cleanPhone,
      email: (email || '').trim(),
      company: (company || '').trim(),
      ticket: ticket || 'VIP',
      attendees: parseInt(attendees, 10) || 1,
      event: event,
      source: source,
      utm_source: utm_source || '',
      utm_medium: utm_medium || '',
      utm_campaign: utm_campaign || '',
      submitted_at: submitted_at || new Date().toISOString(),
      received_at: new Date().toISOString(),
      status: 'new', // new, contacted, confirmed, paid, cancelled
      note: ''
    };

    leads.unshift(newLead);
    saveLeads(leads);

    // Async forward to Google Sheet Webhook if configured
    forwardToGoogleSheet(newLead).catch(e => console.error('Forward lead failed:', e));

    return res.status(200).json({
      ok: true,
      message: 'Đăng ký thành công! Ban tổ chức sẽ liên hệ xác nhận trong 24 giờ.',
      lead_id: newLead.id
    });
  } catch (err) {
    console.error('Error handling lead submission:', err);
    return res.status(500).json({ ok: false, error: 'Có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại hoặc gọi Hotline.' });
  }
});

// API: Admin Get Leads
app.get('/api/leads', checkAdminAuth, (req, res) => {
  const leads = getLeads();
  res.json({
    ok: true,
    total: leads.length,
    leads: leads
  });
});

// API: Admin Update Lead (Status / Note)
app.patch('/api/leads/:id', checkAdminAuth, (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;
  const leads = getLeads();
  const index = leads.findIndex(l => l.id === id);

  if (index === -1) {
    return res.status(404).json({ ok: false, error: 'Không tìm thấy thông tin đăng ký.' });
  }

  if (status !== undefined) leads[index].status = status;
  if (note !== undefined) leads[index].note = note;
  leads[index].updated_at = new Date().toISOString();

  saveLeads(leads);
  res.json({ ok: true, lead: leads[index] });
});

// API: Admin Delete Lead
app.delete('/api/leads/:id', checkAdminAuth, (req, res) => {
  const { id } = req.params;
  let leads = getLeads();
  const initialLength = leads.length;
  leads = leads.filter(l => l.id !== id);

  if (leads.length === initialLength) {
    return res.status(404).json({ ok: false, error: 'Không tìm thấy khách hàng.' });
  }

  saveLeads(leads);
  res.json({ ok: true, message: 'Đã xóa đăng ký thành công.' });
});

// API: Export CSV
app.get('/api/export/csv', checkAdminAuth, (req, res) => {
  try {
    const leads = getLeads();
    const headers = [
      'STT',
      'Thời gian đăng ký',
      'Họ và tên',
      'Số điện thoại',
      'Email',
      'Công ty / Đơn vị',
      'Hạng vé',
      'Số lượng',
      'Trạng thái',
      'Ghi chú',
      'Nguồn UTM'
    ];

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      return '"' + String(str).replace(/"/g, '""') + '"';
    };

    const csvRows = [headers.join(',')];

    leads.forEach((l, idx) => {
      const row = [
        idx + 1,
        new Date(l.received_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        l.full_name,
        l.phone,
        l.email,
        l.company,
        l.ticket,
        l.attendees,
        l.status,
        l.note,
        [l.utm_source, l.utm_medium, l.utm_campaign].filter(Boolean).join(' / ') || l.source
      ].map(escapeCsv);
      csvRows.push(row.join(','));
    });

    const csvContent = '\uFEFF' + csvRows.join('\r\n'); // BOM for UTF-8 in Excel
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=dang-ky-ohana-affiliate-${new Date().toISOString().slice(0, 10)}.csv`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).send('Lỗi khi xuất file Excel/CSV.');
  }
});

// Admin Route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Root Route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export app for Vercel Serverless
module.exports = app;

// Start Server if run directly
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Ohana Affiliate Training 2026 running at:`);
    console.log(`👉 Landing Page: http://localhost:${PORT}`);
    console.log(`👉 Admin CRM:   http://localhost:${PORT}/admin`);
    console.log(`👉 Password:     ${ADMIN_PASSWORD}`);
    console.log(`====================================================`);
  });
}
