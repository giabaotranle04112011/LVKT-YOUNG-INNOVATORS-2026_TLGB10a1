# SỔ TAY HƯỚNG DẪN SỬ DỤNG & KỊCH BẢN TRÌNH DIỄN DEMO THỰC CHIẾN
## ĐỀ TÀI NGHIÊN CỨU KHOA HỌC KỸ THUẬT (KHKT) DÀNH CHO HỌC SINH TRUNG HỌC
### NĂM HỌC 2026 – 2027

---

### THÔNG TIN HỒ SƠ ĐỀ TÀI:
- **Tên đề tài:** ỨNG DỤNG MÔ HÌNH HỌC MÁY TOÁN HỌC OLS – CRI KẾT HỢP TRỢ LÝ AI GEMINI FLASH TRONG CẢNH BÁO SỚM NGUY CƠ SA SÚT HỌC TẬP, PHÂN HỆ LMS GIAO BÀI VÀ ĐIỀU HÀNH THỜI KHÓA BIỂU TOÀN DIỆN 41 LỚP HỌC
- **Đơn vị nghiên cứu:** Trường THCS & THPT Liên Việt Kon Tum
- **Địa chỉ:** Nguyễn Thị Cương, Đăk BLa, TP. Kon Tum, Tỉnh Kon Tum (Quảng Ngãi)
- **Tác giả nghiên cứu:** **Trần Lê Gia Bảo** — Học sinh Lớp 10A1
- **Lĩnh vực dự thi:** Hệ thống phần mềm & Trí tuệ nhân tạo giáo dục (Learning Analytics & Applied Educational AI)
- **Quy mô thực nghiệm:** Toàn diện 41 lớp học (Khối 6 đến Khối 12), 410 học sinh, 88 giáo viên, 35 môn học chuẩn GDPT 2018.

---

## MỤC LỤC

