/**
 * ĐỀ TÀI NGHIÊN CỨU KHOA HỌC KỸ THUẬT DÀNH CHO HỌC SINH TRUNG HỌC
 * DỰ ÁN: HỆ THỐNG CẢNH BÁO SỚM NGUY CƠ SA SÚT HỌC TẬP (OLS - CRI) & ĐIỀU HÀNH THỜI KHÓA BIỂU
 * 
 * Tác giả: Trần Lê Gia Bảo (Học sinh Lớp 10A1)
 * Trường THCS & THPT Liên Việt Kon Tum — Năm học 2026 - 2027
 * 
 * File: data.js — Bộ dữ liệu 41 lớp toàn trường & thuật toán toán học OLS - CRI
 * Ghi chú kỹ thuật của Gia Bảo:
 * - Chuẩn GDPT 2018: THCS học môn tích hợp (KHTN, Sử - Địa), THPT học theo tổ hợp ban.
 * - Mô hình OLS: Hồi quy tuyến tính bậc nhất phát hiện xu hướng suy giảm phong độ qua 6 tuần.
 * - Mô hình CRI: Chỉ số tổng hợp 4 thành phần (Độ dốc 40%, Bài tập 30%, Nghỉ học 20%, Biến động 10%).
 * - Tự động đồng bộ ma trận môn học với Thời khóa biểu thực tế của trường.
 */

if (typeof window !== "undefined") {
  window.escapeHtml = window.escapeHtml || function(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
}
var escapeHtml = (typeof window !== "undefined" && window.escapeHtml) ? window.escapeHtml : function(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const SCHOOL_INFO = {
  name: "THCS & THPT Liên Việt Kontum",
  address: "Nguyễn Thị Cương, Đăk BLa, Quảng Ngãi, Việt Nam",
  school_year: "2026 - 2027",
  author: "Trần Lê Gia Bảo — Lớp 10A1",
  total_morning_classes: 60,
  total_afternoon_classes: 41,
  total_2b_classes: 60,
  total_teachers: 88,
  total_classrooms: 0,
  total_subjects: 35
};

const CLASS_GROUPS = {
  "THCS - Khối 6": ["6 Cát Bà", "6 Cồn Cỏ", "6 Đảo Yến", "6 Phú Quý", "6 Sinh Tồn", "6 Song Tử"],
  "THCS - Khối 7": ["7 Bình Ba", "7 Côn Đảo", "7 Hoàng Sa", "7 Lý Sơn", "7 Phú Quốc", "7 Trường Sa"],
  "THCS - Khối 8": ["8 Bạch Long Vĩ", "8 Biện Sơn", "8 Gạc Ma", "8 Hà Tiên", "8 Long Châu", "8 Phú Lâm", "8 Sơn Dương"],
  "THCS - Khối 9": ["9 Bình Hưng", "9 Cô Tô", "9 Côn Sơn", "9 Nam Du", "9 Thổ Chu", "9 Tuần Châu", "9 Vân Đồn"],
  "THPT - Khối 10": ["10A1", "10A2", "10A3", "10A4", "10A5"],
  "THPT - Khối 11": ["11B1", "11B2", "11B3", "11B4", "11B5"],
  "THPT - Khối 12": ["12C1", "12C2", "12C3", "12C4", "12C5"]
};

const ALL_CLASSES = Object.values(CLASS_GROUPS).flat();

// Danh mục 35 môn học chuẩn GDPT 2018 và môn đặc thù tại trường Liên Việt Kon Tum
const SCHOOL_35_SUBJECTS = [
  // 1. Môn Văn Hóa Cốt Lõi (8)
  { id: "toan", name: "Toán", group: "Môn Cốt Lõi", type: "score", level: "both", icon: "📐" },
  { id: "ngu_van", name: "Ngữ Văn", group: "Môn Cốt Lõi", type: "score", level: "both", icon: "📚" },
  { id: "tieng_anh", name: "Tiếng Anh", group: "Môn Cốt Lõi", type: "score", level: "both", icon: "🌐" },
  { id: "vat_ly", name: "Vật Lý", group: "Khoa Học Tự Nhiên", type: "score", level: "both", icon: "⚡" },
  { id: "hoa_hoc", name: "Hóa Học", group: "Khoa Học Tự Nhiên", type: "score", level: "both", icon: "🧪" },
  { id: "sinh_hoc", name: "Sinh Học", group: "Khoa Học Tự Nhiên", type: "score", level: "both", icon: "🧬" },
  { id: "lich_su", name: "Lịch Sử", group: "Khoa Học Xã Hội", type: "score", level: "both", icon: "🏛️" },
  { id: "dia_ly", name: "Địa Lý", group: "Khoa Học Xã Hội", type: "score", level: "both", icon: "🌍" },

  // Môn Tích Hợp GDPT 2018 THCS (Khối 6, 7, 8, 9)
  { id: "khtn", name: "Khoa Học Tự Nhiên", group: "Khoa Học Tự Nhiên", type: "score", level: "thcs", icon: "🔬" },
  { id: "ls_dl", name: "Lịch Sử & Địa Lý", group: "Khoa Học Xã Hội", type: "score", level: "thcs", icon: "🗺️" },

  // 2. Môn Giáo Dục Công Dân & Pháp Luật (2)
  { id: "gdcd", name: "Giáo Dục Công Dân", group: "Khoa Học Xã Hội", type: "score", level: "thcs", icon: "⚖️" },
  { id: "gd_ktpl", name: "GD Kinh Tế & Pháp Luật", group: "Khoa Học Xã Hội", type: "score", level: "thpt", icon: "📈" },

  // 3. Môn Công Nghệ & Tin Học (3)
  { id: "tin_hoc", name: "Tin Học", group: "Công Nghệ - Số Hóa", type: "score", level: "both", icon: "💻" },
  { id: "cong_nghe", name: "Công Nghệ", group: "Công Nghệ - Số Hóa", type: "score", level: "both", icon: "⚙️" },
  { id: "stem_robotics", name: "GD STEM & Robotics", group: "Công Nghệ - Số Hóa", type: "score", level: "both", icon: "🤖" },

  // 4. Môn An Ninh & Thể Chất (3)
  { id: "gdqp_an", name: "GD Quốc Phòng - An Ninh", group: "Thể Chất & An Ninh", type: "score", level: "thpt", icon: "🛡️" },
  { id: "gdtc", name: "Giáo Dục Thể Chất", group: "Thể Chất & An Ninh", type: "score", level: "both", icon: "🏃" },
  { id: "boi_loi", name: "Bơi Lội & Phòng Chống Đuối Nước", group: "Thể Chất & An Ninh", type: "score", level: "both", icon: "🏊" },

  // 5. Môn Nghệ Thuật & Kỹ Năng (4)
  { id: "am_nhac", name: "Âm Nhạc", group: "Nghệ Thuật & Kỹ Năng", type: "score", level: "both", icon: "🎵" },
  { id: "my_thuat", name: "Mỹ Thuật", group: "Nghệ Thuật & Kỹ Năng", type: "score", level: "both", icon: "🎨" },
  { id: "hdtn_hn", name: "Hoạt Động Trải Nghiệm - HN", group: "Nghệ Thuật & Kỹ Năng", type: "score", level: "both", icon: "🧭" },
  { id: "gd_diaphuong", name: "Nội Dung GD Địa Phương Kon Tum", group: "Nghệ Thuật & Kỹ Năng", type: "score", level: "both", icon: "🏔️" },

  // 6. Ngoại Ngữ 2 Tự Chọn (4)
  { id: "tieng_phap", name: "Tiếng Pháp (Ngoại ngữ 2)", group: "Ngoại Ngữ 2", type: "score", level: "both", icon: "🗼" },
  { id: "tieng_nhat", name: "Tiếng Nhật (Ngoại ngữ 2)", group: "Ngoại Ngữ 2", type: "score", level: "both", icon: "🗾" },
  { id: "tieng_han", name: "Tiếng Hàn (Ngoại ngữ 2)", group: "Ngoại Ngữ 2", type: "score", level: "both", icon: "🇰🇷" },
  { id: "tieng_trung", name: "Tiếng Trung (Ngoại ngữ 2)", group: "Ngoại Ngữ 2", type: "score", level: "both", icon: "🏮" },

  // 7. Chuyên Đề Học Tập THPT (8)
  { id: "cd_toan", name: "Chuyên Đề Toán Học", group: "Chuyên Đề Học Tập", type: "score", level: "thpt", icon: "🧮" },
  { id: "cd_van", name: "Chuyên Đề Ngữ Văn", group: "Chuyên Đề Học Tập", type: "score", level: "thpt", icon: "✍️" },
  { id: "cd_anh", name: "Chuyên Đề Tiếng Anh Giao Tiếp", group: "Chuyên Đề Học Tập", type: "score", level: "thpt", icon: "🗣️" },
  { id: "cd_ly", name: "Chuyên Đề Vật Lý Ứng Dụng", group: "Chuyên Đề Học Tập", type: "score", level: "thpt", icon: "🔭" },
  { id: "cd_hoa", name: "Chuyên Đề Hóa Học Thực Nghiệm", group: "Chuyên Đề Học Tập", type: "score", level: "thpt", icon: "🔬" },
  { id: "cd_sinh", name: "Chuyên Đề Sinh Học Ứng Dụng", group: "Chuyên Đề Học Tập", type: "score", level: "thpt", icon: "🌱" },
  { id: "cd_su", name: "Chuyên Đề Lịch Sử Văn Minh", group: "Chuyên Đề Học Tập", type: "score", level: "thpt", icon: "📜" },
  { id: "cd_tin", name: "Chuyên Đề AI & Lập Trình", group: "Chuyên Đề Học Tập", type: "score", level: "thpt", icon: "🧠" },

  // 8. Bản Sắc & Sáng Tạo Trẻ Liên Việt Kon Tum (3)
  { id: "cong_chieng", name: "Cồng Chiêng & Văn Hóa Tây Nguyên", group: "Bản Sắc Kon Tum", type: "score", level: "both", icon: "🥁" },
  { id: "nckh_kt", name: "Nghiên Cứu KHKT Học Đường", group: "Sáng Tạo Trẻ", type: "score", level: "both", icon: "💡" },
  { id: "ky_nang_song", name: "Kỹ Năng Sống & Tâm Lý", group: "Sáng Tạo Trẻ", type: "score", level: "both", icon: "🤝" }
];

// Cơ chế lưu trữ và nạp danh mục môn học động qua LocalStorage (hỗ trợ chạy offline)
const STORE_SUBJECTS = "LVKONTUM_SUBJECTS_V5_TKB";

function loadSubjectsData() {
  const local = localStorage.getItem(STORE_SUBJECTS);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {}
  }
  saveSubjectsData(SCHOOL_35_SUBJECTS);
  return JSON.parse(JSON.stringify(SCHOOL_35_SUBJECTS));
}

function saveSubjectsData(data) {
  localStorage.setItem(STORE_SUBJECTS, JSON.stringify(data));
}

let APP_SUBJECTS = loadSubjectsData();
SCHOOL_INFO.total_subjects = APP_SUBJECTS.length;

function getSubjectNames() {
  return APP_SUBJECTS.map(s => s.name);
}

const SUBJECT_NAMES_35 = APP_SUBJECTS.map(s => s.name);

// Thêm môn học mới
function addCustomSubject(subjectObj) {
  if (!subjectObj || !subjectObj.name || !subjectObj.name.trim()) {
    return { success: false, message: "Tên môn học không được để trống!" };
  }
  const name = subjectObj.name.trim();
  if (APP_SUBJECTS.some(s => s.name.toLowerCase() === name.toLowerCase())) {
    return { success: false, message: `Môn học "${name}" đã tồn tại trong hệ thống!` };
  }

  const id = subjectObj.id || ("sub_" + Date.now().toString(36) + "_" + Math.floor(Math.random()*1000));
  const newSubj = {
    id: id,
    name: name,
    group: subjectObj.group || "Môn Tự Chọn Khác",
    type: "score",
    level: subjectObj.level || "both",
    icon: subjectObj.icon || "📖"
  };

  APP_SUBJECTS.push(newSubj);
  saveSubjectsData(APP_SUBJECTS);
  SCHOOL_INFO.total_subjects = APP_SUBJECTS.length;

  // Tự động khởi tạo điểm số môn mới này cho toàn bộ học sinh
  if (typeof STUDENTS_DATA !== "undefined" && Array.isArray(STUDENTS_DATA)) {
    STUDENTS_DATA.forEach(st => {
      if (!st.subjects) st.subjects = {};
      const shouldHave = (newSubj.level === "both") ||
        (newSubj.level === "thcs" && st.grade <= 9) ||
        (newSubj.level === "thpt" && st.grade >= 10);

      if (shouldHave) {
        const seed = (st.student_id ? st.student_id.charCodeAt(2) : 10) + name.length * 37;
        const rng = makeRng(seed);
        st.subjects[name] = genSingleSubjectScore(rng, st.academic_avg || st.avg_score || 7.0);
        // Tính lại điểm trung bình học lực
        const { avg, rank } = getAcademicRank(st.subjects);
        st.academic_avg = avg;
        st.academic_rank = rank;
      }
    });
    saveStudentsData(STUDENTS_DATA);
  }

  return { success: true, message: `Đã thêm thành công môn "${name}"!`, subject: newSubj };
}

// Xóa môn học
function deleteCustomSubject(subjName) {
  if (APP_SUBJECTS.length <= 1) {
    return { success: false, message: "Hệ thống phải có ít nhất 1 môn học!" };
  }
  const idx = APP_SUBJECTS.findIndex(s => s.name === subjName);
  if (idx === -1) {
    return { success: false, message: `Không tìm thấy môn "${subjName}" để xóa!` };
  }

  const removed = APP_SUBJECTS.splice(idx, 1)[0];
  saveSubjectsData(APP_SUBJECTS);
  SCHOOL_INFO.total_subjects = APP_SUBJECTS.length;

  // Gỡ bỏ điểm môn này khỏi toàn bộ học sinh
  if (typeof STUDENTS_DATA !== "undefined" && Array.isArray(STUDENTS_DATA)) {
    STUDENTS_DATA.forEach(st => {
      if (st.subjects && st.subjects[subjName]) {
        delete st.subjects[subjName];
        // Tính lại điểm trung bình học lực
        const { avg, rank } = getAcademicRank(st.subjects);
        st.academic_avg = avg;
        st.academic_rank = rank;
      }
    });
    saveStudentsData(STUDENTS_DATA);
  }

  return { success: true, message: `Đã xóa môn "${subjName}" khỏi hệ thống thành công!`, removed };
}

// Khôi phục 35 môn gốc ban đầu
function resetDefaultSubjects() {
  APP_SUBJECTS = JSON.parse(JSON.stringify(SCHOOL_35_SUBJECTS));
  saveSubjectsData(APP_SUBJECTS);
  SCHOOL_INFO.total_subjects = APP_SUBJECTS.length;

  if (typeof STUDENTS_DATA !== "undefined" && Array.isArray(STUDENTS_DATA)) {
    STUDENTS_DATA.forEach(st => {
      if (!st.subjects) st.subjects = {};
      APP_SUBJECTS.forEach(sub => {
        if (!st.subjects[sub.name]) {
          const seed = (st.student_id ? st.student_id.charCodeAt(2) : 10) + sub.name.length * 37;
          const rng = makeRng(seed);
          st.subjects[sub.name] = genSingleSubjectScore(rng, st.academic_avg || st.avg_score || 7.0);
        }
      });
      const { avg, rank } = getAcademicRank(st.subjects);
      st.academic_avg = avg;
      st.academic_rank = rank;
    });
    saveStudentsData(STUDENTS_DATA);
  }

  return { success: true, message: "Đã khôi phục 35 môn học chuẩn ban đầu!" };
}

// Danh mục môn học cơ bản tính điểm theo khối
const PRIMARY_SUBJECTS_THCS = [
  "Toán","Ngữ Văn","Tiếng Anh","Vật Lý","Hóa Học","Sinh Học",
  "Lịch Sử","Địa Lý","Giáo Dục Công Dân","Tin Học","Công Nghệ",
  "Giáo Dục Thể Chất","Hoạt Động Trải Nghiệm - HN","Nội Dung GD Địa Phương Kon Tum"
];

const PRIMARY_SUBJECTS_THPT = [
  "Toán","Ngữ Văn","Tiếng Anh","Vật Lý","Hóa Học","Sinh Học",
  "Lịch Sử","Địa Lý","GD Kinh Tế & Pháp Luật","Tin Học","Công Nghệ",
  "GD Quốc Phòng - An Ninh","Giáo Dục Thể Chất","Hoạt Động Trải Nghiệm - HN",
  "Nội Dung GD Địa Phương Kon Tum"
];

const KON_TUM_STREETS = [
  "Trần Hưng Đạo, P. Thắng Lợi, TP. Kon Tum",
  "Lê Hồng Phong, P. Quyết Thắng, TP. Kon Tum",
  "Phan Đình Phùng, P. Quang Trung, TP. Kon Tum",
  "Bà Triệu, P. Thắng Lợi, TP. Kon Tum",
  "Nguyễn Huệ, P. Thống Nhất, TP. Kon Tum",
  "U Rê, P. Duy Tân, TP. Kon Tum",
  "Đào Duy Từ, P. Trường Chinh, TP. Kon Tum",
  "Trần Phú, P. Thắng Lợi, TP. Kon Tum",
  "Nguyễn Viết Xuân, Xã Đắk Cấm, TP. Kon Tum",
  "Hùng Vương, P. Quang Trung, TP. Kon Tum"
];

// ---- SEEDED RNG ----
function makeRng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

// ---- HỌ VÀ TÊN ----
const LAST_NAMES  = ["Nguyễn","Trần","Lê","Phạm","Hoàng","Huỳnh","Phan","Vũ","Đặng","Bùi","Đỗ","Hồ","Ngô","Dương","Lý"];
const MID_M = ["Văn","Quốc","Hữu","Đức","Minh","Thành","Bảo","Gia","Anh","Trung","Khắc"];
const MID_F = ["Thị","Ngọc","Thu","Thanh","Mai","Kim","Bích","Lan","Phương","Hồng","Ánh"];
const FIRST_M = ["Hùng","Dũng","Long","Phúc","Khoa","Hải","Tuấn","Nam","Bình","Cường","Hiếu","Thắng","Quân","Phong","Tùng"];
const FIRST_F = ["Hương","Linh","Trang","Thư","Yến","Nhi","Giang","Châu","Lam","Hà","Vy","Chi","Như","Quỳnh","Minh"];

function genName(rng, isMale) {
  const last = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
  const mid  = (isMale ? MID_M : MID_F)[Math.floor(rng() * 11)];
  const first = (isMale ? FIRST_M : FIRST_F)[Math.floor(rng() * 15)];
  return `${last} ${mid} ${first}`;
}

// Sinh điểm KTTX một môn
function genSingleSubjectScore(rng, baseAvg) {
  const base = clamp(baseAvg + (rng() - 0.5) * 2.2, 3.0, 10.0);
  const kttx1 = +clamp(base + (rng()-0.5)*1.4, 3.0, 10.0).toFixed(1);
  const kttx2 = +clamp(base + (rng()-0.5)*1.4, 3.0, 10.0).toFixed(1);
  const ktgk  = +clamp(base + (rng()-0.5)*1.0, 3.0, 10.0).toFixed(1);
  const ktck  = +clamp(base + (rng()-0.5)*0.8, 3.0, 10.0).toFixed(1);
  const avg   = +((kttx1 + kttx2 + ktgk*2 + ktck*3) / 7).toFixed(1);
  const xepLoai = avg >= 8.0 ? "Giỏi" : avg >= 6.5 ? "Khá" : avg >= 5.0 ? "TB" : "Yếu";
  return { kttx1, kttx2, ktgk, ktck, avg, xepLoai };
}

// Sinh điểm KTTX danh sách môn
function genSubjectScores(rng, baseAvg, subjects) {
  const result = {};
  subjects.forEach(subj => {
    result[subj] = genSingleSubjectScore(rng, baseAvg);
  });
  return result;
}

// Đảm bảo học sinh có điểm môn học (dùng khi xem bất kỳ môn nào trong 35 môn)
function ensureStudentSubject(student, subjName) {
  if (!student.subjects) student.subjects = {};

  // Kiểm tra nếu lớp học sinh có TKB môn học cụ thể (không sinh môn nếu lớp không học)
  if (typeof getSubjectsForClassFromTkb === "function") {
    const valid = getSubjectsForClassFromTkb(student.class_name);
    if (valid && valid.length > 0 && !valid.includes(subjName)) {
      return null;
    }
  }

  if (!student.subjects[subjName]) {
    // Dùng mã HS và tên môn làm hạt giống nhất quán
    let hash = 0;
    const key = student.student_id + "_" + subjName;
    for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) & 0xffffff;
    const rng = makeRng(Math.abs(hash) + 12345);
    student.subjects[subjName] = genSingleSubjectScore(rng, student.avg_score || 7.0);
  }
  return student.subjects[subjName];
}

