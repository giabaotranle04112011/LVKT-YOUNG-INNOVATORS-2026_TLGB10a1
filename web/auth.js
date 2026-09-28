/**
 * HỆ THỐNG XÁC THỰC & PHÂN QUYỀN TRUY CẬP 6 VAI TRÒ (RBAC)
 * Đề tài KHKT: Phần mềm Quản trị trường học & Cảnh báo sớm EDU-GUARD AI
 * 
 * Tác giả: Trần Lê Gia Bảo (Lớp 10A1 - THCS & THPT Liên Việt Kon Tum)
 * Năm học: 2026 - 2027
 * 
 * Các vai trò được phân quyền:
 * 1. superadmin: Admin tác giả (Gia Bảo) - toàn quyền cấu hình
 * 2. manager: Ban Giám Hiệu - giám sát toàn diện 41 lớp
 * 3. supervisor: Tổng Phụ Trách Đội - quản lý nề nếp, hạnh kiểm
 * 4. homeroom_teacher: Giáo Viên Chủ Nhiệm - quản lý học sinh theo lớp
 * 5. subject_teacher: Giáo Viên Bộ Môn - quản lý điểm & giao bài tập LMS
 * 6. student: Học sinh - cổng cá nhân tra cứu TKB, làm bài LMS & AI EDU-BOT
 */

const STORE_USERS   = "LVKONTUM_USERS_V3";
const STORE_SESSION = "LVKONTUM_SESSION_V3";

const ROLE_LABELS = {
  superadmin:       "👑 Admin Tổng",
  manager:          "🏛️ Ban Giám Hiệu",
  supervisor:       "🎗️ Tổng Phụ Trách",
  homeroom_teacher: "📋 Giáo Viên Chủ Nhiệm",
  subject_teacher:  "📖 Giáo Viên Bộ Môn",
  student:          "🎒 Học Sinh"
};

const ROLE_COLORS = {
  superadmin:       "#7c3aed",
  manager:          "#0284c7",
  supervisor:       "#0891b2",
  homeroom_teacher: "#059669",
  subject_teacher:  "#d97706",
  student:          "#16a34a"
};

const ADMIN_ROLES = ["superadmin","manager","supervisor","homeroom_teacher","subject_teacher"];

const SEED_USERS = [
  {
    id: "ACC_SUPERADMIN",
    username: "giabaotranle04",
    password: "1414@#22gbbn",
    role: "superadmin",
    display_name: "Gia Bảo Trần Lê",
    student_id: null, class_assigned: null, subject_assigned: null,
    created_at: "Hệ thống"
  },
  {
    id: "ACC_BGH",
    username: "bgh_kontum",
    password: "bgh2026",
    role: "manager",
    display_name: "Thầy Nguyễn Văn Hùng (BGH)",
    student_id: null, class_assigned: null, subject_assigned: null,
    created_at: "Hệ thống"
  },
  {
    id: "ACC_TPT",
    username: "tpt_lienviett",
    password: "tpt2026",
    role: "supervisor",
    display_name: "Thầy Trần Minh Hòa (TPT Đội)",
    student_id: null, class_assigned: null, subject_assigned: null,
    created_at: "Hệ thống"
  },
  {
    id: "ACC_GVCN_12C1",
    username: "gvcn_12c1",
    password: "gvcn2026",
    role: "homeroom_teacher",
    display_name: "Cô Lê Thị Hương (GVCN 12C1)",
    student_id: null, class_assigned: "12C1", subject_assigned: null,
    created_at: "Hệ thống"
  },
  {
    id: "ACC_GVCN_8BLV",
    username: "gvcn_8blv",
    password: "gvcn2026",
    role: "homeroom_teacher",
    display_name: "Thầy Hoàng Quốc Bảo (GVCN 8 Bạch Long Vĩ)",
    student_id: null, class_assigned: "8 Bạch Long Vĩ", subject_assigned: null,
    created_at: "Hệ thống"
  },
  {
    id: "ACC_GVBM_TOAN",
    username: "gvbm_toan",
    password: "gvbm2026",
    role: "subject_teacher",
    display_name: "Thầy Phạm Văn Đức (GVBM Toán)",
    student_id: null, class_assigned: null, subject_assigned: "Toán",
    created_at: "Hệ thống"
  },
  {
    id: "ACC_HS_8BLV",
    username: "hs_8blv",
    password: "hs2026",
    role: "student",
    display_name: "Phạm Minh Hải",
    student_id: "HS001", class_assigned: "8 Bạch Long Vĩ", subject_assigned: null,
    created_at: "Hệ thống"
  },
  {
    id: "ACC_HS_10A1",
    username: "hs_10a1",
    password: "hs2026",
    role: "student",
    display_name: "Trần Lê Gia Bảo",
    student_id: "HS113", class_assigned: "10A1", subject_assigned: null,
    created_at: "Hệ thống"
  },
  {
    id: "ACC_HS_12C1",
    username: "hs_12c1",
    password: "hs2026",
    role: "student",
    display_name: "Phan Ánh Thư",
    student_id: "HS185", class_assigned: "12C1", subject_assigned: null,
    created_at: "Hệ thống"
  },
  {
    id: "ACC_HS_12C5",
    username: "hs_12c5",
    password: "hs2026",
    role: "student",
    display_name: "Đặng Ánh Giang",
    student_id: "HS401", class_assigned: "12C5", subject_assigned: null,
    created_at: "Hệ thống"
  },
  {
    id: "ACC_HS_10A2",
    username: "hs_10a2",
    password: "hs2026",
    role: "student",
    display_name: "Đặng Kim Như",
    student_id: "HS272", class_assigned: "10A2", subject_assigned: null,
    created_at: "Hệ thống"
  }
];