1. [Cấu Trúc Hệ Thống & Hướng Dẫn Khởi Động Nhanh](#1-cấu-trúc-hệ-thống--hướng-dẫn-khởi-động-nhanh)
2. [Bảng Tra Cứu Tài Khoản Đăng Nhập 6 Vai Trò](#2-bảng-tra-cứu-tài-khoản-đăng-nhập-6-vai-trò)
3. [Kịch Bản Thuyết Trình & Thao Tác Demo 5 Phút Chuẩn Sư Phạm](#3-kịch-bản-thuyết-trình--thao-tác-demo-5-phút-chuẩn-sư-phạm)
4. [Hướng Dẫn Chi Tiết Từng Phân Hệ Chức Năng](#4-hướng-dẫn-chi-tiết-từng-phân-hệ-chức-năng)
   - 4.1. Dashboard Cảnh Báo Sớm OLS & CRI
   - 4.2. Bảng Điểm KTTX & Tool Quét Môn Học Tự Động Từ TKB (GDPT 2018)
   - 4.3. Phân Hệ vnEdu AI LMS & Thi Trực Tuyến Chống Gian Lận
   - 4.4. Phân Hệ Điều Hành Thời Khóa Biểu 41 Lớp Toàn Trường
   - 4.5. Cổng Học Sinh Riêng Biệt & Trợ Lý Cố Vấn AI EDU-BOT
5. [Bộ Câu Hỏi & Hướng Dẫn Trả Lời Bảo Vệ Đề Tài Trước Ban Giám Khảo](#5-bộ-câu-hỏi--hướng-dẫn-trả-lời-bảo-vệ-đề-tài-trước-ban-giám-khảo)
6. [Quy Trình Bàn Giao & Triển Khai Cho Nhà Trường](#6-quy-trình-bàn-giao--triển-khai-cho-nhà-trường)

---

## 1. CẤU TRÚC HỆ THỐNG & HƯỚNG DẪN KHỞI ĐỘNG NHANH

### 1.1. Cấu trúc thư mục dự án
```
he_thong_quan_li_lien_viet_kontum/
│
├── CHAY_BAN_WEB.bat               <- File 1-click khởi chạy hệ thống tức thì
├── server.py                      <- Local HTTP Server (Python) chạy độc lập phòng máy trường
├── HUONG_DAN_SU_DUNG_VA_DEMO.md   <- Bản hướng dẫn sử dụng và kịch bản demo (Tài liệu này)
│
└── web/                           <- Mã nguồn ứng dụng Web Enterprise
    ├── index.html                 <- Cổng Quản trị Điều hành (BGH, GVCN, GVBM, Tổng phụ trách, Admin)
    ├── login.html                 <- Cổng Đăng nhập thông minh (có chip đăng nhập nhanh 1-click)
    ├── student.html               <- Cổng Học sinh độc lập (Tra cứu TKB, làm bài LMS, AI Cố vấn)
    ├── style.css                  <- Giao diện Glassmorphism kính mờ chuẩn quốc tế
    ├── auth.js                    <- Quản lý phiên làm việc & phân quyền 6 cấp độ (RBAC)
    ├── data.js                    <- Bộ dữ liệu 41 lớp, thuật toán OLS, CRI & mô phỏng phục hồi
    ├── data_tkb_school_41.js      <- Dữ liệu TKB 41 lớp bóc tách từ lienvietkontum.quangngai.edu.vn
    ├── app.js                     <- Điều phối giao diện, LMS, Tool quét TKB & Gemini AI
    ├── student.js                 <- Logic thi chống gian lận & Cố vấn học tập EDU-BOT
    └── BAO_CAO_KHOA_HOC_VA_SO_LIEU_THUC_NGHIEM.md <- Báo cáo khoa học & thuyết minh số liệu
```

### 1.2. Cách khởi chạy trên máy tính nhà trường hoặc máy thi của Ban Giám Khảo

#### Cách 1: Sử dụng bộ phóng Local Server (Khuyên dùng khi trình chiếu)
1. Nhấp đúp chuột vào file **`CHAY_BAN_WEB.bat`**.
2. Hệ thống sẽ tự động bật Local Server nội bộ tại địa chỉ: `http://localhost:5500/login.html` và tự động mở trình duyệt Chrome hoặc Microsoft Edge.
3. Nhấn phím **`F11`** trên bàn phím máy tính để mở chế độ **Toàn Màn Hình (Full Screen)** giúp giao diện hiển thị chuyên nghiệp nhất.

#### Cách 2: Mở trực tiếp không cần cài đặt (Hoạt động hoàn toàn Offline)
- Mở thư mục `web/` và nhấp đúp vào file **`login.html`**. 
- Toàn bộ cơ sở dữ liệu và thuật toán đều được tối ưu hóa chạy trực tiếp trên trình duyệt bằng cơ chế **LocalStorage Cache**, không phụ thuộc vào đường truyền Internet.

### 1.3. Khả năng tương thích đa nền tảng: PC (Máy tính) & Mobile (Điện thoại)
Hệ thống được thiết kế với kiến trúc **Adaptive Responsive Design** hiện đại:
- **Trên Máy tính (PC / Laptop màn hình lớn $\ge 1024px$):**
  - Thanh Sidebar cố định 275px bên trái phân cấp 41 lớp học rõ ràng.
  - Thẻ thống kê KPI trải rộng 5 cột, đồ thị OLS và đồng hồ Gauge song song trực quan.
  - Bảng điểm và danh sách học sinh hiển thị chi tiết, hỗ trợ in ấn báo cáo chuẩn A4.
- **Trên Điện thoại thông minh (Smartphone Android / iPhone $\le 768px$):**
  - **Menu Ngăn Kéo (Sidebar Drawer):** Bấm nút ☰ (Hamburger) trên thanh tiêu đề để trượt menu 41 lớp mượt mà, chạm nền mờ để đóng lại.
  - **Thanh Điều Hướng Dưới Đáy (Bottom Navigation Bar):** 5 nút bấm nhanh (*Tổng quan, KTTX, LMS, TKB, EDU-BOT AI*) đặt vừa tầm ngón cái khi cầm điện thoại 1 tay.
  - **Bảng dữ liệu vuốt chạm (Touch-friendly Table):** Tự động hỗ trợ cuộn ngang êm ái mà không làm vỡ khung hình.
  - **Cửa sổ Trợ lý AI và Modal:** Tự động chuyển đổi thành dạng Bottom Sheet hiện đại như các ứng dụng di động cao cấp.

---

## 2. BẢNG TRA CỨU TÀI KHOẢN ĐĂNG NHẬP 6 VAI TRÒ

Tại trang đăng nhập `login.html`, bạn có thể bấm trực tiếp vào các **Nút Chip Đăng Nhập 1-Click** (không cần gõ phím) hoặc nhập thủ công tài khoản dưới đây:

| Vai trò | Tên đăng nhập | Mật khẩu | Quyền hạn & Chức năng chính | Ghi chú tài khoản |
| :--- | :--- | :--- | :--- | :--- |
| **👑 Admin Tổng** | `giabaotranle04` | `1414@#22gbbn` | Toàn quyền quản trị hệ thống, thêm/xóa môn học, cấu hình dữ liệu, quét TKB 41 lớp. | Tác giả: **Trần Lê Gia Bảo** (10A1) |
| **🏛️ Ban Giám Hiệu** | `bgh_kontum` | `bgh2026` | Xem báo cáo chỉ số toàn trường, giám sát 41 lớp, duyệt kế hoạch can thiệp sư phạm. | Hiệu trưởng / Phó Hiệu trưởng |
| **🎗️ Tổng Phụ Trách Đội** | `tpt_lienviett` | `tpt2026` | Quản lý chuyên cần, nề nếp, nạp điểm rèn luyện và xếp loại hạnh kiểm học sinh. | Tổng phụ trách nhà trường |
| **📋 GVCN Lớp 10A1** | `gvcn_10a1` | `gvcn10a1` | Quản trị học sinh Lớp 10A1, xem OLS & CRI, gửi kế hoạch hành động 3 bên cho phụ huynh. | GVCN lớp tác giả Gia Bảo |
| **📋 GVCN Lớp 12C1** | `gvcn_12c1` | `gvcn12c1` | Quản trị học sinh Lớp 12C1 (Khối 12 tốt nghiệp), theo dõi cảnh báo học sinh sa sút. | Giáo viên chủ nhiệm khối 12 |
| **📖 GV Bộ Môn Toán** | `gvbm_toan` | `gvbmtoan` | Nhập điểm KTTX môn Toán, giao bài tập trắc nghiệm LMS, dùng AI sinh đề tự động. | Giáo viên bộ môn |
| **🎒 HS Trần Lê Gia Bảo** | `hs_10a1` | `123456` | Cổng học sinh Lớp 10A1: xem TKB lớp mình, bảng điểm cá nhân, làm bài LMS, chat AI. | Học sinh tác giả (Mã HS113) |
| **🎒 HS Lớp 12C5 (TKB)** | `hs_12c5` | `123456` | Cổng học sinh Lớp 12C5 (Tổ hợp Mỹ thuật - Xã hội): kiểm chứng môn học theo GDPT 2018. | Học sinh Lớp 12C5 |
| **🎒 HS Lớp 6 Cát Bà** | `hs_6catba` | `123456` | Cổng học sinh Khối 6 THCS: kiểm chứng môn tích hợp Khoa học tự nhiên, Sử - Địa. | Học sinh Khối 6 THCS |

---