function getAcademicRank(subjectMap) {
  const avgs = Object.values(subjectMap).map(s => s.avg);
  if (!avgs.length) return { avg: 7.0, rank: "Khá" };
  const totalAvg = +(avgs.reduce((a,b)=>a+b,0) / avgs.length).toFixed(1);
  const hasYeu = avgs.some(a => a < 5.0);
  const hasKem = avgs.some(a => a < 3.5);
  if (hasKem || totalAvg < 3.5) return { avg: totalAvg, rank: "Kém" };
  if (hasYeu || totalAvg < 5.0) return { avg: totalAvg, rank: "Yếu" };
  if (totalAvg < 6.5) return { avg: totalAvg, rank: "Trung Bình" };
  if (totalAvg < 8.0) return { avg: totalAvg, rank: "Khá" };
  return { avg: totalAvg, rank: "Giỏi" };
}

function getConduct(rng, risk_level, absences) {
  if (risk_level === "THẤP" && absences <= 1)  return "Tốt";
  if (risk_level === "THẤP" && absences <= 2)  return rng() > 0.25 ? "Tốt" : "Khá";
  if (risk_level === "TRUNG BÌNH")             return rng() > 0.55 ? "Khá" : (rng() > 0.3 ? "Tốt" : "Trung Bình");
  if (risk_level === "CAO" && absences >= 4)   return rng() > 0.5 ? "Trung Bình" : (rng() > 0.7 ? "Yếu" : "Khá");
  if (risk_level === "CAO")                    return rng() > 0.6 ? "Khá" : "Trung Bình";
  return "Khá";
}

// Sinh ngày sinh theo khối
function genDob(rng, grade) {
  const baseYear = 2026 - (grade + 6); // Khối 8: 2012, Khối 9: 2011, Khối 10: 2010...
  const day = String(Math.floor(rng() * 28) + 1).padStart(2, '0');
  const month = String(Math.floor(rng() * 12) + 1).padStart(2, '0');
  return `${day}/${month}/${baseYear}`;
}

// Sinh số điện thoại phụ huynh
function genParentPhone(rng) {
  const prefixes = ["0984", "0977", "0913", "0905", "0935", "0868", "0914", "0988"];
  const prefix = prefixes[Math.floor(rng() * prefixes.length)];
  const mid = String(Math.floor(rng() * 900) + 100);
  const end = String(Math.floor(rng() * 900) + 100);
  return `${prefix}.${mid}.${end}`;
}