// ---- CRUD USERS ----
function initUsers() {
  let users = getUsers();
  let changed = false;
  SEED_USERS.forEach(seed => {
    const existing = users.find(u => u.username === seed.username);
    if (!existing) {
      users.push(seed);
      changed = true;
    } else {
      // Đảm bảo thông tin liên kết như student_id / class_assigned được đồng bộ
      if (seed.student_id && existing.student_id !== seed.student_id) {
        existing.student_id = seed.student_id;
        changed = true;
      }
      if (seed.class_assigned && existing.class_assigned !== seed.class_assigned) {
        existing.class_assigned = seed.class_assigned;
        changed = true;
      }
      if (seed.subject_assigned && existing.subject_assigned !== seed.subject_assigned) {
        existing.subject_assigned = seed.subject_assigned;
        changed = true;
      }
    }
  });
  if (changed || users.length === 0) {
    saveUsers(users);
  }
}

function getUsers()       { try { return JSON.parse(localStorage.getItem(STORE_USERS) || "[]"); } catch { return []; } }
function saveUsers(users) { localStorage.setItem(STORE_USERS, JSON.stringify(users)); }

// ---- SESSION ----
function getSession()       { try { return JSON.parse(localStorage.getItem(STORE_SESSION) || "null"); } catch { return null; } }
function setSession(s)      { localStorage.setItem(STORE_SESSION, JSON.stringify(s)); }
function clearSession()     { localStorage.removeItem(STORE_SESSION); }

// ---- ĐĂNG NHẬP THÔNG MINH (HỖ TRỢ TẤT CẢ 41 LỚP HỌC SINH) ----
function doLogin(username, password) {
  initUsers();
  const uClean = (username || "").trim().toLowerCase();
  const pClean = (password || "").trim();
  
  if (!uClean) return { ok: false, msg: "❌ Vui lòng nhập tên đăng nhập." };

  // 1. Tìm trong danh sách tài khoản đã khởi tạo
  const users = getUsers();
  let user = users.find(u => u.username.toLowerCase() === uClean && u.password === pClean);

  // Cho phép mật khẩu dự phòng chuẩn cho học sinh hoặc admin
  if (!user && (pClean === "hs2026" || pClean === "123" || pClean === "hs123" || pClean === "admin123")) {
    user = users.find(u => u.username.toLowerCase() === uClean);
  }

  // 2. Nếu chưa có, tự động nhận diện theo Tên lớp hoặc Mã học sinh (cho 41 lớp)
  if (!user && (pClean === "hs2026" || pClean === "123" || pClean === "hs123" || pClean === "" || pClean === "1414@#22gbbn")) {
    const classNormalized = uClean.replace(/^hs[_-]?/, "").replace(/\s+/g, "").toUpperCase();
    const allStudents = typeof loadStudentsData === "function" ? loadStudentsData() : (typeof STUDENTS_DATA !== "undefined" ? STUDENTS_DATA : []);
    
    // a) Tìm theo mã học sinh (VD: HS401, HS272, HS113...)
    let matched = allStudents.find(s => s.student_id.toUpperCase() === classNormalized || s.student_id.toUpperCase() === uClean.toUpperCase());

    // b) Tìm theo tên lớp (VD: 12C5, 10A2, 10A1, 6 Cát Bà...)
    if (!matched) {
      matched = allStudents.find(s => {
        const c1 = s.class_name.toUpperCase().replace(/\s+/g, "");
        const c2 = typeof CLASS_NAME_TO_CODE !== "undefined" && CLASS_NAME_TO_CODE[s.class_name] ? CLASS_NAME_TO_CODE[s.class_name].toUpperCase() : "";
        return c1 === classNormalized || c2 === classNormalized;
      });
    }

    if (matched) {
      const session = {
        id: "ACC_HS_" + matched.student_id,
        username: "hs_" + matched.class_name.toLowerCase().replace(/\s+/g, ""),
        role: "student",
        display_name: matched.name,
        student_id: matched.student_id,
        class_assigned: matched.class_name,
        subject_assigned: null
      };
      setSession(session);
      return { ok: true, session };
    }
  }

  if (!user) return { ok: false, msg: "❌ Tên đăng nhập hoặc mật khẩu không đúng." };
  
  const session = {
    id: user.id,
    username: user.username,
    role: user.role,
    display_name: user.display_name,
    student_id:      user.student_id      || null,
    class_assigned:  user.class_assigned  || null,
    subject_assigned: user.subject_assigned || null
  };
  setSession(session);
  return { ok: true, session };
}

// Đăng nhập trực tiếp theo lớp (Dành cho bộ chọn 41 lớp)
function loginAsClassStudent(className) {
  if (!className) return false;
  const res = doLogin("hs_" + className.toLowerCase().replace(/\s+/g, ""), "hs2026");
  if (res.ok) {
    window.location.href = "student.html";
    return true;
  }
  // Fallback trực tiếp
  const allStudents = typeof loadStudentsData === "function" ? loadStudentsData() : (typeof STUDENTS_DATA !== "undefined" ? STUDENTS_DATA : []);
  const matched = allStudents.find(s => s.class_name === className) || {
    student_id: "HS_" + className,
    name: "Học sinh Lớp " + className,
    class_name: className
  };
  const session = {
    id: "ACC_HS_" + className.replace(/\s+/g, "_"),
    username: "hs_" + className.toLowerCase().replace(/\s+/g, ""),
    role: "student",
    display_name: matched.name,
    student_id: matched.student_id,
    class_assigned: className,
    subject_assigned: null
  };
  setSession(session);
  window.location.href = "student.html";
  return true;
}

function doLogout() { clearSession(); window.location.href = "login.html"; }

// ---- AUTH GUARD ----
function requireAuth(allowedRoles) {
  initUsers();
  const s = getSession();
  if (!s) { window.location.href = "login.html"; return null; }
  if (!allowedRoles.includes(s.role)) {
    window.location.href = ADMIN_ROLES.includes(s.role) ? "index.html" : "student.html";
    return null;
  }
  return s;
}

// ---- TẠO TÀI KHOẢN ----
function createAccount({ username, password, role, display_name, student_id, class_assigned, subject_assigned, creatorRole }) {
  if (!username || !password || !role || !display_name) return { ok: false, msg: "Vui lòng điền đầy đủ thông tin." };
  const users = getUsers();
  if (users.find(u => u.username === username)) return { ok: false, msg: `Tên đăng nhập "${username}" đã tồn tại!` };

  // Kiểm tra quyền tạo
  if (role === "superadmin") return { ok: false, msg: "Không thể tạo tài khoản Admin Tổng." };
  if (role === "manager" && creatorRole !== "superadmin")
    return { ok: false, msg: "Chỉ Admin Tổng mới tạo được tài khoản Ban Giám Hiệu." };
  if (["supervisor","homeroom_teacher","subject_teacher"].includes(role) && !["superadmin","manager"].includes(creatorRole))
    return { ok: false, msg: "Không đủ quyền tạo loại tài khoản này." };
  if (role === "student" && !["superadmin","manager","homeroom_teacher"].includes(creatorRole))
    return { ok: false, msg: "GVCN, BGH hoặc Admin mới tạo được tài khoản học sinh." };

  const newUser = {
    id: "ACC_" + Date.now(),
    username, password, role, display_name,
    student_id:      student_id      || null,
    class_assigned:  class_assigned  || null,
    subject_assigned: subject_assigned || null,
    created_at: new Date().toLocaleDateString("vi-VN")
  };
  users.push(newUser);
  saveUsers(users);
  return { ok: true, user: newUser };
}

// ---- XÓA TÀI KHOẢN ----
function deleteAccount(id, session) {
  if (!["superadmin","manager"].includes(session.role)) return { ok: false, msg: "Không đủ quyền xóa tài khoản." };
  if (id === "ACC_SUPERADMIN") return { ok: false, msg: "Không thể xóa tài khoản Admin Tổng." };
  saveUsers(getUsers().filter(u => u.id !== id));
  return { ok: true };
}

// ---- DANH SÁCH TÀI KHOẢN ----
function listAccounts(filterRole) {
  const users = getUsers();
  return filterRole && filterRole !== "ALL" ? users.filter(u => u.role === filterRole) : users;
}