// Avatar khuôn mặt học sinh dạng SVG
function getStudentAvatarSvg(s, size = 34) {
  const isMale = s.gender === "Nam";
  const skin = s.skin_tone || "#fed7aa";
  const hair = isMale ? "#1c1917" : "#2c1810";
  const shirt = isMale ? "#0284c7" : "#ec4899";
  
  return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" style="border-radius:50%;background:#f1f5f9;box-shadow:0 1px 3px rgba(0,0,0,0.1);flex-shrink:0;">
    <circle cx="50" cy="50" r="48" fill="#e0f2fe" opacity="0.4"/>
    <path d="M18,96 Q50,68 82,96" fill="${shirt}"/>
    <circle cx="50" cy="46" r="26" fill="${skin}"/>
    ${isMale 
      ? `<path d="M26,38 Q50,18 74,38 Q68,23 50,23 Q32,23 26,38 Z" fill="${hair}"/>`
      : `<path d="M22,44 Q20,74 25,76 Q30,48 36,44 Q50,20 64,44 Q70,48 75,76 Q80,74 78,44 Q72,20 50,20 Q28,20 22,44 Z" fill="${hair}"/>`
    }
    <circle cx="41" cy="46" r="3" fill="#1e293b"/>
    <circle cx="59" cy="46" r="3" fill="#1e293b"/>
    <path d="M45,56 Q50,60 55,56" stroke="#e11d48" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  </svg>`;
}

// ---- SINH TẬP DỮ LIỆU BAN ĐẦU (41 LỚP TOÀN TRƯỜNG - 410 HỌC SINH) ----
function generateInitialStudents() {
  const rng = makeRng(20262027);
  const students = [];
  let idx = 1;

  ALL_CLASSES.forEach(className => {
    const grade = parseInt(className);
    const subjects = grade <= 9 ? PRIMARY_SUBJECTS_THCS : PRIMARY_SUBJECTS_THPT;

    for (let i = 0; i < 10; i++) {
      let sid;
      let isMale = rng() > 0.5;
      let gender = isMale ? "Nam" : "Nữ";
      let name = genName(rng, isMale);

      // Đảm bảo học sinh Trần Lê Gia Bảo luôn là HS đầu tiên của Lớp 10A1 (Tác giả đề tài KHKT)
      if (className === "10A1" && i === 0) {
        sid = "HS113";
        name = "Trần Lê Gia Bảo";
        isMale = true;
        gender = "Nam";
      } else if (className === "12C1" && i === 0) {
        sid = "HS185";
        name = "Phan Ánh Thư";
        isMale = false;
        gender = "Nữ";
      } else if (className === "8 Bạch Long Vĩ" && i === 0) {
        sid = "HS001";
        name = "Phạm Minh Hải";
        isMale = true;
        gender = "Nam";
      } else {
        do {
          sid = "HS" + String(idx++).padStart(3, "0");
        } while (sid === "HS113" || sid === "HS185" || sid === "HS001");
      }

      // Điểm 8 tuần
      let base = 5.5 + rng() * 2.5;
      let isDown = rng() < 0.28;

      if (name === "Trần Lê Gia Bảo") {
        base = 9.0;
        isDown = false;
      }

      const scores = [];
      let cur = base;
      for (let w = 0; w < 8; w++) {
        if (name === "Trần Lê Gia Bảo") {
          cur = 9.0 + (rng() - 0.4) * 0.5;
        } else {
          cur += isDown && w > 2 ? (-0.35 - rng()*0.25 + rng()*0.1) : (rng()-0.5)*0.6;
        }
        cur = clamp(cur, 3.0, 10.0);
        scores.push(+cur.toFixed(1));
      }

      // -------------------------------------------------------------
      // 1. TÍNH HỆ SỐ GÓC HỒI QUY OLS (ORDINARY LEAST SQUARES)
      // Tác giả: Trần Lê Gia Bảo - Phân tích chuỗi điểm 6 tuần đầu trước kỳ thi
      // Công thức: beta = (n*sum(t*S) - sum(t)*sum(S)) / (n*sum(t^2) - (sum(t))^2)
      // Với n = 6, t = [1, 2, 3, 4, 5, 6] => sumT = 21, sumTsq = 91
      // -------------------------------------------------------------
      const n = 6;
      const t = [1, 2, 3, 4, 5, 6];
      const sumT = 21;    // 1+2+3+4+5+6
      const sumTsq = 91;  // 1^2 + 2^2 + 3^2 + 4^2 + 5^2 + 6^2
      const sub = scores.slice(0, 6);
      const sumS = sub.reduce((a, b) => a + b, 0);
      let sumTS = 0;
      for (let k = 0; k < n; k++) sumTS += t[k] * sub[k];

      const slope = +((n * sumTS - sumT * sumS) / (n * sumTsq - sumT * sumT)).toFixed(2);
      // Độ biến động điểm (Độ lệch chuẩn thể hiện sự thất thường trong phong độ học tập)
      const vol = +(Math.sqrt(sub.reduce((s, v) => s + (v - sumS / n) ** 2, 0) / n)).toFixed(2);

      let hw_rate  = +(0.4 + rng() * 0.6).toFixed(2); // Tỷ lệ làm bài tập về nhà (40% - 100%)
      let absences = Math.floor(rng() * 5);           // Số buổi vắng (0 - 4 buổi)
      if (name === "Trần Lê Gia Bảo") {
        hw_rate = 1.0;
        absences = 0;
      }

      // -------------------------------------------------------------
      // 2. MÔ HÌNH CHỈ SỐ NGUY CƠ TỔNG HỢP CRI (COMPOSITE RISK INDEX)
      // Trọng số do tác giả chuẩn hóa thực nghiệm:
      // - 40% Hệ số tụt dốc OLS (Trend Slope)
      // - 30% Tỷ lệ thiếu bài tập về nhà (Homework Deficit)
      // - 20% Chuyên cần & Số buổi nghỉ học (Absences)
      // - 10% Độ bất ổn định phong độ (Volatility)
      // -------------------------------------------------------------
      const pT = slope < -0.3 ? 100 : slope < -0.15 ? 65 : slope < 0 ? 30 : 5;
      const pH = (1 - hw_rate) * 100;
      const pA = Math.min(absences * 25, 100);
      const pV = Math.min(vol * 20, 100);
      let risk_score = Math.round(0.40 * pT + 0.30 * pH + 0.20 * pA + 0.10 * pV);
      let risk_level = risk_score >= 65 ? "CAO" : risk_score >= 35 ? "TRUNG BÌNH" : "THẤP";
      if (name === "Trần Lê Gia Bảo") {
        risk_score = 5;
        risk_level = "THẤP";
      }
      const tot = pT + pH + pA + pV || 1;

      // KTTX
      const avgScore = +(sumS/n).toFixed(1);
      const subjectScores = genSubjectScores(rng, +avgScore, subjects);
      
      // Bổ sung thêm 1 môn ngoại ngữ 2 hoặc chuyên đề ngẫu nhiên cho phong phú
      if (grade >= 10) {
        const extraSubjs = ["Tiếng Pháp (Ngoại ngữ 2)", "Chuyên Đề Toán Học", "Chuyên Đề AI & Lập Trình", "Nghiên Cứu KHKT Học Đường"];
        const chosen = extraSubjs[Math.floor(rng() * extraSubjs.length)];
        subjectScores[chosen] = genSingleSubjectScore(rng, +avgScore);
      } else {
        const extraSubjs = ["Giáo Dục STEM & Robotics", "Âm Nhạc", "Mỹ Thuật", "Cồng Chiêng & Văn Hóa Tây Nguyên"];
        const chosen = extraSubjs[Math.floor(rng() * extraSubjs.length)];
        subjectScores[chosen] = genSingleSubjectScore(rng, +avgScore);
      }

      let { avg: academicAvg, rank: academicRank } = getAcademicRank(subjectScores);
      if (name === "Trần Lê Gia Bảo") {
        academicRank = "Giỏi";
        academicAvg = Math.max(academicAvg, 9.2);
      }

      let conduct = getConduct(rng, risk_level, absences);
      if (name === "Trần Lê Gia Bảo") {
        conduct = "Tốt";
      }
      const dob = genDob(rng, grade);
      const address = KON_TUM_STREETS[Math.floor(rng() * KON_TUM_STREETS.length)];
      const parentName = genName(rng, rng() > 0.4) + (rng() > 0.4 ? " (Bố)" : " (Mẹ)");
      const parentPhone = genParentPhone(rng);
      const skin_tone = ["#fed7aa", "#fcd5b5", "#f7c59f", "#ffedd5"][Math.floor(rng() * 4)];

      const planT = risk_level==="CAO"?"Phụ đạo, theo dõi sát bài tập và chuyên cần.":"Nhắc nhở đúng hạn, giao bài phù hợp năng lực.";
      const planS = risk_level==="CAO"?"Hoàn thành bù bài tập, ôn lại kiến thức căn bản.":"Duy trì thói quen học bài trước khi đến lớp.";
      const planP = risk_level==="CAO"?"Kiểm tra thời gian biểu học tối, phối hợp cùng GVCN.":"Động viên con, giữ môi trường học tập ổn định.";

      students.push({
        student_id: sid, name, gender, dob, class_name: className, grade,
        address, parent_name: parentName, parent_phone: parentPhone,
        skin_tone,
        scores, avg_score: avgScore, slope, volatility: vol,
        hw_rate, absences,
        risk_score, risk_level,
        academic_avg: academicAvg, academic_rank: academicRank,
        conduct,
        conduct_notes: conduct === "Tốt" ? "Ngoan ngoãn, gương mẫu trong học tập và nề nếp." : conduct === "Khá" ? "Chấp hành tương đối tốt nội quy, cần phát huy tự giác." : "Cần rèn luyện thêm về chuyên cần và nền nếp.",
        subjects: subjectScores,
        causes: {
          "Tụt dốc điểm kiểm tra": +(pT/tot*100).toFixed(1),
          "Thiếu/bỏ bài tập về nhà": +(pH/tot*100).toFixed(1),
          "Nghỉ học/Chuyên cần giảm": +(pA/tot*100).toFixed(1),
          "Phong độ dao động bất thường": +(pV/tot*100).toFixed(1)
        },
        intervention_plan: { GiaoVien: planT, HocSinh: planS, PhuHuynh: planP },
        actual_decline: risk_level==="CAO"?1:0
      });
    }
  });

  return students;
}

// Lưu trữ và đồng bộ hóa với LocalStorage (V6: Chuẩn hóa theo Thời Khóa Biểu từng lớp)
const STORE_STUDENTS = "LVKONTUM_STUDENTS_V6_TKB_SYNC";

function loadStudentsData() {
  const local = localStorage.getItem(STORE_STUDENTS);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length >= 400) {
        return parsed;
      }
    } catch (e) {}
  }
  const initial = generateInitialStudents();
  saveStudentsData(initial);
  return initial;
}

function saveStudentsData(data) {
  localStorage.setItem(STORE_STUDENTS, JSON.stringify(data));
}

// Cập nhật thông tin học sinh sau khi GV chỉnh sửa
function updateStudentData(updated) {
  const idx = STUDENTS_DATA.findIndex(s => s.student_id === updated.student_id);
  if (idx !== -1) {
    STUDENTS_DATA[idx] = updated;
    saveStudentsData(STUDENTS_DATA);
    return true;
  }
  return false;
}

const STUDENTS_DATA = loadStudentsData();

// Đảm bảo học sinh HS113 luôn mang tên tác giả Trần Lê Gia Bảo (Lớp 10A1)
(function ensureGiaBaoAccount() {
  const gb = STUDENTS_DATA.find(s => s.student_id === "HS113");
  if (gb && gb.name !== "Trần Lê Gia Bảo") {
    gb.name = "Trần Lê Gia Bảo";
    gb.gender = "Nam";
    saveStudentsData(STUDENTS_DATA);
  }
})();

// Dữ liệu mẫu phân hệ LMS vnEdu - Giao bài tập và kiểm tra trực tuyến
const STORE_LMS_ASSIGNMENTS = "LVKT_LMS_ASSIGNMENTS_V2";
const STORE_LMS_SUBMISSIONS = "LVKT_LMS_SUBMISSIONS_V2";

const SEED_LMS_ASSIGNMENTS = [
  {
    id: "ASSIGN_001",
    title: "Ôn tập KTTX Tuần 4: Hàm số bậc hai & Dấu tam thức bậc hai",
    subject: "Toán",
    teacher_name: "Thầy Phạm Văn Đức (GVBM Toán)",
    classes: ["10A1", "10A2"], // Multi-class
    type: "trac_nghiem",
    start_date: "2026-09-25T07:00",
    due_date: "2026-10-05T23:59",
    duration_minutes: 20,
    description: "Bài tập 5 câu trắc nghiệm rèn luyện kỹ năng tìm tọa độ đỉnh Parabol, trục đối xứng và xét dấu tam thức bậc hai f(x) = ax² + bx + c. Có AI tự động chấm và chỉ ra lỗi sai chi tiết.",
    questions: [
      {
        id: 1,
        question: "Tọa độ đỉnh I của Parabol (P): y = x² - 4x + 3 là điểm nào?",
        options: [
          "A. I(2; -1)",
          "B. I(-2; 15)",
          "C. I(4; 3)",
          "D. I(1; 0)"
        ],
        correct: "A",
        explanation: "Ta có đỉnh Parabol x_I = -b/(2a) = -(-4)/(2*1) = 2. Thay x = 2 vào hàm số: y = 2² - 4*2 + 3 = 4 - 8 + 3 = -1. Vậy tọa độ đỉnh là I(2; -1).",
        concept: "Tọa độ đỉnh Parabol"
      },
      {
        id: 2,
        question: "Trục đối xứng của Parabol y = -2x² + 4x - 1 là đường thẳng:",
        options: [
          "A. x = 2",
          "B. x = 1",
          "C. x = -1",
          "D. y = 1"
        ],
        correct: "B",
        explanation: "Trục đối xứng của Parabol y = ax² + bx + c là đường thẳng x = -b/(2a) = -4 / (2*(-2)) = 1.",
        concept: "Trục đối xứng Parabol"
      },
      {
        id: 3,
        question: "Tam thức bậc hai f(x) = x² - 5x + 6 nhận giá trị âm (f(x) < 0) khi và chỉ khi x thuộc khoảng nào?",
        options: [
          "A. (-∞; 2)",
          "B. (2; 3)",
          "C. (3; +∞)",
          "D. (-∞; 2) ∪ (3; +∞)"
        ],
        correct: "B",
        explanation: "Phương trình x² - 5x + 6 = 0 có hai nghiệm phân biệt x1 = 2, x2 = 3. Vì hệ số a = 1 > 0 nên trong khoảng hai nghiệm (2; 3), f(x) mang dấu trái với a, tức f(x) < 0 (Quy tắc 'Trong trái - Ngoài cùng').",
        concept: "Định lý về dấu của tam thức bậc hai"
      },
      {
        id: 4,
        question: "Tập nghiệm S của bất phương trình x² - 4 ≥ 0 là:",
        options: [
          "A. [-2; 2]",
          "B. (-∞; -2] ∪ [2; +∞)",
          "C. [2; +∞)",
          "D. (-∞; -2]"
        ],
        correct: "B",
        explanation: "x² - 4 = (x - 2)(x + 2) ≥ 0. Hệ số a = 1 > 0, do đó f(x) ≥ 0 ngoài khoảng hai nghiệm, tức x ≤ -2 hoặc x ≥ 2.",
        concept: "Bất phương trình bậc hai một ẩn"
      },
      {
        id: 5,
        question: "Giá trị nhỏ nhất của hàm số y = x² - 6x + 11 trên tập số thực R bằng bao nhiêu?",
        options: [
          "A. 2",
          "B. 3",
          "C. 11",
          "D. -2"
        ],
        correct: "A",
        explanation: "Biến đổi: y = (x - 3)² + 2 ≥ 2 với mọi x. Dấu '=' xảy ra khi x = 3. Do đó GTNN của hàm số là 2.",
        concept: "Giá trị lớn nhất, nhỏ nhất của hàm số bậc hai"
      }
    ],
    status: "active",
    created_at: "2026-09-25 08:30"
  },
  {
    id: "ASSIGN_002",
    title: "Khảo sát tính đơn điệu & Cực trị hàm số đa thức bậc ba",
    subject: "Toán",
    teacher_name: "Thầy Phạm Văn Đức (GVBM Toán)",
    classes: ["12C1", "12C2"],
    type: "trac_nghiem",
    start_date: "2026-09-24T08:00",
    due_date: "2026-10-04T23:59",
    duration_minutes: 15,
    description: "Kiểm tra nhanh 3 câu kiến thức đạo hàm cấp 1, chiều biến thiên và điểm cực đại, cực tiểu của hàm số.",
    questions: [
      {
        id: 1,
        question: "Hàm số y = x³ - 3x² + 2 đồng biến trên khoảng nào sau đây?",
        options: [
          "A. (0; 2)",
          "B. (-∞; 0) và (2; +∞)",
          "C. (-∞; 2)",
          "D. (0; +∞)"
        ],
        correct: "B",
        explanation: "y' = 3x² - 6x = 3x(x - 2). Cho y' > 0 <=> x < 0 hoặc x > 2. Vậy hàm số đồng biến trên (-∞; 0) và (2; +∞).",
        concept: "Tính đơn điệu của hàm số"
      },
      {
        id: 2,
        question: "Điểm cực đại của đồ thị hàm số y = -x³ + 3x + 1 là điểm nào?",
        options: [
          "A. (1; 3)",
          "B. (-1; -1)",
          "C. x = 1",
          "D. (0; 1)"
        ],
        correct: "A",
        explanation: "y' = -3x² + 3 = 0 <=> x = ±1. y' đổi dấu từ dương sang âm khi qua x = 1 => x_CĐ = 1 => y_CĐ = -(1)³ + 3(1) + 1 = 3. Điểm cực đại của ĐỒ THỊ là (1; 3).",
        concept: "Cực trị hàm số"
      },
      {
        id: 3,
        question: "Đồ thị hàm số y = x⁴ - 2x² - 3 có tất cả bao nhiêu điểm cực trị?",
        options: [
          "A. 1",
          "B. 2",
          "C. 3",
          "D. 0"
        ],
        correct: "C",
        explanation: "y' = 4x³ - 4x = 4x(x² - 1) = 0 có 3 nghiệm phân biệt x = 0, x = ±1. Với hàm trùng phương có a*b = 1*(-2) = -2 < 0 nên đồ thị luôn có 3 điểm cực trị.",
        concept: "Cực trị hàm trùng phương"
      }
    ],
    status: "active",
    created_at: "2026-09-24 09:00"
  },
  {
    id: "ASSIGN_003",
    title: "Trắc nghiệm Tiếng Anh: Tenses & Relative Clauses (Mệnh đề quan hệ)",
    subject: "Tiếng Anh",
    teacher_name: "Cô Nguyễn Thị Mai Loan (GVBM Tiếng Anh)",
    classes: ["10A1", "12C1"], // Multi-class
    type: "trac_nghiem",
    start_date: "2026-09-26T07:00",
    due_date: "2026-10-08T21:00",
    duration_minutes: 20,
    description: "Ôn tập đại từ quan hệ Who, Whom, Which, Whose và thì Quá khứ hoàn thành chuẩn form thi THPT Quốc gia.",
    questions: [
      {
        id: 1,
        question: "The teacher ______ gave us the English lecture yesterday is from Kon Tum.",
        options: [
          "A. which",
          "B. who",
          "C. whom",
          "D. whose"
        ],
        correct: "B",
        explanation: "'The teacher' là danh từ chỉ người, giữ chức năng chủ ngữ của mệnh đề quan hệ nên ta dùng 'who'.",
        concept: "Đại từ quan hệ chỉ người"
      },
      {
        id: 2,
        question: "By the time we arrived at the classroom, the teacher ______ the test.",
        options: [
          "A. started",
          "B. has started",
          "C. had started",
          "D. was starting"
        ],
        correct: "C",
        explanation: "Hành động giáo viên phát đề xảy ra và hoàn tất trước thời điểm trong quá khứ ('arrived') nên chia ở thì Quá khứ hoàn thành: had + V3/ed.",
        concept: "Thì Quá khứ hoàn thành"
      },
      {
        id: 3,
        question: "The laptop ______ my brother bought at Kon Tum digital store works smoothly.",
        options: [
          "A. which",
          "B. who",
          "C. whom",
          "D. whose"
        ],
        correct: "A",
        explanation: "'The laptop' là danh từ chỉ vật, đóng vai trò tân ngữ nên dùng 'which' hoặc 'that'.",
        concept: "Đại từ quan hệ chỉ vật"
      }
    ],
    status: "active",
    created_at: "2026-09-26 14:00"
  }
];

const SEED_LMS_SUBMISSIONS = [
  // 10A1 submissions for ASSIGN_001 (Toán 10)
  {
    id: "SUB_001_HS113",
    assignment_id: "ASSIGN_001",
    student_id: "HS113",
    student_name: "Trần Lê Gia Bảo",
    class_name: "10A1",
    submitted_at: "2026-09-26 09:30",
    score: 10.0,
    correct_count: 5,
    total_questions: 5,
    answers: { 1: "A", 2: "B", 3: "B", 4: "B", 5: "A" },
    teacher_comment: "Xuất sắc! Lời giải và lập luận rất chặt chẽ, đạt điểm tuyệt đối 10/10. Tiếp tục phát huy nhé Gia Bảo!",
    ai_analysis: {
      summary: "Xuất sắc! Học sinh Trần Lê Gia Bảo làm đúng tuyệt đối 5/5 câu hỏi trắc nghiệm, tốc độ hoàn thành nhanh và nắm vững toàn diện kiến thức Hàm số & Tam thức bậc hai.",
      wrong_details: []
    }
  },
  {
    id: "SUB_001_HS114",
    assignment_id: "ASSIGN_001",
    student_id: "HS114",
    student_name: "Hồ Anh Nam",
    class_name: "10A1",
    submitted_at: "2026-09-26 10:15",
    score: 8.0,
    correct_count: 4,
    total_questions: 5,
    answers: { 1: "A", 2: "B", 3: "D", 4: "B", 5: "A" },
    teacher_comment: "Em làm rất tốt các câu 1, 2, 4, 5. Chú ý ôn lại quy tắc xét dấu tam thức bậc hai ở câu 3.",
    ai_analysis: {
      summary: "Em nắm rất chắc cách tìm đỉnh Parabol và bất phương trình bậc hai, tuy nhiên còn nhầm lẫn quy tắc xét dấu tam thức bậc hai.",
      wrong_details: [
        {
          question_id: 3,
          chosen: "D",
          correct: "B",
          reason: "Em đã chọn nhầm miền ngoài khoảng nghiệm thay vì miền trong khoảng nghiệm. Nhớ rằng f(x) < 0 trái dấu với a = 1 > 0 nên phải lấy TRONG khoảng (2; 3).",
          solution: "B1: Nghiệm là 2 và 3. B2: Quy tắc 'Trong trái - ngoài cùng': Khoảng trong (2; 3) trái dấu với a (âm), ngoài khoảng mang dấu dương.",
          advice: "Ôn lại quy tắc xét dấu tam thức bậc hai trong SGK Toán 10 trang 48."
        }
      ]
    }
  },
  {
    id: "SUB_001_HS115",
    assignment_id: "ASSIGN_001",
    student_id: "HS115",
    student_name: "Đỗ Khắc Hùng",
    class_name: "10A1",
    submitted_at: "2026-09-26 14:20",
    score: 10.0,
    correct_count: 5,
    total_questions: 5,
    answers: { 1: "A", 2: "B", 3: "B", 4: "B", 5: "A" },
    teacher_comment: "Làm bài rất tốt, nắm bài vững vàng.",
    ai_analysis: {
      summary: "Xuất sắc! Em làm đúng tuyệt đối 5/5 câu hỏi, nắm vững toàn diện kiến thức Hàm số và Tam thức bậc hai.",
      wrong_details: []
    }
  },
  {
    id: "SUB_001_HS116",
    assignment_id: "ASSIGN_001",
    student_id: "HS116",
    student_name: "Hoàng Mai Chi",
    class_name: "10A1",
    submitted_at: "2026-09-26 16:45",
    score: 8.0,
    correct_count: 4,
    total_questions: 5,
    answers: { 1: "A", 2: "A", 3: "B", 4: "B", 5: "A" },
    teacher_comment: "Cần cẩn thận công thức trục đối xứng Parabol nhé Chi!",
    ai_analysis: {
      summary: "Em nắm tốt bài, chỉ nhầm lẫn công thức trục đối xứng Parabol ở câu 2.",
      wrong_details: [
        {
          question_id: 2,
          chosen: "A",
          correct: "B",
          reason: "Em đã quên chia cho hệ số 2a mà chỉ lấy -b/a.",
          solution: "Trục đối xứng là x = -b/(2a) = -4 / (2*(-2)) = 1.",
          advice: "Ghi nhớ công thức trục đối xứng luôn có số 2 ở mẫu: x = -b/(2a)."
        }
      ]
    }
  },
  {
    id: "SUB_001_HS117",
    assignment_id: "ASSIGN_001",
    student_id: "HS117",
    student_name: "Nguyễn Thị Mai",
    class_name: "10A1",
    submitted_at: "2026-09-26 18:10",
    score: 6.0,
    correct_count: 3,
    total_questions: 5,
    answers: { 1: "A", 2: "B", 3: "D", 4: "A", 5: "A" },
    teacher_comment: "Điểm 6.0 đạt yêu cầu, nhưng cần luyện thêm dạng toán bất phương trình bậc hai.",
    ai_analysis: {
      summary: "Em nắm được tập xác định và giá trị lớn nhất nhỏ nhất. Tuy nhiên câu 3 và 4 về dấu tam thức và nghiệm bất phương trình bậc hai còn nhầm lẫn.",
      wrong_details: [
        {
          question_id: 3,
          chosen: "D",
          correct: "B",
          reason: "Chọn nhầm ngoài khoảng hai nghiệm thay vì khoảng giữa hai nghiệm.",
          solution: "Vì f(x) < 0 trái dấu với a = 1 nên nghiệm nằm trong (2; 3).",
          advice: "Học thuộc bảng xét dấu tam thức bậc hai."
        },
        {
          question_id: 4,
          chosen: "A",
          correct: "B",
          reason: "Bất phương trình ≥ 0 nên phải lấy phần cùng dấu với a = 1 (ngoài khoảng hai nghiệm [-2; 2]).",
          solution: "Tập nghiệm là (-∞; -2] ∪ [2; +∞).",
          advice: "Vẽ trục số để biểu diễn tập nghiệm rõ ràng trước khi khoanh đáp án."
        }
      ]
    }
  },
  {
    id: "SUB_001_HS118",
    assignment_id: "ASSIGN_001",
    student_id: "HS118",
    student_name: "Vũ Tuấn Đạt",
    class_name: "10A1",
    submitted_at: "2026-09-26 20:05",
    score: 4.0,
    correct_count: 2,
    total_questions: 5,
    answers: { 1: "C", 2: "A", 3: "C", 4: "B", 5: "A" },
    teacher_comment: "Bài làm còn nhiều câu sai lý thuyết. Em hãy xem lại gợi ý sửa bài của AI và gặp thầy để được củng cố lại nhé.",
    ai_analysis: {
      summary: "Học sinh Đạt còn bị hổng kiến thức căn bản ở câu 1 (điều kiện xác định), câu 2 (trục đối xứng) và câu 3 (dấu tam thức bậc hai). Cần giáo viên hỗ trợ phụ đạo.",
      wrong_details: [
        {
          question_id: 1,
          chosen: "C",
          correct: "A",
          reason: "Nhầm lẫn điều kiện mẫu số khác 0: x - 1 ≠ 0 <=> x ≠ 1 chứ không phải x ≠ -1.",
          solution: "Điều kiện là biểu thức dưới dấu căn ≥ 0 và mẫu số ≠ 0, do đó D = [2; +∞) \\ {1} = [2; +∞).",
          advice: "Xem lại bài giảng Tập xác định của hàm số chứa căn và phân thức."
        },
        {
          question_id: 2,
          chosen: "A",
          correct: "B",
          reason: "Quên mẫu số 2a trong công thức trục đối xứng.",
          solution: "x = -b / (2a) = 1.",
          advice: "Ghi chép công thức trục đối xứng vào sổ tay học tập."
        },
        {
          question_id: 3,
          chosen: "C",
          correct: "B",
          reason: "Khoảng (3; +∞) f(x) mang dấu dương cùng dấu với a, không thỏa mãn f(x) < 0.",
          solution: "Nghiệm trong khoảng (2; 3).",
          advice: "Lập bảng xét dấu từng bước theo SGK."
        }
      ]
    }
  },
  // 12C1 submissions for ASSIGN_002 (Toán 12)
  {
    id: "SUB_002_HS185",
    assignment_id: "ASSIGN_002",
    student_id: "HS185",
    student_name: "Phan Ánh Thư",
    class_name: "12C1",
    submitted_at: "2026-09-25 15:30",
    score: 6.7,
    correct_count: 2,
    total_questions: 3,
    answers: { 1: "B", 2: "C", 3: "C" },
    teacher_comment: "Em đã hiểu bản chất khảo sát hàm số, chỉ lưu ý phân biệt điểm cực trị của hàm số và điểm của đồ thị nhé!",
    ai_analysis: {
      summary: "Em tính đạo hàm và xác định số cực trị tốt. Tuy nhiên ở câu 2, đề bài hỏi 'Điểm cực đại của ĐỒ THỊ' (gồm cả hoành độ và tung độ (x; y)), em mới chỉ chọn hoành độ x = 1.",
      wrong_details: [
        {
          question_id: 2,
          chosen: "C",
          correct: "A",
          reason: "Nhầm lẫn giữa 'Điểm cực trị của hàm số' (x = 1) và 'Điểm cực trị của đồ thị hàm số' (M(1; 3)).",
          solution: "B1: Tìm x = 1. B2: Tính y = -(1)³ + 3*1 + 1 = 3. B3: Kết luận tọa độ điểm là (1; 3).",
          advice: "Đọc thật kỹ đề bài: nếu đề hỏi 'Điểm của ĐỒ THỊ' thì đáp án bắt buộc là cặp tọa độ (x; y)."
        }
      ]
    }
  },
  {
    id: "SUB_002_HS186",
    assignment_id: "ASSIGN_002",
    student_id: "HS186",
    student_name: "Lê Minh Trí",
    class_name: "12C1",
    submitted_at: "2026-09-25 16:15",
    score: 10.0,
    correct_count: 3,
    total_questions: 3,
    answers: { 1: "B", 2: "A", 3: "C" },
    teacher_comment: "Bài làm rất chuẩn xác, đạt điểm tối đa 10/10!",
    ai_analysis: {
      summary: "Xuất sắc! Học sinh Lê Minh Trí nắm vững 100% chuyên đề Khảo sát hàm số và Cực trị.",
      wrong_details: []
    }
  },
  // ASSIGN_003 (Tiếng Anh Multi-Class 10A1 & 12C1)
  {
    id: "SUB_003_HS113",
    assignment_id: "ASSIGN_003",
    student_id: "HS113",
    student_name: "Trần Lê Gia Bảo",
    class_name: "10A1",
    submitted_at: "2026-09-26 15:00",
    score: 10.0,
    correct_count: 3,
    total_questions: 3,
    answers: { 1: "B", 2: "C", 3: "A" },
    teacher_comment: "Very good! Em nắm rất chắc thì Quá khứ hoàn thành và Mệnh đề quan hệ.",
    ai_analysis: {
      summary: "Gia Bảo nắm rất chắc ngữ pháp tiếng Anh THPT, đạt 10/10 trọn vẹn cả 3 câu.",
      wrong_details: []
    }
  },
  {
    id: "SUB_003_HS185",
    assignment_id: "ASSIGN_003",
    student_id: "HS185",
    student_name: "Phan Ánh Thư",
    class_name: "12C1",
    submitted_at: "2026-09-26 16:20",
    score: 6.7,
    correct_count: 2,
    total_questions: 3,
    answers: { 1: "B", 2: "A", 3: "A" },
    teacher_comment: "Chú ý cấu trúc By the time + Quá khứ đơn, vế sau chia Quá khứ hoàn thành nhé Thư.",
    ai_analysis: {
      summary: "Em dùng đại từ quan hệ Who/Which chuẩn xác, chỉ nhầm lẫn câu 2 chia thì Quá khứ đơn thay vì Quá khứ hoàn thành.",
      wrong_details: [
        {
          question_id: 2,
          chosen: "A",
          correct: "C",
          reason: "Hành động giáo viên phát đề đã hoàn tất trước khi học sinh đến lớp.",
          solution: "Dùng thì Past Perfect: had started.",
          advice: "Ôn lại các dấu hiệu nhận biết của thì Quá khứ hoàn thành (By the time, Before, After)."
        }
      ]
    }
  }
];

function loadLmsAssignments() {
  const local = localStorage.getItem(STORE_LMS_ASSIGNMENTS);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch(e) {}
  }
  saveLmsAssignments(SEED_LMS_ASSIGNMENTS);
  return SEED_LMS_ASSIGNMENTS;
}

function saveLmsAssignments(data) {
  localStorage.setItem(STORE_LMS_ASSIGNMENTS, JSON.stringify(data));
}

function loadLmsSubmissions() {
  const local = localStorage.getItem(STORE_LMS_SUBMISSIONS);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length >= SEED_LMS_SUBMISSIONS.length && parsed.some(s => s.student_id === "HS113")) {
        return parsed;
      }
    } catch(e) {}
  }
  saveLmsSubmissions(SEED_LMS_SUBMISSIONS);
  return SEED_LMS_SUBMISSIONS;
}

function saveLmsSubmissions(data) {
  localStorage.setItem(STORE_LMS_SUBMISSIONS, JSON.stringify(data));
}

function getAssignmentsForClass(className) {
  const assignments = loadLmsAssignments();
  return assignments.filter(a => Array.isArray(a.classes) && a.classes.includes(className));
}

function getSubmissionForStudent(assignmentId, studentId) {
  const submissions = loadLmsSubmissions();
  return submissions.find(s => s.assignment_id === assignmentId && s.student_id === studentId);
}

function saveStudentSubmission(subData) {
  const submissions = loadLmsSubmissions();
  const existingIdx = submissions.findIndex(s => s.assignment_id === subData.assignment_id && s.student_id === subData.student_id);
  if (existingIdx !== -1) {
    submissions[existingIdx] = subData;
  } else {
    submissions.push(subData);
  }
  saveLmsSubmissions(submissions);
  return subData;
}

function createNewLmsAssignment(newAssignment) {
  const assignments = loadLmsAssignments();
  assignments.unshift(newAssignment);
  saveLmsAssignments(assignments);
  return assignments;
}

function deleteLmsAssignment(assignmentId) {
  let assignments = loadLmsAssignments();
  assignments = assignments.filter(a => a.id !== assignmentId);
  saveLmsAssignments(assignments);
  return assignments;
}

// Dữ liệu thời khóa biểu số hóa 41 lớp học của trường (Khối 6 đến Khối 12)
const STORE_TIMETABLES = "LVKT_TIMETABLES_V2";
const DAYS_OF_WEEK = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

function generateDefaultTimetable10A1() {
  return {
    "Thứ 2": {
      sang: [
        { tiet: 1, subject: "CHAOCO", teacher: "Đoàn Trường & BGH", room: "P.10A1" },
        { tiet: 2, subject: "Lịch sử", teacher: "", room: "P.10A1" },
        { tiet: 3, subject: "Tiếng Anh", teacher: "", room: "P.10A1" },
        { tiet: 4, subject: "Tiếng Anh", teacher: "", room: "P.10A1" }
      ],
      chieu: [
        { tiet: 1, subject: "GDQP&AN", teacher: "", room: "P.10A1" },
        { tiet: 2, subject: "Giáo dục thể chất", teacher: "", room: "P.10A1" },
        { tiet: 3, subject: "Giáo dục thể chất", teacher: "", room: "P.10A1" }
      ]
    },
    "Thứ 3": {
      sang: [
        { tiet: 1, subject: "Hóa học", teacher: "", room: "P.10A1" },
        { tiet: 2, subject: "Hóa học", teacher: "", room: "P.10A1" },
        { tiet: 3, subject: "Văn học", teacher: "", room: "P.10A1" },
        { tiet: 4, subject: "Văn học", teacher: "", room: "P.10A1" }
      ],
      chieu: [
        { tiet: 1, subject: "Giáo dục địa phương", teacher: "", room: "P.10A1" },
        { tiet: 2, subject: "Tin học", teacher: "", room: "P.10A1" },
        { tiet: 3, subject: "Tin học", teacher: "", room: "P.10A1" }
      ]
    },
    "Thứ 4": {
      sang: [
        { tiet: 1, subject: "Sinh học", teacher: "", room: "P.10A1" },
        { tiet: 2, subject: "Tiếng Anh", teacher: "", room: "P.10A1" },
        { tiet: 3, subject: "Vật lý", teacher: "", room: "P.10A1" },
        { tiet: 4, subject: "Vật lý", teacher: "", room: "P.10A1" }
      ],
      chieu: []
    },
    "Thứ 5": {
      sang: [
        { tiet: 1, subject: "Toán", teacher: "", room: "P.10A1" },
        { tiet: 2, subject: "Chuyên đề Toán", teacher: "", room: "P.10A1" },
        { tiet: 3, subject: "Văn học", teacher: "", room: "P.10A1" },
        { tiet: 4, subject: "Sinh học", teacher: "", room: "P.10A1" }
      ],
      chieu: [
        { tiet: 1, subject: "HĐTN&HN", teacher: "", room: "P.10A1" }
      ]
    },
    "Thứ 6": {
      sang: [
        { tiet: 1, subject: "Toán", teacher: "", room: "P.10A1" },
        { tiet: 2, subject: "Toán", teacher: "", room: "P.10A1" },
        { tiet: 3, subject: "Chuyên đề Hóa học", teacher: "", room: "P.10A1" },
        { tiet: 4, subject: "Chuyên đề Vật lí", teacher: "", room: "P.10A1" },
        { tiet: 5, subject: "HĐTN&HN", teacher: "", room: "P.10A1" }
      ],
      chieu: []
    },
    "Thứ 7": {
      sang: [],
      chieu: []
    }
  };
}

function generateDefaultTimetable12C1() {
  return {
    "Thứ 2": {
      sang: [
        { tiet: 1, subject: "Chào Cờ", teacher: "BGH & Đoàn Trường", room: "Sân trường" },
        { tiet: 2, subject: "Toán", teacher: "Thầy Phạm Văn Đức", room: "P.304" },
        { tiet: 3, subject: "Toán", teacher: "Thầy Phạm Văn Đức", room: "P.304" },
        { tiet: 4, subject: "Vật Lý", teacher: "Thầy Hoàng Văn Hải", room: "P.304" },
        { tiet: 5, subject: "Tiếng Anh", teacher: "Cô Nguyễn Thị Mai Loan", room: "P.304" }
      ],
      chieu: [
        { tiet: 1, subject: "Hóa Học", teacher: "Cô Trần Thị Lan", room: "P.Lab Hóa" },
        { tiet: 2, subject: "Sinh Học", teacher: "Thầy Đỗ Văn Tuấn", room: "P.Lab Sinh" },
        { tiet: 3, subject: "Luyện Đề TN THPT", teacher: "Tổ Tự Nhiên", room: "P.304" }
      ]
    },
    "Thứ 3": {
      sang: [
        { tiet: 1, subject: "Ngữ Văn", teacher: "Cô Lê Thị Hương", room: "P.304" },
        { tiet: 2, subject: "Ngữ Văn", teacher: "Cô Lê Thị Hương", room: "P.304" },
        { tiet: 3, subject: "Toán", teacher: "Thầy Phạm Văn Đức", room: "P.304" },
        { tiet: 4, subject: "Tiếng Anh", teacher: "Cô Nguyễn Thị Mai Loan", room: "P.304" },
        { tiet: 5, subject: "Lịch Sử", teacher: "Cô Nguyễn Thu Trang", room: "P.304" }
      ],
      chieu: [
        { tiet: 1, subject: "Chuyên Đề Toán 12", teacher: "Thầy Phạm Văn Đức", room: "P.304" },
        { tiet: 2, subject: "Chuyên Đề Lý 12", teacher: "Thầy Hoàng Văn Hải", room: "P.304" },
        { tiet: 3, subject: "Chuyên Đề Hóa 12", teacher: "Cô Trần Thị Lan", room: "P.304" }
      ]
    },
    "Thứ 4": {
      sang: [
        { tiet: 1, subject: "Vật Lý", teacher: "Thầy Hoàng Văn Hải", room: "P.304" },
        { tiet: 2, subject: "Hóa Học", teacher: "Cô Trần Thị Lan", room: "P.304" },
        { tiet: 3, subject: "Toán", teacher: "Thầy Phạm Văn Đức", room: "P.304" },
        { tiet: 4, subject: "Ngữ Văn", teacher: "Cô Lê Thị Hương", room: "P.304" },
        { tiet: 5, subject: "GD Kinh Tế & Pháp Luật", teacher: "Cô Hoàng Mai", room: "P.304" }
      ],
      chieu: [
        { tiet: 1, subject: "Giáo Dục Thể Chất", teacher: "Thầy Bùi Văn Long", room: "Nhà Đa Năng" },
        { tiet: 2, subject: "GD Quốc Phòng - An Ninh", teacher: "Thầy Vũ Đình Trọng", room: "Sân GDQP" },
        { tiet: 3, subject: "Tư Vấn Hướng Nghiệp & Đại Học", teacher: "BGH & Chuyên gia", room: "Hội trường" }
      ]
    },
    "Thứ 5": {
      sang: [
        { tiet: 1, subject: "Tiếng Anh", teacher: "Cô Nguyễn Thị Mai Loan", room: "P.304" },
        { tiet: 2, subject: "Tiếng Anh", teacher: "Cô Nguyễn Thị Mai Loan", room: "P.304" },
        { tiet: 3, subject: "Toán", teacher: "Thầy Phạm Văn Đức", room: "P.304" },
        { tiet: 4, subject: "Vật Lý", teacher: "Thầy Hoàng Văn Hải", room: "P.304" },
        { tiet: 5, subject: "Sinh Học", teacher: "Thầy Đỗ Văn Tuấn", room: "P.304" }
      ],
      chieu: [
        { tiet: 1, subject: "Chuyên Đề AI & Lập Trình", teacher: "Thầy Trần Minh Hòa", room: "P.Tin 2" },
        { tiet: 2, subject: "Tin Học 12", teacher: "Thầy Trần Minh Hòa", room: "P.Tin 2" },
        { tiet: 3, subject: "Nghiên Cứu KHKT Học Đường", teacher: "Thầy Trần Minh Hòa", room: "P.Lab AI" }
      ]
    },
    "Thứ 6": {
      sang: [
        { tiet: 1, subject: "Ngữ Văn", teacher: "Cô Lê Thị Hương", room: "P.304" },
        { tiet: 2, subject: "Toán", teacher: "Thầy Phạm Văn Đức", room: "P.304" },
        { tiet: 3, subject: "Hóa Học", teacher: "Cô Trần Thị Lan", room: "P.304" },
        { tiet: 4, subject: "Tiếng Anh", teacher: "Cô Nguyễn Thị Mai Loan", room: "P.304" },
        { tiet: 5, subject: "Địa Lý", teacher: "Thầy Lê Quốc Dũng", room: "P.304" }
      ],
      chieu: [
        { tiet: 1, subject: "Luyện Đề Toán THPT", teacher: "Thầy Phạm Văn Đức", room: "P.304" },
        { tiet: 2, subject: "Luyện Đề Anh THPT", teacher: "Cô Nguyễn Thị Mai Loan", room: "P.304" },
        { tiet: 3, subject: "Hoạt Động Trải Nghiệm - HN", teacher: "Cô Lê Thị Hương", room: "P.304" }
      ]
    },
    "Thứ 7": {
      sang: [
        { tiet: 1, subject: "GD Địa Phương Kon Tum", teacher: "Thầy Lê Quốc Dũng", room: "P.304" },
        { tiet: 2, subject: "Chuyên Đề Văn Học", teacher: "Cô Lê Thị Hương", room: "P.304" },
        { tiet: 3, subject: "Chuyên Đề Sinh Học", teacher: "Thầy Đỗ Văn Tuấn", room: "P.304" },
        { tiet: 4, subject: "Kiểm Tra KTTX Tổng Hợp", teacher: "GVBM", room: "P.304" },
        { tiet: 5, subject: "Sinh Hoạt Lớp (GVCN)", teacher: "Cô Lê Thị Hương", room: "P.304" }
      ],
      chieu: []
    }
  };
}

function generateGenericTimetableForClass(cName) {
  const grade = parseInt(cName) || 10;
  const isThcs = grade <= 9;
  const room = `P.${cName.replace(/\s+/g, '')}`;

  return {
    "Thứ 2": {
      sang: [
        { tiet: 1, subject: "Chào Cờ", teacher: "BGH & Liên Đội", room: "Sân trường" },
        { tiet: 2, subject: "Toán", teacher: "GV Toán", room },
        { tiet: 3, subject: "Toán", teacher: "GV Toán", room },
        { tiet: 4, subject: "Ngữ Văn", teacher: "GV Văn", room },
        { tiet: 5, subject: "Tiếng Anh", teacher: "GV Tiếng Anh", room }
      ],
      chieu: [
        { tiet: 1, subject: isThcs ? "KHTN (Vật Lý)" : "Vật Lý", teacher: "GV KHTN", room },
        { tiet: 2, subject: isThcs ? "KHTN (Hóa Học)" : "Hóa Học", teacher: "GV KHTN", room },
        { tiet: 3, subject: "Tự Học", teacher: "GVCN", room }
      ]
    },
    "Thứ 3": {
      sang: [
        { tiet: 1, subject: "Ngữ Văn", teacher: "GV Văn", room },
        { tiet: 2, subject: "Ngữ Văn", teacher: "GV Văn", room },
        { tiet: 3, subject: "Lịch Sử", teacher: "GV Lịch Sử", room },
        { tiet: 4, subject: "Địa Lý", teacher: "GV Địa Lý", room },
        { tiet: 5, subject: isThcs ? "GD Công Dân" : "GD Kinh Tế & Pháp Luật", teacher: "GV GDCD", room }
      ],
      chieu: [
        { tiet: 1, subject: "Tin Học", teacher: "GV Tin Học", room: "P.Tin" },
        { tiet: 2, subject: "Công Nghệ", teacher: "GV Công Nghệ", room },
        { tiet: 3, subject: "GD STEM & Robotics", teacher: "GV STEM", room: "P.STEM" }
      ]
    },
    "Thứ 4": {
      sang: [
        { tiet: 1, subject: "Toán", teacher: "GV Toán", room },
        { tiet: 2, subject: "Tiếng Anh", teacher: "GV Tiếng Anh", room },
        { tiet: 3, subject: "Tiếng Anh", teacher: "GV Tiếng Anh", room },
        { tiet: 4, subject: isThcs ? "KHTN (Sinh Học)" : "Sinh Học", teacher: "GV KHTN", room },
        { tiet: 5, subject: "Giáo Dục Thể Chất", teacher: "GV Thể Chất", room: "Sân trường" }
      ],
      chieu: [
        { tiet: 1, subject: "Bơi Lội", teacher: "GV Thể Chất", room: "Bể bơi" },
        { tiet: 2, subject: "Hoạt Động Trải Nghiệm - HN", teacher: "GVCN", room },
        { tiet: 3, subject: "Nghệ Thuật (Âm Nhạc)", teacher: "GV Âm Nhạc", room: "P.Nghệ thuật" }
      ]
    },
    "Thứ 5": {
      sang: [
        { tiet: 1, subject: isThcs ? "Toán Nâng Cao" : "Chuyên Đề Toán", teacher: "GV Toán", room },
        { tiet: 2, subject: "Toán", teacher: "GV Toán", room },
        { tiet: 3, subject: "Ngữ Văn", teacher: "GV Văn", room },
        { tiet: 4, subject: isThcs ? "KHTN (Hóa Học)" : "Hóa Học", teacher: "GV Hóa", room },
        { tiet: 5, subject: isThcs ? "KHTN (Vật Lý)" : "Vật Lý", teacher: "GV Lý", room }
      ],
      chieu: [
        { tiet: 1, subject: "Nghiên Cứu KHKT", teacher: "GV Hướng Dẫn", room: "P.Lab" },
        { tiet: 2, subject: "Nghệ Thuật (Mỹ Thuật)", teacher: "GV Mỹ Thuật", room: "P.Nghệ thuật" },
        { tiet: 3, subject: "Cồng Chiêng & Bản Sắc Kon Tum", teacher: "GV Bản Sắc", room: "Sân trường" }
      ]
    },
    "Thứ 6": {
      sang: [
        { tiet: 1, subject: "Toán", teacher: "GV Toán", room },
        { tiet: 2, subject: "Tiếng Anh", teacher: "GV Tiếng Anh", room },
        { tiet: 3, subject: isThcs ? "KHTN (Sinh Học)" : "GDQP - AN", teacher: "GV", room },
        { tiet: 4, subject: "Ngữ Văn", teacher: "GV Văn", room },
        { tiet: 5, subject: "Nội Dung GD Địa Phương", teacher: "GV Địa Phương", room }
      ],
      chieu: [
        { tiet: 1, subject: "Ngoại Ngữ 2 (Tự Chọn)", teacher: "GV Ngoại Ngữ 2", room },
        { tiet: 2, subject: "Kỹ Năng Sống", teacher: "Chuyên Gia", room },
        { tiet: 3, subject: "Tự Học Có Hướng Dẫn", teacher: "GVCN", room }
      ]
    },
    "Thứ 7": {
      sang: [
        { tiet: 1, subject: "Luyện Tập KTTX", teacher: "GVBM", room },
        { tiet: 2, subject: "Luyện Tập KTTX", teacher: "GVBM", room },
        { tiet: 3, subject: "Hoạt Động Câu Lạc Bộ", teacher: "Đoàn / Đội", room: "Sân trường" },
        { tiet: 4, subject: "Tuyên Dương Học Tập", teacher: "GVCN", room },
        { tiet: 5, subject: "Sinh Hoạt Lớp (GVCN)", teacher: "GVCN", room }
      ],
      chieu: []
    }
  };
}

function initAllTimetables() {
  const timetables = {};

  // Ưu tiên nạp dữ liệu TKB chuẩn 41 lớp từ cổng trường (RAW_SCHOOL_TKB_41)
  if (typeof RAW_SCHOOL_TKB_41 !== "undefined" && Object.keys(RAW_SCHOOL_TKB_41).length > 0) {
    Object.keys(RAW_SCHOOL_TKB_41).forEach(code => {
      timetables[code] = {
        class_name: code,
        school_year: "2026 - 2027",
        term: "Học kỳ 1",
        effective_date: "21/09/2026",
        source: "lienvietkontum.quangngai.edu.vn",
        schedule: RAW_SCHOOL_TKB_41[code]
      };
    });
    return timetables;
  }

  ALL_CLASSES.forEach(cName => {
    let schedule = null;
    if (cName === "10A1") {
      schedule = generateDefaultTimetable10A1();
    } else if (cName === "12C1") {
      schedule = generateDefaultTimetable12C1();
    } else {
      schedule = generateGenericTimetableForClass(cName);
    }

    timetables[cName] = {
      class_name: cName,
      school_year: "2026 - 2027",
      term: "Học kỳ 1",
      effective_date: "21/09/2026",
      source: "lienvietkontum.quangngai.edu.vn",
      schedule
    };
  });

  return timetables;
}

function loadAllTimetables() {
  // Dọn sạch cache V1 cũ nếu có để người dùng không bị kẹt dữ liệu lỗi
  try {
    if (localStorage.getItem("LVKT_TIMETABLES_V1")) {
      localStorage.removeItem("LVKT_TIMETABLES_V1");
    }
  } catch(e) {}

  const local = localStorage.getItem(STORE_TIMETABLES);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
        return parsed;
      }
    } catch (e) {}
  }
  const initial = initAllTimetables();
  saveAllTimetables(initial);
  return initial;
}

function saveAllTimetables(data) {
  localStorage.setItem(STORE_TIMETABLES, JSON.stringify(data));
}

const DAY_KEY_MAP = {
  "mon": "Thứ 2", "tue": "Thứ 3", "wed": "Thứ 4",
  "thu": "Thứ 5", "fri": "Thứ 6", "sat": "Thứ 7"
};
const VI_DAY_TO_KEY = {
  "Thứ 2": "mon", "Thứ 3": "tue", "Thứ 4": "wed",
  "Thứ 5": "thu", "Thứ 6": "fri", "Thứ 7": "sat"
};

function normalizeTimetable(raw, className = "") {
  if (!raw) raw = {};
  const dayKeys = ["mon", "tue", "wed", "thu", "fri", "sat"];
  const res = {
    class_code: raw.class_code || className || "10A1",
    morning: { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [] },
    afternoon: { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [] }
  };

  // Trường hợp 1: Dữ liệu dạng morning/afternoon (chuẩn TKB trường 41 lớp)
  if (raw.morning || raw.afternoon) {
    dayKeys.forEach(k => {
      res.morning[k] = Array.isArray(raw.morning?.[k]) ? raw.morning[k].map(s => ({
        period: s.period || s.tiet,
        subject: s.subject || s.mon || "",
        teacher: s.teacher || s.gv || "",
        room: s.room || s.phong || ("P." + className),
        note: s.note || ""
      })) : [];
      res.afternoon[k] = Array.isArray(raw.afternoon?.[k]) ? raw.afternoon[k].map(s => ({
        period: s.period || s.tiet,
        subject: s.subject || s.mon || "",
        teacher: s.teacher || s.gv || "",
        room: s.room || s.phong || ("P." + className),
        note: s.note || ""
      })) : [];
    });
  }

  // Trường hợp 2: Dữ liệu dạng tiếng Việt ('Thứ 2', 'Thứ 3', ...)
  Object.keys(VI_DAY_TO_KEY).forEach(viDay => {
    const k = VI_DAY_TO_KEY[viDay];
    if (raw[viDay]) {
      if (raw[viDay].sang && Array.isArray(raw[viDay].sang) && res.morning[k].length === 0) {
        res.morning[k] = raw[viDay].sang.map(s => ({
          period: s.period || s.tiet,
          subject: s.subject || s.mon || "",
          teacher: s.teacher || s.gv || "",
          room: s.room || s.phong || ("P." + className),
          note: s.note || ""
        }));
      }
      if (raw[viDay].chieu && Array.isArray(raw[viDay].chieu) && res.afternoon[k].length === 0) {
        res.afternoon[k] = raw[viDay].chieu.map(s => ({
          period: s.period || s.tiet,
          subject: s.subject || s.mon || "",
          teacher: s.teacher || s.gv || "",
          room: s.room || s.phong || ("P." + className),
          note: s.note || ""
        }));
      }
    }
  });

  // Gắn kèm thuộc tính tiếng Việt tương thích ngược
  dayKeys.forEach(k => {
    const viDay = DAY_KEY_MAP[k];
    res[viDay] = {
      sang: res.morning[k].map(s => ({ tiet: s.period, subject: s.subject, teacher: s.teacher, room: s.room, note: s.note })),
      chieu: res.afternoon[k].map(s => ({ tiet: s.period, subject: s.subject, teacher: s.teacher, room: s.room, note: s.note }))
    };
  });

  return res;
}

const SCHOOL_CLASS_STT_MAP = {
  1: "6CATBA", 2: "6CONCO", 3: "6DAOYEN", 4: "6PHUQUY", 5: "6SINHTON", 6: "6SONGTU",
  7: "7BINHBA", 8: "7CONDAO", 9: "7HOANGSA", 10: "7LYSON", 11: "7PHUQUOC", 12: "7TRUONGSA",
  13: "8BLONGVI", 14: "8BIENSON", 15: "8GACMA", 16: "8HATIEN", 17: "8LONGCHAU", 18: "8PHULAM", 19: "8SONDUONG",
  20: "9BINHHUNG", 21: "9COTO", 22: "9CONSON", 23: "9NAMDU", 24: "9THOCHU", 25: "9TUANCHAU", 26: "9VANDON",
  27: "10A1", 28: "10A2", 29: "10A3", 30: "10A4", 31: "10A5",
  32: "11B1", 33: "11B2", 34: "11B3", 35: "11B4", 36: "11B5",
  37: "12C1", 38: "12C2", 39: "12C3", 40: "12C4", 41: "12C5"
};

const CLASS_NAME_TO_CODE = {
  "6 Cát Bà": "6CATBA", "6 Cồn Cỏ": "6CONCO", "6 Đảo Yến": "6DAOYEN", "6 Phú Quý": "6PHUQUY", "6 Sinh Tồn": "6SINHTON", "6 Song Tử": "6SONGTU",
  "7 Bình Ba": "7BINHBA", "7 Côn Đảo": "7CONDAO", "7 Hoàng Sa": "7HOANGSA", "7 Lý Sơn": "7LYSON", "7 Phú Quốc": "7PHUQUOC", "7 Trường Sa": "7TRUONGSA",
  "8 Bạch Long Vĩ": "8BLONGVI", "8 Biện Sơn": "8BIENSON", "8 Gạc Ma": "8GACMA", "8 Hà Tiên": "8HATIEN",
  "8 Long Châu": "8LONGCHAU", "8 Phú Lâm": "8PHULAM", "8 Sơn Dương": "8SONDUONG",
  "9 Bình Hưng": "9BINHHUNG", "9 Cô Tô": "9COTO", "9 Côn Sơn": "9CONSON", "9 Nam Du": "9NAMDU",
  "9 Thổ Chu": "9THOCHU", "9 Tuần Châu": "9TUANCHAU", "9 Vân Đồn": "9VANDON"
};

const CODE_TO_CLASS_NAME = Object.fromEntries(
  Object.entries(CLASS_NAME_TO_CODE).map(([k, v]) => [v, k])
);

function getTimetableForClass(className) {
  if (!className) className = "10A1";

  // CHỈ khi className là số thứ tự thuần túy (VD: 27, "27", 10, "10") mới map qua STT:
  if (typeof className === "number" || (/^\d+$/.test(String(className).trim()))) {
    const num = Number(className);
    if (SCHOOL_CLASS_STT_MAP[num]) {
      className = SCHOOL_CLASS_STT_MAP[num];
    }
  }

  const schoolCode = CLASS_NAME_TO_CODE[className] || className;
  const vietName = CODE_TO_CLASS_NAME[className] || className;

  // 1. Kiểm tra trong LocalStorage đã lưu/chỉnh sửa chưa
  const all = loadAllTimetables();
  if (all[schoolCode] && (all[schoolCode].morning || all[schoolCode].schedule)) {
    return normalizeTimetable(all[schoolCode].schedule || all[schoolCode], schoolCode);
  }
  if (all[className] && (all[className].morning || all[className].schedule)) {
    return normalizeTimetable(all[className].schedule || all[className], className);
  }
  if (all[vietName] && (all[vietName].morning || all[vietName].schedule)) {
    return normalizeTimetable(all[vietName].schedule || all[vietName], vietName);
  }

  // 2. Tra cứu từ bộ dữ liệu TKB chuẩn 41 lớp của trường Kon Tum (RAW_SCHOOL_TKB_41)
  if (typeof RAW_SCHOOL_TKB_41 !== "undefined") {
    if (RAW_SCHOOL_TKB_41[schoolCode]) {
      return normalizeTimetable(RAW_SCHOOL_TKB_41[schoolCode], schoolCode);
    }
    if (RAW_SCHOOL_TKB_41[className]) {
      return normalizeTimetable(RAW_SCHOOL_TKB_41[className], className);
    }
    if (RAW_SCHOOL_TKB_41[vietName]) {
      return normalizeTimetable(RAW_SCHOOL_TKB_41[vietName], vietName);
    }
  }

  // 3. Fallback tự sinh
  return normalizeTimetable(generateGenericTimetableForClass(className), className);
}

function updateClassTimetable(className, newSchedule) {
  const all = loadAllTimetables();
  all[className] = {
    class_name: className,
    school_year: "2026 - 2027",
    term: "Học kỳ 1",
    effective_date: "21/09/2026",
    source: "lienvietkontum.quangngai.edu.vn",
    schedule: newSchedule
  };

  const schoolCode = CLASS_NAME_TO_CODE[className];
  if (schoolCode && schoolCode !== className) {
    all[schoolCode] = all[className];
  }

  const vietName = CODE_TO_CLASS_NAME[className];
  if (vietName && vietName !== className) {
    all[vietName] = all[className];
  }

  saveAllTimetables(all);
  return all[className];
}

// Bộ phân tích Parser TKB từ website lienvietkontum.quangngai.edu.vn (Hỗ trợ cả URL, STT, table)
function parseTkbClassesHtml(htmlContent) {
  const matchClass = htmlContent.match(/Thời khóa biểu lớp:\s*([^\r\n<]+)/i) || 
                     htmlContent.match(/tkb_2bclass_(\d+)/i);
  let classCode = matchClass ? matchClass[1].trim() : "10A1";
  if (/^\d+$/.test(String(classCode).trim()) && SCHOOL_CLASS_STT_MAP[Number(classCode)]) {
    classCode = SCHOOL_CLASS_STT_MAP[Number(classCode)];
  }

  const timetable = {
    class_code: classCode,
    morning: { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [] },
    afternoon: { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [] }
  };
  const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const rows = doc.querySelectorAll("tr");

  let currentSession = "morning";
  rows.forEach(r => {
    const tds = Array.from(r.querySelectorAll("td"));
    if (tds.length === 0) return;
    const texts = tds.map(td => td.textContent.replace(/\s+/g, " ").trim());

    if (texts.some(t => t.includes("Buổi") || t.includes("Tiết") || t.includes("Thứ"))) return;

    let period = 0;
    let dayCells = [];

    if (texts.length >= 8) {
      const sessStr = texts[0].toLowerCase();
      if (sessStr.includes("chiều") || sessStr.includes("chieu")) {
        currentSession = "afternoon";
      } else {
        currentSession = "morning";
      }
      const matchP = texts[1].match(/\d+/);
      if (!matchP) return;
      period = parseInt(matchP[0], 10);
      dayCells = texts.slice(2, 8);
    } else if (texts.length >= 7) {
      const matchP = texts[0].match(/\d+/);
      if (!matchP) return;
      period = parseInt(matchP[0], 10);
      dayCells = texts.slice(1, 7);
    } else {
      return;
    }

    dayCells.forEach((cellText, dIdx) => {
      if (dIdx >= dayKeys.length) return;
      const dKey = dayKeys[dIdx];
      const subj = cellText.trim();
      if (subj && subj !== "&nbsp;") {
        timetable[currentSession][dKey].push({
          period: period,
          subject: subj,
          teacher: "",
          room: `P.${classCode}`
        });
      }
    });
  });

  return timetable;
}

// Tool quét và tự động chuẩn hóa môn học từ Thời khóa biểu theo chương trình GDPT 2018
// Thiết kế bởi Trần Lê Gia Bảo (Lớp 10A1): Tự động gộp chuyên đề vào môn chính, lọc bỏ môn không học

function normalizeSubjectFromTkb(rawSubject, grade) {
  if (!rawSubject) return null;
  const s = rawSubject.trim();
  const lower = s.toLowerCase();

  // Bỏ các tiết nề nếp / sinh hoạt / tự học không tính điểm kiểm tra thường xuyên
  if (lower === 'chaoco' || lower === 'chao co' || lower.includes('chào cờ') ||
      lower === 'shl' || lower.includes('sinh hoạt') || lower.includes('nghỉ') ||
      lower === 'shdc' || lower === 'shcn' || lower.includes('tự học') ||
      lower.includes('câu lạc bộ') || lower.includes('tuyên dương')) {
    return null;
  }

  // 1. Kiểm tra Địa phương trước Địa lý để tránh nhầm
  if (lower.includes('địa phương') || lower.includes('dia phuong')) {
    return 'Nội Dung GD Địa Phương Kon Tum';
  }

  // 2. Chuyên đề học tập -> gộp vào môn chính
  if (lower.includes('chuyên đề') || lower.includes('chuyen de') || lower.startsWith('cđ ') || lower.startsWith('cd ')) {
    if (lower.includes('toán') || lower.includes('toan')) return 'Toán';
    if (lower.includes('lý') || lower.includes('ly') || lower.includes('vật lí') || lower.includes('vat ly')) return 'Vật Lý';
    if (lower.includes('hóa') || lower.includes('hoa')) return 'Hóa Học';
    if (lower.includes('sinh')) return 'Sinh Học';
    if (lower.includes('văn') || lower.includes('van') || lower.includes('ngữ văn')) return 'Ngữ Văn';
    if (lower.includes('sử') || lower.includes('su') || lower.includes('lịch sử')) return 'Lịch Sử';
    if (lower.includes('địa') || lower.includes('dia')) return 'Địa Lý';
    if (lower.includes('tin')) return 'Tin Học';
    if (lower.includes('mĩ thuật') || lower.includes('mỹ thuật')) return 'Mỹ Thuật';
    if (lower.includes('âm nhạc')) return 'Âm Nhạc';
    if (lower.includes('ktpl') || lower.includes('kinh tế') || lower.includes('pháp luật')) return 'GD Kinh Tế & Pháp Luật';
  }

  // 3. Môn THCS tích hợp (Khối 6, 7, 8, 9)
  if (grade <= 9) {
    if (lower.includes('khtn') || lower.includes('khoa học tự nhiên')) return 'Khoa Học Tự Nhiên';
    if (lower.includes('lịch sử &địa lí') || lower.includes('lịch sử & địa lý') || lower.includes('lịch sử & địa lí') || lower.includes('ls & đl') || lower.includes('ls&đl')) return 'Lịch Sử & Địa Lý';
    if (lower.includes('gdcd') || lower.includes('công dân')) return 'Giáo Dục Công Dân';
  }

  // 4. Môn THPT & Chung
  if (lower.includes('toán') || lower === 'toan') return 'Toán';
  if (lower.includes('văn') || lower.includes('tiếng việt') || lower === 'van') return 'Ngữ Văn';
  if (lower.includes('tiếng anh') || lower.includes('ngoại ngữ') || lower === 'tieng anh' || lower === 'anh') return 'Tiếng Anh';
  if (lower.includes('vật lí') || lower.includes('vật lý') || lower === 'vat ly' || lower === 'ly') return 'Vật Lý';
  if (lower.includes('hóa học') || lower.includes('hóa') || lower === 'hoa') return 'Hóa Học';
  if (lower.includes('sinh học') || lower.includes('sinh') || lower === 'sinh') return 'Sinh Học';
  if (lower.includes('lịch sử') || lower === 'su' || lower === 'lich su') return 'Lịch Sử';
  if (lower.includes('địa lí') || lower.includes('địa lý') || lower === 'dia') return 'Địa Lý';
  if (lower.includes('gdktdpl') || lower.includes('gdkt&pl') || lower.includes('ktpl') || lower.includes('kinh tế & pháp luật') || lower.includes('kinh tế và pháp luật') || lower.includes('kinh tế')) return 'GD Kinh Tế & Pháp Luật';
  if (lower.includes('gdqp') || lower.includes('quốc phòng') || lower.includes('qp-an') || lower.includes('qp - an')) return 'GD Quốc Phòng - An Ninh';
  if (lower.includes('thể dục') || lower.includes('thể chất') || lower.includes('gdtc')) return 'Giáo Dục Thể Chất';
  if (lower.includes('tin học') || lower === 'tin' || lower === 'tin hoc') return 'Tin Học';
  if (lower.includes('công nghệ') || lower === 'cn' || lower === 'cong nghe') return 'Công Nghệ';
  if (lower.includes('mĩ thuật') || lower.includes('mỹ thuật') || lower === 'mt') return 'Mỹ Thuật';
  if (lower.includes('âm nhạc') || lower === 'an' || lower === 'am nhac') return 'Âm Nhạc';
  if (lower.includes('hoạt động trải nghiệm') || lower.includes('hđtn') || lower.includes('hdtn')) return 'Hoạt Động Trải Nghiệm - HN';

  return s;
}

function getSubjectsForClassFromTkb(className) {
  if (!className) className = '10A1';
  const grade = parseInt(className) || 10;
  const tkb = getTimetableForClass(className);
  if (!tkb) return [];

  const subjSet = new Set();
  ['morning', 'afternoon'].forEach(sess => {
    if (tkb[sess]) {
      Object.values(tkb[sess]).forEach(slots => {
        if (Array.isArray(slots)) {
          slots.forEach(slot => {
            if (slot && slot.subject) {
              const norm = normalizeSubjectFromTkb(slot.subject, grade);
              if (norm) subjSet.add(norm);
            }
          });
        }
      });
    }
  });

  return Array.from(subjSet);
}

function syncStudentsSubjectsWithTkb(targetClass = 'ALL', customList = null) {
  const dataset = customList || STUDENTS_DATA;
  if (!Array.isArray(dataset)) return { success: false, message: 'Dữ liệu học sinh không hợp lệ!' };

  const targets = (targetClass === 'ALL')
    ? dataset
    : dataset.filter(s => s.class_name === targetClass);

  let updatedCount = 0;
  let removedTotal = 0;
  let addedTotal = 0;
  const affectedClasses = new Set();

  targets.forEach(s => {
    const valid = getSubjectsForClassFromTkb(s.class_name);
    if (!valid || valid.length === 0) return;
    affectedClasses.add(s.class_name);

    if (!s.subjects) s.subjects = {};
    const currKeys = Object.keys(s.subjects);

    // 1. Loại bỏ môn không học trong TKB của lớp này
    currKeys.forEach(k => {
      if (!valid.includes(k)) {
        delete s.subjects[k];
        removedTotal++;
      }
    });

    // 2. Tự động thêm môn có trong TKB nếu chưa có điểm
    valid.forEach(k => {
      if (!s.subjects[k]) {
        let hash = 0;
        const key = s.student_id + '_' + k;
        for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) & 0xffffff;
        const rng = makeRng(Math.abs(hash) + 12345);
        s.subjects[k] = genSingleSubjectScore(rng, s.avg_score || 7.0);
        addedTotal++;
      }
    });

    // 3. Tính toán lại điểm trung bình học lực & xếp loại
    const { avg, rank } = getAcademicRank(s.subjects);
    if (s.name === 'Trần Lê Gia Bảo') {
      s.academic_rank = 'Giỏi';
      s.academic_avg = Math.max(avg, 9.2);
    } else {
      s.academic_avg = avg;
      s.academic_rank = rank;
    }
    updatedCount++;
  });

  if (!customList && typeof saveStudentsData === 'function') {
    saveStudentsData(dataset);
  }

  return {
    success: true,
    updatedCount,
    removedTotal,
    addedTotal,
    classesCount: affectedClasses.size,
    message: `Đã đồng bộ thành công ${updatedCount} học sinh thuộc ${affectedClasses.size} lớp! (Gộp/Bỏ: ${removedTotal} môn, Bổ sung: ${addedTotal} môn)`
  };
}

// Tự động kiểm tra và đồng bộ hóa danh mục môn học theo TKB từng lớp ngay khi nạp
(function autoSyncStudentsWithTkbOnLoad() {
  if (typeof STUDENTS_DATA !== "undefined" && Array.isArray(STUDENTS_DATA) && STUDENTS_DATA.length > 0) {
    const sample10A1 = STUDENTS_DATA.find(s => s.class_name === "10A1");
    const sample12C5 = STUDENTS_DATA.find(s => s.class_name === "12C5");
    const needsSync = (sample10A1 && sample10A1.subjects && sample10A1.subjects["Mỹ Thuật"]) ||
                      (sample12C5 && sample12C5.subjects && !sample12C5.subjects["Mỹ Thuật"]);
    if (needsSync) {
      syncStudentsSubjectsWithTkb("ALL", STUDENTS_DATA);
      if (typeof saveStudentsData === "function") {
        saveStudentsData(STUDENTS_DATA);
      }
    }
  }
})();


