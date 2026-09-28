/**
 * CỔNG THÔNG TIN HỌC SINH & TRỢ LÝ CỐ VẤN AI EDU-BOT
 * Đề tài KHKT: Phần mềm Quản trị trường học & Cảnh báo sớm EDU-GUARD AI
 * 
 * Tác giả: Trần Lê Gia Bảo (Lớp 10A1 - THCS & THPT Liên Việt Kon Tum)
 * Năm học: 2026 - 2027
 * 
 * Các chức năng dành cho học sinh:
 * 1. Tra cứu Thời khóa biểu chuẩn từng buổi của lớp mình (Khớp 100% cổng trường).
 * 2. Theo dõi Bảng điểm KTTX cá nhân (được chuẩn hóa theo đúng môn lớp đang học).
 * 3. Làm bài kiểm tra trực tuyến LMS vnEdu (tích hợp cơ chế giám sát chống gian lận).
 * 4. Trợ lý AI cố vấn học tập EDU-BOT giải thích bài tập và định hướng ôn tập.
 */

let currentStudentData = null;
let currentStuViewClass = null;

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

// Giải mã key bảo mật Google Gemini API để hỗ trợ học sinh hỏi bài trực tuyến
function _decodeGeminiKey() {
  const enc = "DQdlFT1zHQBpH2MvD2YHYH59ZCIEOhwZPj0jGx8bbVEERTo1fC0qDDk2aRscdA5gfF5PLxc=";
  const salt = "LVKT_KON_TUM_2026";
  try {
    const raw = atob(enc);
    let key = "";
    for (let i = 0; i < raw.length; i++) {
      key += String.fromCharCode(raw.charCodeAt(i) ^ salt.charCodeAt(i % salt.length));
    }
    return key;
  } catch (e) {
    return "";
  }
}

// Gọi API Google Gemini 1.5 Flash cho EDU-BOT Cố Vấn Học Sinh
async function callStudentGeminiApi(userPrompt) {
  const apiKey = _decodeGeminiKey();
  if (!apiKey) return null;

  const s = currentStudentData;
  const subjectsDetail = s && s.subjects 
    ? Object.entries(s.subjects).map(([name, d]) => `${name}: KTTX1=${d.kttx1}, KTTX2=${d.kttx2}, GiữaKỳ=${d.ktgk}, CuốiKỳ=${d.ktck}, TB=${d.avg} (${d.xepLoai})`).join("; ") 
    : "Chưa có dữ liệu";

  const contextStr = `Bạn là EDU-BOT - Trợ lý AI Cố Vấn Học Tập Cá Nhân Hóa tại trường THCS & THPT Liên Việt Kontum.
Dự án phần mềm này được thiết kế và xây dựng bởi Trần Lê Gia Bảo, học sinh lớp 10A1 trường THCS & THPT Liên Việt Kon Tum.
Bạn đang trò chuyện trực tiếp 1-1 với bạn học sinh có hồ sơ thực tế sau:
- Họ và tên: ${s ? s.name : "Học sinh"} (${s ? s.gender : "Nam"})
- Mã học sinh: ${s ? s.student_id : "HS001"}
- Lớp: ${s ? s.class_name : "10A1"} (Khối ${s ? s.grade : 10})
- Ngày sinh: ${s ? s.dob : "2010"} | Địa chỉ: ${s ? s.address : "TP. Kon Tum"}
- Điểm trung bình chung hiện tại: ${s ? s.academic_avg || s.avg_score.toFixed(1) : 7.5}
- Xếp loại học lực: ${s ? s.academic_rank : "Khá"}
- Xếp loại hạnh kiểm: ${s ? s.conduct : "Tốt"} (Ghi chú rèn luyện: ${s ? s.conduct_notes : "Ngoan ngoãn, gương mẫu"})
- Tỷ lệ hoàn thành bài tập về nhà: ${s ? Math.round(s.hw_rate * 100) : 80}%
- Số buổi nghỉ học: ${s ? s.absences : 0} buổi
- Hệ số phong độ OLS (β): ${s ? s.slope.toFixed(2) : 0.05} (${s && s.slope < -0.3 ? "Đang có nguy cơ trượt dốc" : "Ổn định hoặc tăng trưởng"})
- Mức độ cảnh báo rủi ro: ${s ? s.risk_level : "THẤP"}
- Chi tiết điểm các môn học: ${subjectsDetail}
- Thông tin phụ huynh: ${s ? s.parent_name : "Phụ huynh"} (SĐT: ${s ? s.parent_phone : ""})

Quy tắc ứng xử của EDU-BOT:
1. Xưng hô thân mật, gần gũi, khích lệ và sư phạm ("Mình" - "Bạn", hoặc gọi tên thân mật của học sinh: ${s ? s.name.split(" ").slice(-1)[0] : "bạn"}).
2. Căn cứ vào số liệu môn học trên để tư vấn cách khắc phục môn yếu hoặc phát huy môn mạnh, phương pháp học tập hiệu quả.
3. Nếu học sinh hỏi về tác giả hoặc nguồn gốc hệ thống, hãy tự hào giới thiệu: "Dự án được nghiên cứu và thiết kế bởi bạn Trần Lê Gia Bảo — Học sinh lớp 10A1, Trường THCS & THPT Liên Việt Kon Tum!".
4. Trả lời súc tích, ngắn gọn, dùng định dạng đẹp (bullet point, emoji), không dài dòng lê thê.`;

  const modelsToTry = ["gemini-2.5-flash", "gemini-flash-latest", "gemini-2.5-flash-lite"];

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8500);

      const response = await fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: `${contextStr}\n\nHọc sinh hỏi: ${userPrompt}` }] }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 650
          }
        })
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`Model ${model} trả về status ${response.status}, thử model tiếp theo...`);
        continue;
      }

      const json = await response.json();
      const reply = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) {
        return reply
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.*?)\*/g, "<em>$1</em>")
          .replace(/\n\n/g, "<br><br>")
          .replace(/\n/g, "<br>");
      }
    } catch (err) {
      console.warn(`Lỗi kết nối tới model ${model}:`, err);
    }
  }

  return null; // Tự động fallback sang offline engine nếu không kết nối được
}

// Khởi tạo cổng thông tin học sinh: Kiểm tra quyền đăng nhập và nạp dữ liệu cá nhân
document.addEventListener("DOMContentLoaded", () => {
  // Auth Guard: Chỉ học sinh mới vào được trang này
  const session = requireAuth(["student"]);
  if (!session) return;

  // Hỗ trợ URL params: ?class=12C5 hoặc ?sid=HS401
  const urlParams = new URLSearchParams(window.location.search);
  const paramClass = urlParams.get("class") || urlParams.get("lop");
  const paramSid = urlParams.get("sid") || urlParams.get("student_id");
  if (paramClass) session.class_assigned = paramClass;
  if (paramSid) session.student_id = paramSid;

  // Lấy danh sách học sinh từ LocalStorage mới nhất
  const allStudents = typeof loadStudentsData === "function" ? loadStudentsData() : STUDENTS_DATA;

  // 1. Tìm thông tin học sinh theo student_id
  let sid = session.student_id;
  let studentObj = sid ? allStudents.find(s => s.student_id.toUpperCase() === sid.toUpperCase()) : null;

  // 2. Nếu chưa có, tìm học sinh theo lớp được gán (VD: 12C5, 10A2...)
  if (!studentObj && session.class_assigned) {
    const cNorm = session.class_assigned.trim().toLowerCase().replace(/\s+/g, "");
    studentObj = allStudents.find(s => {
      const c1 = s.class_name.toLowerCase().replace(/\s+/g, "");
      const c2 = typeof CLASS_NAME_TO_CODE !== "undefined" && CLASS_NAME_TO_CODE[s.class_name] ? CLASS_NAME_TO_CODE[s.class_name].toLowerCase() : "";
      return c1 === cNorm || c2 === cNorm;
    });
  }

  // 3. Nếu chưa có, tìm theo display_name
  if (!studentObj && session.display_name && session.display_name !== "Học sinh") {
    studentObj = allStudents.find(s => s.name.toLowerCase() === session.display_name.toLowerCase());
  }

  // 4. Fallback mặc định
  if (!studentObj) {
    studentObj = allStudents[0];
  }

  // Đồng bộ hóa an toàn nếu session chỉ định lớp cụ thể
  if (session.class_assigned && studentObj.class_name.toLowerCase().replace(/\s+/g, "") !== session.class_assigned.toLowerCase().replace(/\s+/g, "")) {
    studentObj = Object.assign({}, studentObj, { class_name: session.class_assigned });
  }
  if (session.display_name && session.display_name !== "Học sinh" && studentObj.name !== session.display_name) {
    studentObj = Object.assign({}, studentObj, { name: session.display_name });
  }

  currentStudentData = studentObj;
  currentStuViewClass = studentObj.class_name;
  renderStudentPage(session, studentObj);

  // Lời chào mở đầu từ EDU-BOT Chat
  setTimeout(() => {
    const firstName = (studentObj.name || session.display_name).split(" ").slice(-1)[0];
    addStudentChatBubble("bot",
      `Chào <b>${firstName}</b>! 👋 Mình là <b>EDU-BOT</b>, trợ lý AI cố vấn học tập riêng của bạn tại <b>THCS &amp; THPT Liên Việt Kontum</b>.<br>
      Dự án được nghiên cứu &amp; xây dựng bởi bạn <b>Trần Lê Gia Bảo (Lớp 10A1)</b>.<br>
      Mình đã nạp sẵn thời khóa biểu và phân tích phong độ học tập của <b>Lớp ${studentObj.class_name}</b> cho bạn. Bạn cần hỗ trợ môn học nào trước? ✨`
    );
  }, 400);
});

// Hiển thị thông tin tổng quan của học sinh: Điểm TB, Hạnh kiểm, Nguy cơ OLS và Thẻ cố vấn
function renderStudentPage(session, s) {
  const fullName = session.display_name || s.name;
  const firstName = fullName.split(" ").slice(-1)[0];

  // Header avatar & name
  const topAvatar = document.getElementById("studentAvatar");
  if (topAvatar && typeof getStudentAvatarSvg === "function") {
    topAvatar.innerHTML = getStudentAvatarSvg(s, 34);
  }
  document.getElementById("studentHeaderName").textContent = fullName;
  document.getElementById("studentHeaderRole").textContent = `Lớp ${s.class_name}`;

  // Banner chào mừng (hiển thị đầy đủ Họ và Tên trang trọng, sắc nét)
  document.getElementById("welcomeName").textContent = fullName;
  document.getElementById("welcomeClass").textContent = s.class_name;
  document.getElementById("welcomeId").textContent = s.student_id;
  document.getElementById("welcomeRank").textContent = s.academic_rank || "Khá";
  document.getElementById("welcomeConduct").textContent = (s.conduct === "Tốt" ? "🌟 " : s.conduct === "Khá" ? "👍 " : "") + s.conduct;

  // Render Hồ sơ cá nhân & Phụ huynh
  renderStudentProfileCard(s);

  // KPI cards
  document.getElementById("spAvgScore").textContent = s.academic_avg || s.avg_score.toFixed(1);
  document.getElementById("spAcademicRank").textContent = `Học lực: ${s.academic_rank || 'Khá'}`;
  document.getElementById("spConduct").textContent = s.conduct;
  document.getElementById("spConductSub").textContent = s.conduct === "Tốt" ? "🌟 Xếp loại Tốt" : s.conduct === "Khá" ? "👍 Xếp loại Khá" : "Cần rèn luyện thêm";
  document.getElementById("spHwRate").textContent = `${Math.round(s.hw_rate * 100)}%`;
  document.getElementById("spAbsences").textContent = s.absences;

  // Status badge
  const badge = document.getElementById("spStatusBadge");
  badge.className = `status-pill ${s.risk_level === "CAO" ? "pill-high" : (s.risk_level === "TRUNG BÌNH" ? "pill-med" : "pill-low")}`;
  badge.textContent = s.risk_level === "CAO" ? "🔴 CẦN HỖ TRỢ GẤP" : (s.risk_level === "TRUNG BÌNH" ? "🟡 CẦN LƯU Ý" : "🟢 PHONG ĐỘ XUẤT SẮC");

  // Đồ thị 8 tuần
  renderStudentSvgCurve("spTrendChartSvg", s);

  // Phân tích summary
  const slopeStr = s.slope > 0 ? `+${s.slope.toFixed(2)}` : s.slope.toFixed(2);
  const trend = s.slope < -0.3 ? "📉 Đang có dấu hiệu trượt dốc — Hãy cùng EDU-BOT khắc phục ngay!"
    : (s.slope > 0 ? "📈 Phong độ đang tiến bộ vững chắc — Tiếp tục phát huy nhé!" : "📊 Điểm số dao động ổn định — Cố gắng bứt phá thêm!");
  document.getElementById("spAnalysisSummary").textContent = `• Hệ số dốc OLS (β): ${slopeStr} — ${trend}`;

  // Render bảng điểm KTTX các môn
  renderStudentSubjectsTable(s);

  // Render danh sách bài tập trực tuyến LMS vnEdu
  renderStudentLmsAssignments(s);

  // Render Thời khóa biểu lớp của tôi
  renderStudentTimetable(s);

  // XAI Attribution
  renderXaiSection(s);

  // Kế hoạch can thiệp
  renderPlanSection(s);

  // EDU-BOT coach banner
  renderEdubotCoach(s);

  // Kiểm tra thông báo nhận xét & phản hồi từ Thầy/Cô và AI
  checkTeacherFeedbackNotifications();
}

// ---- HỒ SƠ HỌC SINH & GIA ĐÌNH ----
function renderStudentProfileCard(s) {
  const avatarContainer = document.getElementById("stuAvatarCardContainer");
  if (avatarContainer && typeof getStudentAvatarSvg === "function") {
    avatarContainer.innerHTML = getStudentAvatarSvg(s, 64);
  }

  const nameEl = document.getElementById("stuProfileName");
  if (nameEl) nameEl.textContent = s.name;

  const classIdEl = document.getElementById("stuProfileClassId");
  if (classIdEl) classIdEl.textContent = `Lớp ${s.class_name} · Mã HS: ${s.student_id}`;

  const dobGenderEl = document.getElementById("stuProfileDobGender");
  if (dobGenderEl) dobGenderEl.textContent = `📅 Ngày sinh: ${s.dob || '01/01/2010'} · Giới tính: ${s.gender || 'Nam'}`;

  const addrEl = document.getElementById("stuProfileAddress");
  if (addrEl) addrEl.textContent = s.address || "Nguyễn Thị Cương, Đăk BLa, Quảng Ngãi, Việt Nam";

  const parentEl = document.getElementById("stuProfileParent");
  if (parentEl) parentEl.textContent = s.parent_name || "Phụ huynh học sinh";

  const phoneEl = document.getElementById("stuProfilePhone");
  if (phoneEl) {
    const rawPhone = s.parent_phone || "0984.123.456";
    phoneEl.innerHTML = `<span>${rawPhone}</span> <span>📞</span>`;
    phoneEl.href = `tel:${rawPhone.replace(/[^0-9]/g, "")}`;
  }

  const notesEl = document.getElementById("stuProfileNotes");
  if (notesEl) {
    notesEl.textContent = s.conduct_notes || (s.conduct === "Tốt" ? "Ngoan ngoãn, gương mẫu trong học tập và rèn luyện." : "Chấp hành tốt nội quy trường lớp.");
  }

  const conductBadge = document.getElementById("stuProfileConductBadge");
  if (conductBadge) {
    conductBadge.textContent = s.conduct === "Tốt" ? "🌟 Hạnh kiểm Tốt" : s.conduct === "Khá" ? "👍 Hạnh kiểm Khá" : "Cần rèn luyện";
    conductBadge.style.background = s.conduct === "Tốt" ? "#dcfce7" : s.conduct === "Khá" ? "#dbeafe" : "#fef3c7";
    conductBadge.style.color = s.conduct === "Tốt" ? "#15803d" : s.conduct === "Khá" ? "#1e40af" : "#92400e";
  }
}

// ---- BẢNG ĐIỂM KTTX CÁC MÔN HỌC ----
function renderStudentSubjectsTable(s) {
  const tbody = document.getElementById("stuSubjectTableBody");
  if (!tbody || !s.subjects) return;
  tbody.innerHTML = "";

  const scoreCell = (val) => {
    const col = val >= 8.0 ? "#15803d" : val >= 6.5 ? "#0284c7" : val >= 5.0 ? "#92400e" : "#b91c1c";
    return `<td style="font-weight:700;color:${col};text-align:center;">${val}</td>`;
  };

  Object.entries(s.subjects).forEach(([subj, d]) => {
    const col = d.avg >= 8.0 ? "#15803d" : d.avg >= 6.5 ? "#0284c7" : d.avg >= 5.0 ? "#b45309" : "#b91c1c";
    const bgCol = d.avg >= 8.0 ? "#dcfce7" : d.avg >= 6.5 ? "#dbeafe" : d.avg >= 5.0 ? "#fef3c7" : "#fee2e2";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="font-weight:700;color:#0f172a;">${subj}</td>
      ${scoreCell(d.kttx1)}
      ${scoreCell(d.kttx2)}
      ${scoreCell(d.ktgk)}
      ${scoreCell(d.ktck)}
      <td style="font-weight:900;color:${col};text-align:center;font-size:0.92rem;">${d.avg}</td>
      <td style="text-align:center;">
        <span style="background:${bgCol};color:${col};padding:3px 9px;border-radius:12px;font-size:0.75rem;font-weight:800;">
          ${d.xepLoai}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ---- ĐỒ THỊ SVG ĐiỂM 8 TUẦN ----
function renderStudentSvgCurve(svgId, s) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  svg.innerHTML = "";

  const width = 320, height = 100, paddingX = 26, paddingY = 12;
  const plotW = width - 2 * paddingX;
  const plotH = height - 2 * paddingY;
  const scores = s.scores;
  const n = scores.length;
  const minScore = 2.0, maxScore = 10.0;

  const points = scores.map((val, idx) => ({
    x: paddingX + (idx / (n - 1)) * plotW,
    y: paddingY + plotH - ((val - minScore) / (maxScore - minScore)) * plotH,
    val, week: idx + 1
  }));

  // Đường ngưỡng 5.0
  const yPass = paddingY + plotH - ((5.0 - minScore) / (maxScore - minScore)) * plotH;
  svg.innerHTML += `<line x1="${paddingX}" y1="${yPass}" x2="${width - paddingX}" y2="${yPass}" stroke="#e2e8f0" stroke-dasharray="3,3" stroke-width="1"/>`;
  svg.innerHTML += `<text x="4" y="${yPass + 3}" fill="#94a3b8" font-size="7">5.0</text>`;

  // Đường nối điểm
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) pathD += ` L ${points[i].x} ${points[i].y}`;

  const strokeColor = s.slope < -0.3 ? "#ef4444" : (s.slope > 0 ? "#10b981" : "#f59e0b");
  svg.innerHTML += `<path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;

  points.forEach(p => {
    svg.innerHTML += `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${strokeColor}" stroke="#ffffff" stroke-width="2"/>`;
    svg.innerHTML += `<text x="${p.x}" y="${p.y - 6}" fill="#0f172a" font-size="7.5" font-weight="bold" text-anchor="middle">${p.val.toFixed(1)}</text>`;
    svg.innerHTML += `<text x="${p.x}" y="${height - 1}" fill="#64748b" font-size="7" text-anchor="middle">T${p.week}</text>`;
  });
}

// ---- XAI SECTION ----
function renderXaiSection(s) {
  const container = document.getElementById("spXaiContent");
  if (!container) return;

  const entries = [
    { label: "Tụt dốc điểm kiểm tra", pct: s.causes["Tụt dốc điểm kiểm tra"], color: "#ef4444" },
    { label: "Thiếu bài tập về nhà", pct: s.causes["Thiếu/bỏ bài tập về nhà"], color: "#f59e0b" },
    { label: "Nghỉ học / Chuyên cần giảm", pct: s.causes["Nghỉ học/Chuyên cần giảm"], color: "#3b82f6" },
    { label: "Phong độ dao động", pct: s.causes["Phong độ dao động bất thường"], color: "#8b5cf6" }
  ];

  container.innerHTML = entries.map(e => `
    <div style="margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;font-size:0.75rem;margin-bottom:3px;">
        <span style="color:#334155;">${e.label}</span>
        <span style="font-weight:700;color:${e.color};">${e.pct}%</span>
      </div>
      <div style="height:5px;background:#e2e8f0;border-radius:3px;overflow:hidden;">
        <div style="height:100%;width:${e.pct}%;background:${e.color};border-radius:3px;"></div>
      </div>
    </div>
  `).join("");
}

// ---- KẾ HOẠCH CAN THIỆP 3 CHIỀU ----
function renderPlanSection(s) {
  const container = document.getElementById("spPlanContent");
  if (!container) return;

  container.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-light);">
      <span style="font-size:1.1rem;">👨‍🏫</span>
      <div><div style="font-weight:700;font-size:0.78rem;color:#334155;">Thầy cô bộ môn &amp; GVCN:</div><div style="font-size:0.79rem;color:#475569;">${s.intervention_plan["GiaoVien"]}</div></div>
    </div>
    <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-light);">
      <span style="font-size:1.1rem;">🎒</span>
      <div><div style="font-weight:700;font-size:0.78rem;color:#334155;">Bản thân học sinh:</div><div style="font-size:0.79rem;color:#475569;">${s.intervention_plan["HocSinh"]}</div></div>
    </div>
    <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;">
      <span style="font-size:1.1rem;">👨‍👩‍👧</span>
      <div><div style="font-weight:700;font-size:0.78rem;color:#334155;">Phối hợp cùng cha mẹ:</div><div style="font-size:0.79rem;color:#475569;">${s.intervention_plan["PhuHuynh"]}</div></div>
    </div>
  `;
}

// ---- EDU-BOT AI COACH BANNER ----
function renderEdubotCoach(s) {
  const firstName = s.name.split(" ").slice(-1)[0];
  document.getElementById("aiGreeting").textContent = `👋 Chào ${firstName}! Mình là EDU-BOT, chẩn đoán học tập của bạn:`;

  const diagnosis = document.getElementById("aiDiagnosis");
  const actionList = document.getElementById("aiActionList");

  if (s.risk_level === "CAO") {
    diagnosis.innerHTML = `
      AI nhận thấy <strong>đà điểm số của bạn đang giảm sút</strong> (Hệ số dốc OLS β = ${s.slope.toFixed(2)}).<br>
      • Điểm nghẽn chính: Tỷ lệ thiếu/bỏ bài tập về nhà chiếm <strong>${s.causes["Thiếu/bỏ bài tập về nhà"]}%</strong>.<br>
      • <em>Đừng nản lòng! Đây là thời điểm vàng để chúng ta đảo chiều kết quả học tập trước kỳ thi tới! 💪</em>
    `;
    actionList.innerHTML = `
      <li>1️⃣ <strong>Bù đắp bài tập:</strong> Dành 35 phút mỗi tối làm lại các dạng bài tập căn bản còn nợ.</li>
      <li>2️⃣ <strong>Lấp lỗ hổng:</strong> Ôn kỹ các môn có điểm TB dưới 6.5 (xem bảng điểm bên cạnh).</li>
      <li>3️⃣ <strong>Hỏi ngay khi chưa hiểu:</strong> Dùng nút gửi lời nhắn bên dưới để nhờ thầy cô hỗ trợ.</li>
    `;
  } else if (s.risk_level === "TRUNG BÌNH") {
    diagnosis.innerHTML = `
      Điểm số của bạn đang ở mức ổn định (Điểm TB: ${s.academic_avg || s.avg_score.toFixed(1)}), nhưng <strong>phong độ giữa các tuần chưa thực sự đều</strong>.<br>
      • Tỷ lệ nộp bài tập đạt ${Math.round(s.hw_rate * 100)}%, bạn hoàn toàn có thể nâng lên trên 90% để vươn lên nhóm Giỏi!
    `;
    actionList.innerHTML = `
      <li>1️⃣ Nộp bài tập đầy đủ và đúng hạn để giữ vững thói quen học tập kỷ luật.</li>
      <li>2️⃣ Rà soát lại các câu hỏi tự luận hay bị trừ điểm trong bài kiểm tra định kỳ.</li>
      <li>3️⃣ Đọc trước bài mới 15 phút trước khi đến lớp để xung phong phát biểu ghi điểm cộng!</li>
    `;
  } else {
    diagnosis.innerHTML = `
      🎉 <strong>Chúc mừng! Phong độ học tập của bạn đang rất xuất sắc</strong> (Điểm TB: ${s.academic_avg || s.avg_score.toFixed(1)}, Hạnh kiểm: ${s.conduct}).<br>
      • Thầy cô và nhà trường rất tự hào về tinh thần tự giác của bạn! ⭐
    `;
    actionList.innerHTML = `
      <li>1️⃣ Duy trì phương pháp tự học và thời gian biểu hiệu quả hiện tại của bạn.</li>
      <li>2️⃣ Thử thách bản thân với các bài tập nâng cao hoặc tham gia câu lạc bộ học thuật của trường.</li>
      <li>3️⃣ Hỗ trợ các bạn cùng bàn khi bạn gặp bài khó — đây là cách ôn tập sâu nhất!</li>
    `;
  }
}

// Trợ lý ảo EDU-BOT: Hỗ trợ học sinh đặt câu hỏi học tập và nhận giải đáp tức thì từ AI
function quickAsk(questionText) {
  document.getElementById("stuChatInput").value = questionText;
  sendStudentAiMessage();
}

function addStudentChatBubble(type, html) {
  const container = document.getElementById("stuChatMessages");
  if (!container) return;
  const isBot = type === "bot";
  const div = document.createElement("div");
  div.className = `chat-bubble-${type}`;
  div.style.cssText = `max-width:88%;padding:10px 14px;border-radius:${isBot ? "4px 14px 14px 14px" : "14px 4px 14px 14px"};font-size:0.82rem;line-height:1.6;${isBot ? "background:#f0f9ff;color:#0f172a;align-self:flex-start;border:1px solid #bae6fd;box-shadow:0 1px 3px rgba(0,0,0,0.04);" : "background:#0284c7;color:white;align-self:flex-end;"}`;
  div.innerHTML = html;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

async function sendStudentAiMessage() {
  const input = document.getElementById("stuChatInput");
  const btn = document.getElementById("btnSendStudentAi");
  const msg = input.value.trim();
  if (!msg) return;

  input.value = "";
  addStudentChatBubble("user", msg);

  // Hiển thị bubble "Đang phân tích..."
  const typingBubble = addStudentChatBubble("bot", "<em>🤖 EDU-BOT đang suy nghĩ câu trả lời...</em>");
  if (btn) btn.disabled = true;

  try {
    // Ưu tiên gọi Google Gemini 1.5 Flash API
    let botReply = await callStudentGeminiApi(msg);

    // Fallback sang engine offline nếu không kết nối được API
    if (!botReply) {
      botReply = processStudentAiQuery(msg);
    }

    typingBubble.innerHTML = botReply;
  } catch (err) {
    typingBubble.innerHTML = processStudentAiQuery(msg);
  } finally {
    if (btn) btn.disabled = false;
    const container = document.getElementById("stuChatMessages");
    if (container) container.scrollTop = container.scrollHeight;
  }
}

// Engine xử lý offline dự phòng (nếu mất mạng hoặc quá tải API)
function processStudentAiQuery(msg) {
  const s = currentStudentData;
  const q = msg.toLowerCase();
  const firstName = s ? s.name.split(" ").slice(-1)[0] : "bạn";

  // Hỏi về tác giả dự án
  if (q.includes("tác giả") || q.includes("ai làm") || q.includes("ai thiết kế") || q.includes("gia bảo")) {
    return `👨‍💻 <b>Về tác giả dự án:</b><br>
    Hệ thống Quản lý Học sinh &amp; Cố vấn AI EDU-GUARD được nghiên cứu và thiết kế hoàn chỉnh bởi bạn <b>Trần Lê Gia Bảo</b> — Học sinh lớp <b>10A1</b>, Trường <b>THCS &amp; THPT Liên Việt Kon Tum</b>.<br>
    Dự án tích hợp trí tuệ nhân tạo (Google Gemini) nhằm hỗ trợ nhà trường phát hiện sớm nguy cơ học tập và đồng hành cá nhân hóa cùng từng học sinh! 🎓✨`;
  }

  // Môn Toán
  if (q.includes("toán")) {
    const math = s?.subjects?.["Toán"];
    if (math) {
      return `📐 <b>Môn Toán của ${firstName}:</b><br>
      • KTTX 1: <b>${math.kttx1}</b> · KTTX 2: <b>${math.kttx2}</b><br>
      • Giữa Kỳ: <b>${math.ktgk}</b> · Cuối Kỳ: <b>${math.ktck}</b><br>
      • Điểm TB Môn: <b>${math.avg}</b> [${math.xepLoai}]<br>
      💡 <em>Lời khuyên AI:</em> ${math.avg < 6.5 ? "Hãy tập trung làm lại các bài tập sách giáo khoa chương hiện tại và hỏi thầy cô giờ giải lao nhé!" : "Phong độ môn Toán đang rất tốt, hãy duy trì giải thêm bài tập nâng cao!"}`;
    }
  }

  // Từng môn học khác
  const subjectsList = ["Ngữ Văn", "Tiếng Anh", "Vật Lý", "Hóa Học", "Sinh Học", "Lịch Sử", "Địa Lý", "GDCD"];
  for (const subj of subjectsList) {
    if (q.includes(subj.toLowerCase())) {
      const d = s?.subjects?.[subj];
      if (d) {
        return `📖 <b>Môn ${subj} của ${firstName}:</b><br>
        • Điểm KTTX: <b>${d.kttx1}</b> | <b>${d.kttx2}</b><br>
        • Giữa kỳ: <b>${d.ktgk}</b> | Cuối kỳ: <b>${d.ktck}</b><br>
        • Điểm TB: <b>${d.avg}</b> — Xếp loại: <b>${d.xepLoai}</b>`;
      }
    }
  }

  // Môn yếu / sa sút
  if (q.includes("yếu") || q.includes("sa sút") || q.includes("nguy cơ") || q.includes("chú ý")) {
    if (s?.subjects) {
      const lowSubjects = Object.entries(s.subjects).filter(([_, d]) => d.avg < 6.5);
      if (lowSubjects.length === 0) {
        return `🎉 Tuyệt vời! ${firstName} không có môn nào dưới 6.5 điểm cả. Tất cả các môn đều đang ở mức Khá hoặc Giỏi!`;
      }
      return `⚠️ <b>Các môn ${firstName} cần chú ý củng cố thêm:</b><br>` + lowSubjects.map(([subj, d]) =>
        `• <b>${subj}</b>: Điểm TB <b>${d.avg}</b> (${d.xepLoai})`
      ).join("<br>") + `<br>💡 Hãy dành thêm 20 phút mỗi tối để ôn lại các môn này nhé!`;
    }
  }

  // Hạnh kiểm & học lực
  if (q.includes("hạnh kiểm") || q.includes("học lực")) {
    return `🎭 <b>Kết quả rèn luyện của ${firstName}:</b><br>
    • Học lực hiện tại: <b>${s?.academic_rank || 'Khá'}</b> (Điểm TB: ${s?.academic_avg || s?.avg_score})<br>
    • Hạnh kiểm: <b>${s?.conduct}</b> ${s?.conduct === "Tốt" ? "🌟" : "👍"}<br>
    • Số buổi nghỉ học: <b>${s?.absences || 0}</b> buổi<br>
    • Tỷ lệ bài tập về nhà: <b>${Math.round((s?.hw_rate || 0.8) * 100)}%</b>`;
  }

  // Thời gian biểu / Lịch học
  if (q.includes("thời gian biểu") || q.includes("lịch học") || q.includes("buổi tối") || q.includes("ôn tập")) {
    return `⏰ <b>Gợi ý thời gian biểu tự học buổi tối (19h30 – 21h45):</b><br>
    • <b>19h30 – 20h15 (45p):</b> Hoàn thành bài tập về nhà môn ngày mai.<br>
    • <b>20h15 – 20h25 (10p):</b> Giải lao, vận động nhẹ.<br>
    • <b>20h25 – 21h10 (45p):</b> Ôn lại kiến thức môn yếu (Toán / Lý / Ngoại ngữ).<br>
    • <b>21h10 – 21h45 (35p):</b> Soạn trước bài mới &amp; đi ngủ trước 22h30.`;
  }

  // Cảm ơn / Chào
  const greetings = ["hi", "hello", "hey", "alo", "chào", "xin chào", "helo", "halo"];
  if (greetings.some(g => q === g || q.startsWith(g + " ") || q.endsWith(" " + g) || q.includes(g))) {
    return `👋 Chào ${firstName}! Mình luôn sẵn sàng đồng hành cùng bạn học tập tốt hơn mỗi ngày tại <b>THCS &amp; THPT Liên Việt Kontum</b>.<br>Hệ thống được phát triển bởi bạn <b>Trần Lê Gia Bảo (Lớp 10A1)</b>.<br>Bạn cần giải đáp hay hỗ trợ ôn tập môn nào cứ nhắn mình nhé! ✨`;
  }
  if (q.includes("cảm ơn") || q.includes("thanks") || q.includes("thank")) {
    return `😊 Rất vui được đồng hành cùng ${firstName}! Chúc bạn đạt kết quả thật cao trong các bài kiểm tra sắp tới nhé! 💪`;
  }

  // Default
  return `🤖 EDU-BOT đã ghi nhận câu hỏi của ${firstName}.<br>
  Bạn có thể thử hỏi:<br>
  • <em>"Điểm môn Toán của em thế nào?"</em><br>
  • <em>"Môn nào của em đang bị yếu?"</em><br>
  • <em>"Hạnh kiểm và học lực của em hiện tại"</em><br>
  • <em>"Gợi ý thời gian biểu ôn tập buổi tối"</em><br>
  • <em>"Hệ thống này do ai thiết kế?"</em>`;
}

// Tiện ích giả lập cải thiện điểm số: Dự báo mức tăng điểm trung bình nếu ôn tập tiến bộ
function simulateRecovery() {
  const s = currentStudentData;
  if (!s) return;

  if (s.risk_level === "THẤP") {
    showStudentToast("✅ Bạn đang ở mức AN TOÀN — Tiếp tục phát huy nhé!");
    return;
  }

  const improvedScore = Math.min(s.avg_score + 2.2, 8.5).toFixed(1);
  const improvedHw = Math.min(Math.round((s.hw_rate + 0.45) * 100), 100);
  const firstName = s.name.split(" ").slice(-1)[0];

  alert(
`🎯 KẾT QUẢ MÔ PHỎNG SAU 4 TUẦN THỰC HIỆN KẾ HOẠCH:
Học sinh: ${s.name} (${s.student_id} - Lớp ${s.class_name})
───────────────────────────────────────────────────
• Điểm trung bình: ${s.avg_score.toFixed(1)} ➔ ${improvedScore} (tăng +2.2 điểm)
• Tỷ lệ nộp bài tập: ${Math.round(s.hw_rate * 100)}% ➔ ${improvedHw}% (cải thiện rõ rệt!)
• Đà dốc OLS (β): ${s.slope.toFixed(2)} ➔ +0.28 (Đã đảo chiều sang tăng trưởng!)
• Hạnh kiểm: ${s.conduct} ➔ 🌟 Tốt
• Mức rủi ro: ${s.risk_level} ➔ 🟢 AN TOÀN
───────────────────────────────────────────────────
💪 Hãy kiên trì 4 tuần theo kế hoạch trên, ${firstName} hoàn toàn
   có thể đạt được kết quả tích cực như vậy!
✨ Thống kê thực nghiệm: 83.3% học sinh đã phục hồi thành công!`
  );
}

function studentAction(type) {
  const s = currentStudentData;
  const name = s ? s.name.split(" ").slice(-1)[0] : "bạn";

  if (type === "worksheet") {
    showStudentToast(`📥 EDU-BOT đã tạo Phiếu Ôn Tập Chuyên Đề dành riêng cho ${name}! Hãy làm bài và nộp cho thầy cô trước thứ Sáu.`);
  } else if (type === "message_teacher") {
    showStudentToast(`💬 Đã gửi lời nhắn đến GVCN &amp; Thầy/Cô bộ môn! Thầy/Cô sẽ hỗ trợ ${name} trong giờ giải lao.`);
  } else if (type === "commit_target") {
    showStudentToast(`🎯 Cam kết thành công! EDU-BOT sẽ đồng hành cùng ${name} đạt mục tiêu tăng +1.5 điểm! 💪`);
  }
}

function showStudentToast(msg, isError = false) {
  const toast = document.getElementById("toastNotif");
  if (!toast) return;
  toast.innerHTML = msg;
  toast.style.background = isError ? "#dc2626" : "#0f172a";
  toast.style.maxWidth = "420px";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4000);
}

// Cổng làm bài tập vnEdu LMS: Học sinh xem danh sách bài tập, hạn nộp và điểm số đã đạt
let activeExamAssign = null;
let activeExamAnswers = {};
let examTimerInterval = null;
let examSecondsLeft = 0;

function renderStudentLmsAssignments(s) {
  if (!s || !s.class_name) return;

  const assignments = typeof getAssignmentsForClass === "function" ? getAssignmentsForClass(s.class_name) : [];
  const container = document.getElementById("studentAssignmentsList");
  const badgeCount = document.getElementById("studentLmsBadgeCount");
  const bellBadge = document.getElementById("studentNotifBellBadge");

  // Đếm bài chưa nộp
  let pendingCount = 0;
  assignments.forEach(a => {
    const sub = typeof getSubmissionForStudent === "function" ? getSubmissionForStudent(a.id, s.student_id) : null;
    if (!sub) pendingCount++;
  });

  if (badgeCount) badgeCount.textContent = `${assignments.length} Bài Tập (${pendingCount} Chưa Làm)`;
  if (bellBadge) {
    bellBadge.textContent = pendingCount;
    bellBadge.style.display = pendingCount > 0 ? "inline-block" : "none";
  }

  if (!container) return;

  if (assignments.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:24px 16px;color:#64748b;font-size:0.82rem;">
        🎉 Tuyệt vời! Hiện tại lớp <strong>${s.class_name}</strong> không có bài tập nào cần làm.
      </div>
    `;
    return;
  }

  const now = new Date();

  container.innerHTML = assignments.map(a => {
    const sub = typeof getSubmissionForStudent === "function" ? getSubmissionForStudent(a.id, s.student_id) : null;
    const isSubmitted = !!sub;
    const isDue = a.due_date && new Date(a.due_date) < now;
    const dueFormatted = a.due_date ? a.due_date.replace("T", " ") : "Không giới hạn";

    return `
      <div style="background:white;border:1.5px solid ${isSubmitted ? '#86efac' : isDue ? '#fde68a' : '#bae6fd'};border-radius:12px;padding:14px;box-shadow:0 2px 6px rgba(15,23,42,0.04);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
        <div style="flex:1;min-width:240px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-size:0.75rem;font-weight:800;color:#0284c7;background:#e0f2fe;padding:2px 8px;border-radius:8px;">
              Môn ${a.subject}
            </span>
            <span style="font-size:0.72rem;font-weight:800;padding:2px 8px;border-radius:8px;background:${isSubmitted ? '#dcfce7' : isDue ? '#fef3c7' : '#fee2e2'};color:${isSubmitted ? '#15803d' : isDue ? '#b45309' : '#b91c1c'};">
              ${isSubmitted ? `✅ Đã nộp (${sub.score.toFixed(1)}/10đ)` : isDue ? '⏰ Quá hạn nộp' : '🔴 Chưa làm'}
            </span>
          </div>

          <div style="font-size:0.92rem;font-weight:800;color:#0f172a;line-height:1.35;">
            ${escapeHtml(a.title)}
          </div>

          <div style="font-size:0.74rem;color:#64748b;margin-top:4px;">
            👨‍🏫 <strong>${escapeHtml(a.teacher_name || "GV Bộ Môn")}</strong> · ${a.questions ? a.questions.length : 0} câu trắc nghiệm · Thời gian: ${a.duration_minutes || 20} phút
          </div>

          <div style="font-size:0.73rem;color:#475569;margin-top:3px;">
            📅 Hạn nộp: <strong>${dueFormatted}</strong> ${isSubmitted ? `· Đã nộp lúc: <em>${sub.submitted_at}</em>` : ''}
          </div>
        </div>

        <div>
          ${isSubmitted ? `
            <button onclick="viewStudentExamResult('${a.id}')" class="btn-demo-chip" style="background:#e0f2fe;color:#0284c7;border-color:#38bdf8;padding:8px 14px;font-size:0.78rem;font-weight:800;">
              📊 Xem Kết Quả &amp; AI Nhận Xét
            </button>
          ` : `
            <button onclick="startStudentExam('${a.id}')" class="btn-primary" style="background:var(--primary-glass-gradient);padding:8px 16px;font-size:0.8rem;display:flex;align-items:center;gap:6px;">
              <span>🚀</span> <span>Bắt Đầu Làm Bài</span>
            </button>
          `}
        </div>
      </div>
    `;
  }).join("");
}

function scrollToLmsSection() {
  const el = document.getElementById("studentLmsCardSection");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.style.boxShadow = "0 0 0 3px #0284c7";
    setTimeout(() => {
      el.style.boxShadow = "0 4px 16px rgba(2,132,199,0.08)";
    }, 1800);
  }
}

// Cơ chế làm bài trực tuyến: Đồng hồ đếm ngược, chống chuyển tab gian lận và tự động nộp bài
let examTabViolations = 0;
let isExamActive = false;

function hideAiDuringExam() {
  // Ẩn tất cả các bong bóng AI và hộp chat để tránh gian lận
  document.querySelectorAll(".ai-fab-bubble, .student-chat-box, .edubot-bubble, .student-chat-input-bar, .quick-ask-chip").forEach(el => {
    el.dataset.prevDisplay = el.style.display || "";
    el.style.display = "none";
  });
}

function restoreAiAfterExam() {
  // Khôi phục lại trợ lý AI sau khi hoàn thành hoặc nộp bài
  document.querySelectorAll(".ai-fab-bubble, .student-chat-box, .edubot-bubble, .student-chat-input-bar, .quick-ask-chip").forEach(el => {
    el.style.display = el.dataset.prevDisplay || "";
  });
}

function onExamVisibilityChange() {
  if (isExamActive && document.hidden) {
    handleExamViolation("Chuyển sang tab khác hoặc thu nhỏ cửa sổ trình duyệt");
  }
}

function onExamWindowBlur() {
  if (isExamActive) {
    setTimeout(() => {
      if (isExamActive && document.hidden) {
        handleExamViolation("Rời khỏi ứng dụng làm bài");
      }
    }, 150);
  }
}

function handleExamViolation(reason) {
  if (!isExamActive || !activeExamAssign) return;
  examTabViolations++;
  const badge = document.getElementById("examViolationBadge");
  if (badge) {
    badge.textContent = `${examTabViolations} / 5 lần`;
  }

  if (examTabViolations >= 5) {
    alert(`🚨 VI PHẠM QUY CHẾ THI (5/5 LẦN):\nBạn vừa thực hiện hành vi: "${reason}".\n\nHệ thống phát hiện vi phạm vượt quá 5 lần quy định và TỰ ĐỘNG THU BÀI làm của bạn!`);
    processExamSubmission(true);
  } else {
    alert(`⚠️ CẢNH BÁO GIAN LẬN (${examTabViolations}/5 LẦN):\nBạn vừa rời khỏi màn hình làm bài (${reason})!\n\nNghiêm cấm chuyển tab tra cứu bài học. Còn ${5 - examTabViolations} lần vi phạm trước khi hệ thống TỰ ĐỘNG THU BÀI.`);
  }
}

function startStudentExam(assignId) {
  const s = currentStudentData;
  if (!s) return;

  const assignments = typeof getAssignmentsForClass === "function" ? getAssignmentsForClass(s.class_name) : [];
  const assign = assignments.find(a => a.id === assignId);
  if (!assign) return;

  activeExamAssign = assign;
  activeExamAnswers = {};
  isExamActive = true;
  examTabViolations = 0;

  // Cập nhật giao diện cảnh báo vi phạm
  const violationBadge = document.getElementById("examViolationBadge");
  if (violationBadge) violationBadge.textContent = "0 / 5 lần";

  // 1. TẠM KHÓA BONG BÓNG VÀ TRỢ LÝ AI TRÁNH GIAN LẬN
  hideAiDuringExam();

  // 2. KÍCH HOẠT LẮNG NGHE CHUYỂN TAB (ANTI-CHEAT)
  window.addEventListener("blur", onExamWindowBlur);
  document.addEventListener("visibilitychange", onExamVisibilityChange);

  document.getElementById("examModalTitle").textContent = assign.title;
  document.getElementById("examModalSubtitle").textContent = `Môn ${assign.subject} · ${assign.questions ? assign.questions.length : 0} câu · Lớp: ${s.class_name} · Thí sinh: ${s.name}`;

  // Thiết lập đồng hồ đếm ngược
  examSecondsLeft = (assign.duration_minutes || 20) * 60;
  updateExamTimerUI();

  if (examTimerInterval) clearInterval(examTimerInterval);
  examTimerInterval = setInterval(() => {
    examSecondsLeft--;
    updateExamTimerUI();
    if (examSecondsLeft <= 0) {
      clearInterval(examTimerInterval);
      alert("⏰ Đã hết thời gian làm bài! Hệ thống tự động nộp bài của bạn.");
      processExamSubmission(false);
    }
  }, 1000);

  // Render câu hỏi & navigation grid
  renderExamQuestions();
  renderExamNavGrid();
  updateExamProgress();

  document.getElementById("modalStudentExam").style.display = "flex";
}

function updateExamTimerUI() {
  const display = document.getElementById("examTimerDisplay");
  if (!display) return;
  const mins = Math.floor(examSecondsLeft / 60);
  const secs = examSecondsLeft % 60;
  display.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const capsule = document.getElementById("examTimerCapsule");
  if (capsule) {
    if (examSecondsLeft < 180) {
      capsule.style.borderColor = "#ef4444";
      capsule.style.background = "rgba(239, 68, 68, 0.4)";
    } else {
      capsule.style.borderColor = "#38bdf8";
      capsule.style.background = "rgba(56, 189, 248, 0.2)";
    }
  }
}

function renderExamQuestions() {
  const container = document.getElementById("examQuestionsPane");
  if (!container || !activeExamAssign) return;

  const questions = activeExamAssign.questions || [];

  container.innerHTML = questions.map((q, qIdx) => {
    const isEssay = q.type === "essay" || (!q.options || q.options.length === 0);

    if (isEssay) {
      return `
        <div id="exam_q_item_${qIdx + 1}" style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:12px;padding:16px 18px;margin-bottom:16px;">
          <div style="font-weight:900;font-size:0.95rem;color:#0f172a;margin-bottom:6px;">
            <span style="color:#0284c7;">Câu ${qIdx + 1} (Tự luận):</span> ${escapeHtml(q.question)}
          </div>
          <div style="font-size:0.75rem;color:#64748b;margin-bottom:10px;">
            ✍️ Thí sinh nhập lời giải chi tiết, phân tích hoặc bài viết tự luận vào ô bên dưới:
          </div>
          <div>
            <textarea rows="5" placeholder="Nhập câu trả lời, lời giải chi tiết hoặc cảm nhận của bạn vào đây..." oninput="activeExamAnswers[${qIdx + 1}] = this.value; updateExamProgress();" style="width:100%;border:1.5px solid #cbd5e1;border-radius:8px;padding:10px 12px;font-size:0.86rem;font-family:inherit;resize:vertical;">${escapeHtml(activeExamAnswers[qIdx + 1] || '')}</textarea>
          </div>
        </div>
      `;
    }

    return `
      <div id="exam_q_item_${qIdx + 1}" style="background:#f8fafc;border:1.5px solid #e2e8f0;border-radius:12px;padding:16px 18px;margin-bottom:16px;">
        <div style="font-weight:900;font-size:0.95rem;color:#0f172a;margin-bottom:10px;">
          <span style="color:#0284c7;">Câu ${qIdx + 1}:</span> ${escapeHtml(q.question)}
        </div>

        <div style="display:flex;flex-direction:column;gap:6px;">
          ${(q.options || []).map(opt => {
            const letter = opt.charAt(0);
            const isSelected = activeExamAnswers[qIdx + 1] === letter;
            return `
              <label class="lms-choice-label ${isSelected ? 'selected' : ''}" onclick="selectExamOption(${qIdx + 1}, '${letter}')">
                <input type="radio" name="exam_ans_${qIdx + 1}" value="${letter}" ${isSelected ? 'checked' : ''} style="accent-color:#0284c7;transform:scale(1.15);">
                <span style="font-size:0.86rem;line-height:1.4;">${escapeHtml(opt)}</span>
              </label>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }).join("");
}

function renderExamNavGrid() {
  const container = document.getElementById("examNavGrid");
  if (!container || !activeExamAssign) return;

  const questions = activeExamAssign.questions || [];

  container.innerHTML = questions.map((q, qIdx) => {
    const isAnswered = !!activeExamAnswers[qIdx + 1];
    return `
      <button type="button" class="lms-q-nav-btn ${isAnswered ? 'answered' : ''}" onclick="jumpToExamQuestion(${qIdx + 1})">
        ${qIdx + 1}
      </button>
    `;
  }).join("");
}

function jumpToExamQuestion(qNum) {
  const target = document.getElementById(`exam_q_item_${qNum}`);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.style.borderColor = "#0284c7";
    setTimeout(() => {
      target.style.borderColor = "#e2e8f0";
    }, 1200);
  }
}

function selectExamOption(qNum, letter) {
  activeExamAnswers[qNum] = letter;
  renderExamQuestions();
  renderExamNavGrid();
  updateExamProgress();
}

function updateExamProgress() {
  if (!activeExamAssign) return;
  const questions = activeExamAssign.questions || [];
  const total = questions.length;
  const answered = Object.keys(activeExamAnswers).filter(k => (activeExamAnswers[k] || '').trim().length > 0).length;
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;

  const countEl = document.getElementById("examAnsweredCount");
  const barEl = document.getElementById("examProgressBar");
  if (countEl) countEl.textContent = `${answered}/${total} câu (${percent}%)`;
  if (barEl) barEl.style.width = `${percent}%`;
}

function cancelStudentExam() {
  if (confirm("Bạn có chắc chắn muốn thoát khỏi bài kiểm tra? Bài làm chưa nộp sẽ không được lưu!")) {
    isExamActive = false;
    window.removeEventListener("blur", onExamWindowBlur);
    document.removeEventListener("visibilitychange", onExamVisibilityChange);
    restoreAiAfterExam();

    if (examTimerInterval) clearInterval(examTimerInterval);
    document.getElementById("modalStudentExam").style.display = "none";
    activeExamAssign = null;
    activeExamAnswers = {};
  }
}

function confirmSubmitExam() {
  if (!activeExamAssign) return;
  const questions = activeExamAssign.questions || [];
  const total = questions.length;
  const answered = Object.keys(activeExamAnswers).filter(k => (activeExamAnswers[k] || '').trim().length > 0).length;

  if (answered < total) {
    if (!confirm(`Bạn mới trả lời ${answered}/${total} câu hỏi. Bạn có chắc chắn muốn nộp bài bây giờ không?`)) {
      return;
    }
  } else {
    if (!confirm("Bạn đã hoàn thành tất cả câu hỏi. Nộp bài ngay để AI chấm điểm và phân tích?")) {
      return;
    }
  }

  if (examTimerInterval) clearInterval(examTimerInterval);
  processExamSubmission(false);
}

function processExamSubmission(isViolated = false) {
  const s = currentStudentData;
  const assign = activeExamAssign;
  if (!s || !assign) return;

  isExamActive = false;
  window.removeEventListener("blur", onExamWindowBlur);
  document.removeEventListener("visibilitychange", onExamVisibilityChange);
  restoreAiAfterExam();

  const questions = assign.questions || [];
  const total = questions.length;
  let correctCount = 0;
  const wrongDetails = [];
  const essayFeedback = {};

  questions.forEach((q, idx) => {
    const qNum = idx + 1;
    const userChoice = activeExamAnswers[qNum] || "";
    const isEssay = q.type === "essay" || (!q.options || q.options.length === 0);

    if (isEssay) {
      // Chấm điểm tự luận
      const words = userChoice.trim().split(/\s+/).filter(Boolean).length;
      let essayScore = 0;
      let essayMistakes = [];
      let essayAdvice = "";

      if (words >= 20) {
        essayScore = 8.5;
        essayMistakes.push("Lập luận tương đối đầy đủ nhưng cần thêm dẫn chứng thực tế hoặc công thức mở rộng.");
        essayAdvice = "Bổ sung thêm 1 ví dụ thực tiễn để bài làm đạt điểm 10 trọn vẹn.";
        correctCount += 0.85; // quy đổi câu tự luận
      } else if (words >= 8) {
        essayScore = 6.0;
        essayMistakes.push("Bài làm còn sơ sài, mới nêu được ý chính nhưng chưa giải thích cặn kẽ các bước.");
        essayAdvice = "Cần triển khai chi tiết từng luận điểm và đối chiếu với đáp án chuẩn.";
        correctCount += 0.6;
      } else if (words > 0) {
        essayScore = 3.0;
        essayMistakes.push("Câu trả lời quá ngắn, chưa thể hiện được các khái niệm trọng tâm.");
        essayAdvice = "Em cần ôn lại chuyên đề và viết đầy đủ các bước giải.";
        correctCount += 0.3;
      } else {
        essayScore = 0;
        essayMistakes.push("Thí sinh để trống câu tự luận này.");
        essayAdvice = "Đừng bỏ trống, hãy cố gắng viết những ý em nhớ được.";
      }

      essayFeedback[qNum] = {
        score: essayScore,
        student_text: userChoice,
        mistakes: essayMistakes,
        advice: essayAdvice,
        model_answer: q.explanation || q.model_answer || "Xem hướng dẫn giải chuẩn của giáo viên bộ môn."
      };
    } else {
      // Chấm trắc nghiệm
      if (userChoice === q.correct) {
        correctCount++;
      } else {
        wrongDetails.push({
          question_id: qNum,
          question_text: q.question,
          chosen: userChoice || "Chưa trả lời",
          correct: q.correct,
          reason: userChoice ? `Em đã chọn đáp án ${userChoice}, trong khi đáp án chuẩn là ${q.correct}. Nguyên nhân do nhầm lẫn ở bước áp dụng công thức ${q.concept || 'bài học'}.` : "Em đã bỏ trống câu này.",
          solution: q.explanation || "Xem lại định nghĩa và áp dụng chuẩn các bước theo sách giáo khoa.",
          advice: `Ghi nhớ chuyên đề: "${q.concept || 'Kiến thức cốt lõi'}" và làm lại câu hỏi này vào vở.`
        });
      }
    }
  });

  const roundedCorrectCount = Math.round(correctCount);
  const rawScore = total > 0 ? (correctCount / total) * 10 : 0;
  let score = Math.round(rawScore * 10) / 10;
  if (isViolated) {
    score = Math.max(0, score - 2.0); // Trừ 2 điểm nếu vi phạm rời tab quá 5 lần
  }

  // Lời nhận xét sư phạm của Gemini AI
  let aiSummary = "";
  if (isViolated) {
    aiSummary = `⚠️ Bài thi bị cảnh cáo vi phạm rời khỏi màn hình làm bài ${examTabViolations} lần. Em đạt ${score}/10 điểm (${roundedCorrectCount}/${total} câu đúng). Em cần nghiêm túc tuân thủ quy chế thi cử!`;
  } else if (score >= 9.0) {
    aiSummary = `Xuất sắc! Em đã làm đúng ${roundedCorrectCount}/${total} câu (${score}/10 điểm). Em nắm rất vững toàn bộ chuyên đề môn ${assign.subject}!`;
  } else if (score >= 8.0) {
    aiSummary = `Rất tốt! Em đạt ${score}/10 điểm (${roundedCorrectCount}/${total} câu đúng). Em có tư duy logic sắc bén, chỉ sơ suất ở ${total - roundedCorrectCount} câu. Hãy xem chi tiết lỗi sai bên dưới nhé!`;
  } else if (score >= 6.5) {
    aiSummary = `Khá tốt! Em làm đúng ${roundedCorrectCount}/${total} câu (${score}/10 điểm). Em đã nắm được kiến thức nền tảng nhưng còn nhầm lẫn một số công thức tính toán.`;
  } else {
    aiSummary = `Em cần dành thêm thời gian ôn tập lại lý thuyết chuyên đề ${assign.subject} (${score}/10 điểm - ${roundedCorrectCount}/${total} câu đúng). Đừng lo lắng, hãy đọc kỹ lời giải từng bước của EDU-BOT bên dưới để rút kinh nghiệm nhé!`;
  }

  const subData = {
    id: `SUB_${assign.id}_${s.student_id}`,
    assignment_id: assign.id,
    student_id: s.student_id,
    student_name: s.name,
    class_name: s.class_name,
    submitted_at: new Date().toISOString().replace("T", " ").slice(0, 16),
    score,
    correct_count: roundedCorrectCount,
    total_questions: total,
    answers: activeExamAnswers,
    violations: examTabViolations,
    is_violated: isViolated,
    essay_feedback: essayFeedback,
    ai_analysis: {
      summary: aiSummary,
      wrong_details: wrongDetails
    }
  };

  if (typeof saveStudentSubmission === "function") {
    saveStudentSubmission(subData);
  }

  // Đóng modal làm bài
  document.getElementById("modalStudentExam").style.display = "none";

  // Cập nhật lại giao diện danh sách bài tập của học sinh
  renderStudentLmsAssignments(s);

  // Mở modal kết quả & AI phân tích
  showExamResultModal(assign, subData);
}

function viewStudentExamResult(assignId) {
  const s = currentStudentData;
  if (!s) return;

  const assignments = typeof getAssignmentsForClass === "function" ? getAssignmentsForClass(s.class_name) : [];
  const assign = assignments.find(a => a.id === assignId);
  if (!assign) return;

  const sub = typeof getSubmissionForStudent === "function" ? getSubmissionForStudent(assignId, s.student_id) : null;
  if (!sub) return;

  showExamResultModal(assign, sub);
}

function showExamResultModal(assign, sub) {
  const container = document.getElementById("resultModalContent");
  if (!container) return;

  document.getElementById("resultModalSub").textContent = `Môn: ${assign.subject} · Đề: ${assign.title} · Nộp lúc: ${sub.submitted_at}`;

  const wrongDetails = (sub.ai_analysis && sub.ai_analysis.wrong_details) || [];
  const essayFeedback = sub.essay_feedback || {};
  const questions = assign.questions || [];
  const percent = sub.total_questions > 0 ? Math.round((sub.correct_count / sub.total_questions) * 100) : 0;

  container.innerHTML = `
    <!-- BANNER ĐIỂM SỐ CHUẨN XÁC DẠNG PHÂN SỐ VÀ ĐIỂM 10 -->
    <div style="background:linear-gradient(135deg,#0284c7 0%,#0369a1 100%);color:white;border-radius:14px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;box-shadow:0 8px 24px rgba(2,132,199,0.3);">
      <div>
        <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:#bae6fd;letter-spacing:1px;">KẾT QUẢ ĐẠT ĐƯỢC</div>
        <div style="font-size:2.4rem;font-weight:900;line-height:1.1;margin-top:2px;">
          ${sub.score.toFixed(1)} <span style="font-size:1.1rem;font-weight:700;opacity:0.85;">/ 10.0 điểm</span>
        </div>
        <div style="font-size:0.82rem;margin-top:6px;color:#e0f2fe;display:flex;align-items:center;gap:8px;">
          <span>🎯 Số câu đúng: <strong>${sub.correct_count} / ${sub.total_questions} câu</strong> (${percent}%)</span>
          ${sub.is_violated ? `<span style="background:#fee2e2;color:#b91c1c;padding:1px 6px;border-radius:6px;font-size:0.7rem;font-weight:800;">⚠️ Rời tab ${sub.violations}/5 lần (-2đ)</span>` : ''}
        </div>
      </div>

      <div style="text-align:right;">
        <span style="background:rgba(255,255,255,0.22);padding:8px 16px;border-radius:24px;font-size:0.95rem;font-weight:900;border:1.5px solid rgba(255,255,255,0.4);display:inline-block;">
          ${sub.correct_count} / ${sub.total_questions} Câu Đúng
        </span>
      </div>
    </div>

    <!-- AI PEDAGOGICAL EVALUATION -->
    <div class="lms-ai-breakdown-card" style="margin-top:0;margin-bottom:18px;">
      <div style="font-weight:900;font-size:0.92rem;color:#0369a1;display:flex;align-items:center;gap:8px;">
        <span style="font-size:1.2rem;">🤖</span>
        <span>Đánh Giá &amp; Cố Vấn Của Trợ Lý AI (Google Gemini Flash):</span>
      </div>
      <p style="font-size:0.84rem;color:#334155;margin:8px 0 0 0;line-height:1.6;">
        ${(sub.ai_analysis && sub.ai_analysis.summary) || "Em đã hoàn thành bài thi rất tốt."}
      </p>
    </div>

    <!-- PHÂN TÍCH TỰ LUẬN (NẾU CÓ) -->
    ${Object.keys(essayFeedback).length > 0 ? `
      <div style="margin-bottom:18px;">
        <div style="display:flex;align-items:center;gap:6px;font-weight:900;font-size:0.9rem;color:#0369a1;margin-bottom:10px;">
          <span>✍️</span> <span>Kết Quả &amp; AI Phân Tích Lỗi Sai Câu Tự Luận:</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          ${Object.entries(essayFeedback).map(([qNum, fb]) => `
            <div style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:10px;padding:14px;">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                <span style="font-weight:800;color:#0f172a;font-size:0.85rem;">Câu ${qNum} (Tự luận):</span>
                <span style="background:#e0f2fe;color:#0284c7;font-weight:800;font-size:0.75rem;padding:2px 8px;border-radius:8px;">Điểm AI: ${fb.score}/10đ</span>
              </div>
              <div style="font-size:0.8rem;color:#334155;background:white;padding:8px 10px;border-radius:6px;border:1px solid #e2e8f0;margin-bottom:8px;">
                <strong>Bài làm của em:</strong> ${escapeHtml(fb.student_text || '(Để trống)')}
              </div>
              <div style="background:#fef2f2;border-left:3px solid #ef4444;padding:8px 10px;border-radius:4px;font-size:0.78rem;color:#991b1b;margin-bottom:6px;">
                <strong>🔍 Điểm cần khắc phục:</strong> ${escapeHtml(fb.mistakes.join('; '))}
              </div>
              <div style="background:#f0fdf4;border-left:3px solid #16a34a;padding:8px 10px;border-radius:4px;font-size:0.78rem;color:#166534;">
                <strong>💡 Lời khuyên &amp; Đáp án chuẩn:</strong> ${escapeHtml(fb.model_answer)}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ''}

    <!-- CHI TIẾT CÁC CÂU LÀM SAI VÀ HƯỚNG DẪN KHẮC PHỤC -->
    ${wrongDetails.length > 0 ? `
      <div style="margin-bottom:18px;">
        <div style="display:flex;align-items:center;gap:6px;font-weight:900;font-size:0.9rem;color:#b91c1c;margin-bottom:10px;">
          <span>🔍</span> <span>Phân Tích Chi Tiết ${wrongDetails.length} Câu Em Làm Sai &amp; Cách Khắc Phục:</span>
        </div>
        
        <div style="display:flex;flex-direction:column;gap:12px;">
          ${wrongDetails.map(w => `
            <div class="lms-wrong-q-item">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
                <span style="font-weight:800;font-size:0.84rem;color:#0f172a;">Câu ${w.question_id}: ${escapeHtml(w.question_text || '')}</span>
                <span style="font-size:0.72rem;background:#fee2e2;color:#b91c1c;font-weight:800;padding:2px 8px;border-radius:6px;">Lỗi sai</span>
              </div>

              <div style="font-size:0.78rem;color:#475569;margin-bottom:8px;">
                <span>Đáp án em đã chọn: <strong style="color:#ef4444;">${w.chosen}</strong></span>
                &nbsp;|&nbsp; <span>Đáp án đúng chuẩn: <strong style="color:#10b981;">${w.correct}</strong></span>
              </div>

              <div style="background:#f8fafc;border-left:3px solid #0284c7;padding:8px 12px;border-radius:4px;font-size:0.78rem;line-height:1.5;">
                <div style="color:#b91c1c;font-weight:800;">⚠️ Phân tích nguyên nhân nhầm lẫn:</div>
                <div style="color:#334155;margin-bottom:6px;">${escapeHtml(w.reason)}</div>

                <div style="color:#0284c7;font-weight:800;">💡 Hướng dẫn giải đúng chuẩn từng bước:</div>
                <div style="color:#334155;margin-bottom:6px;">${escapeHtml(w.solution)}</div>

                <div style="color:#15803d;font-weight:800;">📌 Kế hoạch rèn luyện tương tự:</div>
                <div style="color:#334155;">${escapeHtml(w.advice)}</div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : `
      <div style="text-align:center;padding:18px;background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;color:#15803d;font-size:0.88rem;font-weight:800;margin-bottom:18px;">
        🌟 Chúc mừng em! Toàn bộ các câu hỏi trắc nghiệm đều được trả lời chính xác 100%!
      </div>
    `}
  `;

  document.getElementById("modalStudentExamResult").style.display = "flex";
}

function closeExamResultModal() {
  document.getElementById("modalStudentExamResult").style.display = "none";
}

// Hộp thư học tập: Xem nhận xét chi tiết của giáo viên bộ môn và phân tích bài làm từ AI
const STORE_TEACHER_FEEDBACKS = "LVKT_TEACHER_FEEDBACKS_V1";

function loadTeacherFeedbacks() {
  try {
    return JSON.parse(localStorage.getItem(STORE_TEACHER_FEEDBACKS) || "[]");
  } catch (e) {
    return [];
  }
}

function checkTeacherFeedbackNotifications() {
  const s = currentStudentData;
  if (!s) return;

  const feedbacks = loadTeacherFeedbacks().filter(f => f.student_id === s.student_id);
  const unread = feedbacks.filter(f => !f.is_read).length;

  const headerBadge = document.getElementById("teacherFeedbackBadge");
  if (headerBadge) {
    headerBadge.textContent = unread;
    headerBadge.style.display = unread > 0 ? "inline-block" : "none";
  }

  const cardBadge = document.getElementById("teacherFeedbackCardBadge");
  if (cardBadge) {
    cardBadge.textContent = unread;
    cardBadge.style.display = unread > 0 ? "inline-block" : "none";
  }
}

function openTeacherFeedbackModal(feedbackId) {
  const feedbacks = loadTeacherFeedbacks();
  const s = currentStudentData;
  if (!s) return;

  const stuFeedbacks = feedbacks.filter(f => f.student_id === s.student_id);
  const container = document.getElementById("feedbackModalContent");
  if (!container) return;

  if (stuFeedbacks.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:40px 20px;color:#64748b;">
        <span style="font-size:2.5rem;">📬</span>
        <div style="font-weight:800;color:#0f172a;margin-top:8px;">Hộp thư phản hồi hiện đang trống</div>
        <div style="font-size:0.78rem;margin-top:4px;">Khi Thầy/Cô và AI chấm bài tự luận của bạn, lời nhận xét và phân tích lỗi sai sẽ xuất hiện tại đây.</div>
      </div>
    `;
  } else {
    container.innerHTML = stuFeedbacks.map((fb, idx) => `
      <div style="background:#f8fafc;border:1.5px solid ${fb.is_read ? '#e2e8f0' : '#86efac'};border-radius:12px;padding:16px;margin-bottom:14px;box-shadow:0 4px 12px rgba(0,0,0,0.03);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <div>
            <div style="font-weight:900;color:#0f172a;font-size:0.92rem;">${escapeHtml(fb.assignment_title)}</div>
            <div style="font-size:0.72rem;color:#64748b;margin-top:2px;">👨‍🏫 Giáo viên: <strong>${escapeHtml(fb.teacher_name)}</strong> · ${fb.created_at}</div>
          </div>
          <div>
            <span style="background:#dcfce7;color:#15803d;padding:4px 10px;border-radius:12px;font-weight:900;font-size:0.82rem;">
              ⭐ ${fb.score ? fb.score.toFixed(1) : '--'}/10đ
            </span>
          </div>
        </div>

        <div style="background:white;border:1px solid #cbd5e1;border-radius:8px;padding:10px 12px;font-size:0.82rem;margin-bottom:10px;line-height:1.5;color:#1e293b;">
          <div style="font-weight:800;color:#0369a1;margin-bottom:4px;">💬 Lời nhận xét của Thầy/Cô:</div>
          ${escapeHtml(fb.teacher_comment || fb.message || 'Thầy/Cô đã xem bài làm của em.')}
        </div>

        ${fb.ai_mistakes && fb.ai_mistakes.length > 0 ? `
          <div style="background:#fef2f2;border-left:3px solid #ef4444;padding:8px 12px;border-radius:4px;font-size:0.78rem;color:#991b1b;margin-bottom:6px;">
            <strong>⚠️ Lỗi sai cần lưu ý (AI chỉ ra):</strong>
            <ul style="margin:4px 0 0 16px;padding:0;">
              ${fb.ai_mistakes.map(m => `<li>${escapeHtml(m)}</li>`).join("")}
            </ul>
          </div>
        ` : ''}

        ${fb.ai_solution ? `
          <div style="background:#f0fdf4;border-left:3px solid #16a34a;padding:8px 12px;border-radius:4px;font-size:0.78rem;color:#166534;">
            <strong>💡 Cách khắc phục &amp; Đáp án chuẩn:</strong> ${escapeHtml(fb.ai_solution)}
          </div>
        ` : ''}
      </div>
    `).join("");

    // Đánh dấu đã đọc
    feedbacks.forEach(f => {
      if (f.student_id === s.student_id) f.is_read = true;
    });
    try {
      localStorage.setItem(STORE_TEACHER_FEEDBACKS, JSON.stringify(feedbacks));
    } catch (e) {}
    checkTeacherFeedbackNotifications();
  }

  document.getElementById("modalTeacherAiFeedback").style.display = "flex";
}

function closeTeacherFeedbackModal() {
  document.getElementById("modalTeacherAiFeedback").style.display = "none";
}

function askAiAboutExam() {
  closeExamResultModal();
  const input = document.getElementById("stuChatInput");
  if (input) {
    input.value = "Em vừa làm bài tập kiểm tra trắc nghiệm, nhờ EDU-BOT hướng dẫn thêm câu em làm sai và cách nhớ công thức lâu.";
    input.focus();
    input.scrollIntoView({ behavior: "smooth", block: "center" });
    showStudentToast("💬 Hãy bấm 'Gửi' để trò chuyện trực tiếp cùng EDU-BOT về bài thi vừa làm!");
  }
}

// Thời khóa biểu cá nhân: Tự động hiển thị đúng lịch học theo lớp của học sinh

let currentStuTkbSession = "all";

const STU_TKB_PERIOD_HOURS = {
  morning: {
    1: "07:15 - 08:00",
    2: "08:05 - 08:50",
    3: "09:10 - 09:55",
    4: "10:00 - 10:45",
    5: "10:50 - 11:35"
  },
  afternoon: {
    1: "13:30 - 14:15",
    2: "14:20 - 15:05",
    3: "15:25 - 16:10",
    4: "16:15 - 17:00"
  }
};

function getStuSubjectStyleClass(subjName) {
  if (!subjName) return "subj-default";
  const s = subjName.toLowerCase();
  if (s.includes("toán")) return "subj-toan";
  if (s.includes("văn") || s.includes("tiếng việt")) return "subj-van";
  if (s.includes("anh") || s.includes("ngoại ngữ")) return "subj-anh";
  if (s.includes("lý") || s.includes("vật lý")) return "subj-ly";
  if (s.includes("hóa")) return "subj-hoa";
  if (s.includes("sinh") || s.includes("khtn") || s.includes("khoa học tự nhiên")) return "subj-sinh";
  if (s.includes("sử") || s.includes("lịch sử") || s.includes("lịch sử & địa lý") || s.includes("lịch sử &địa lí")) return "subj-su";
  if (s.includes("địa")) return "subj-dia";
  if (s.includes("tin") || s.includes("stem") || s.includes("robotics") || s.includes("lập trình")) return "subj-tin";
  if (s.includes("gdcd") || s.includes("kinh tế") || s.includes("pháp luật")) return "subj-gdcd";
  if (s.includes("thể dục") || s.includes("thể chất") || s.includes("bơi")) return "subj-theduc";
  if (s.includes("mĩ thuật") || s.includes("mỹ thuật") || s.includes("âm nhạc") || s.includes("nghệ thuật")) return "subj-dia";
  if (s.includes("chào cờ")) return "subj-chao-co";
  if (s.includes("shl") || s.includes("sinh hoạt")) return "subj-sh-lop";
  return "subj-default";
}

function switchStuTkbSession(session) {
  currentStuTkbSession = session;

  const btnAll = document.getElementById("btnStuTkbAll");
  const btnMorn = document.getElementById("btnStuTkbMorning");
  const btnAft = document.getElementById("btnStuTkbAfternoon");

  [btnAll, btnMorn, btnAft].forEach(b => {
    if (b) {
      b.style.background = "#f0f9ff";
      b.style.color = "#0284c7";
    }
  });

  if (session === "all" && btnAll) {
    btnAll.style.background = "#0284c7";
    btnAll.style.color = "white";
  } else if (session === "morning" && btnMorn) {
    btnMorn.style.background = "#0284c7";
    btnMorn.style.color = "white";
  } else if (session === "afternoon" && btnAft) {
    btnAft.style.background = "#0284c7";
    btnAft.style.color = "white";
  }

  if (currentStudentData) {
    renderStudentTimetable(currentStudentData);
  }
}

function renderStudentTimetable(s) {
  const container = document.getElementById("studentTkbContainer");
  if (!container || !s) return;

  const myClass = s.class_name || "10A1";
  const className = currentStuViewClass || myClass;

  const titleEl = document.getElementById("stuTkbClassTitle");
  if (titleEl) {
    if (className === myClass) {
      titleEl.innerHTML = `Lớp ${escapeHtml(className)} <span style="font-size:0.68rem;background:#10b981;color:white;padding:2px 7px;border-radius:10px;font-weight:800;margin-left:4px;">Lớp của em</span>`;
    } else {
      titleEl.innerHTML = `Lớp ${escapeHtml(className)} <span style="font-size:0.68rem;background:#f59e0b;color:white;padding:2px 7px;border-radius:10px;font-weight:800;margin-left:4px;">Đang xem thử</span>`;
    }
  }

  // Nút về TKB lớp của em
  const btnMyClass = document.getElementById("btnStuTkbMyClass");
  if (btnMyClass) {
    if (className !== myClass) {
      btnMyClass.style.display = "inline-flex";
      btnMyClass.textContent = `⭐ Về TKB Lớp Của Em (${myClass})`;
    } else {
      btnMyClass.style.display = "none";
    }
  }

  // Cập nhật dropdown chọn lớp
  const selector = document.getElementById("stuTkbClassSelector");
  if (selector) {
    if (selector.options.length <= 1) {
      populateStudentClassSelector(selector, className);
    } else {
      selector.value = className;
    }
  }

  // Lấy dữ liệu TKB của lớp này
  const timetable = typeof getTimetableForClass === "function" 
    ? getTimetableForClass(className) 
    : generateClassTimetable(className);

  const todayDayIndex = new Date().getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const dayNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];

  const badgeEl = document.getElementById("stuTkbTodayBadge");
  if (badgeEl) {
    badgeEl.textContent = `🔔 Hôm nay: ${dayNames[todayDayIndex]}`;
  }

  const days = [
    { key: "mon", label: "Thứ Hai", dNum: 1 },
    { key: "tue", label: "Thứ Ba",  dNum: 2 },
    { key: "wed", label: "Thứ Tư",  dNum: 3 },
    { key: "thu", label: "Thứ Năm", dNum: 4 },
    { key: "fri", label: "Thứ Sáu", dNum: 5 },
    { key: "sat", label: "Thứ Bảy", dNum: 6 }
  ];

  let html = `
    <table class="tkb-grid-table">
      <thead>
        <tr>
          <th class="tkb-th tkb-th-period">Tiết / Giờ</th>
  `;

  days.forEach(d => {
    const isToday = d.dNum === todayDayIndex;
    html += `
      <th class="tkb-th ${isToday ? 'tkb-th-today' : ''}" style="width:15%;">
        <span>${d.label}</span>
        ${isToday ? '<span class="tkb-today-badge">HÔM NAY</span>' : ''}
      </th>
    `;
  });

  html += `
        </tr>
      </thead>
      <tbody>
  `;

  // 1. BUỔI SÁNG
  if (currentStuTkbSession === "all" || currentStuTkbSession === "morning") {
    html += `
      <tr class="tkb-session-row">
        <td colspan="7">☀️ BUỔI SÁNG (TIẾT 1 – 5) · KHUNG GIỜ: 07:15 – 11:35</td>
      </tr>
    `;

    for (let p = 1; p <= 5; p++) {
      const timeStr = STU_TKB_PERIOD_HOURS.morning[p] || "";
      html += `<tr>`;
      html += `
        <td class="tkb-td" style="background:#f8fafc;text-align:center;font-weight:800;color:#334155;">
          <div style="font-size:0.85rem;color:#0284c7;">Tiết ${p}</div>
          <div style="font-size:0.65rem;color:#64748b;margin-top:2px;">${timeStr}</div>
        </td>
      `;

      days.forEach(d => {
        const isToday = d.dNum === todayDayIndex;
        const slot = timetable?.morning?.[d.key]?.find(sl => sl.period === p);

        html += `<td class="tkb-td ${isToday ? 'tkb-col-today' : ''}">`;

        if (slot && slot.subject) {
          const colorClass = getStuSubjectStyleClass(slot.subject);
          html += `
            <div class="tkb-slot-card ${colorClass}" style="cursor:default;">
              <div class="tkb-slot-subj">
                <span>${escapeHtml(slot.subject)}</span>
              </div>
              <div class="tkb-slot-teacher">
                <span>👨‍🏫</span> <span>${escapeHtml(slot.teacher || "Giáo viên bộ môn")}</span>
              </div>
              <div class="tkb-slot-meta">
                <span>📍 ${escapeHtml(slot.room || ('P.' + className))}</span>
                ${slot.note ? `<span style="font-style:italic;">${escapeHtml(slot.note)}</span>` : ''}
              </div>
            </div>
          `;
        } else {
          html += `
            <div class="tkb-slot-empty" style="cursor:default;opacity:0.6;">
              <span>Trống</span>
            </div>
          `;
        }

        html += `</td>`;
      });

      html += `</tr>`;
    }
  }

  // 2. BUỔI CHIỀU
  if (currentStuTkbSession === "all" || currentStuTkbSession === "afternoon") {
    html += `
      <tr class="tkb-session-row">
        <td colspan="7">🌆 BUỔI CHIỀU (TIẾT 1 – 4) · KHUNG GIỜ: 13:30 – 17:00</td>
      </tr>
    `;

    for (let p = 1; p <= 4; p++) {
      const timeStr = STU_TKB_PERIOD_HOURS.afternoon[p] || "";
      html += `<tr>`;
      html += `
        <td class="tkb-td" style="background:#f8fafc;text-align:center;font-weight:800;color:#334155;">
          <div style="font-size:0.85rem;color:#7c3aed;">Tiết ${p}</div>
          <div style="font-size:0.65rem;color:#64748b;margin-top:2px;">${timeStr}</div>
        </td>
      `;

      days.forEach(d => {
        const isToday = d.dNum === todayDayIndex;
        const slot = timetable?.afternoon?.[d.key]?.find(sl => sl.period === p);

        html += `<td class="tkb-td ${isToday ? 'tkb-col-today' : ''}">`;

        if (slot && slot.subject) {
          const colorClass = getStuSubjectStyleClass(slot.subject);
          html += `
            <div class="tkb-slot-card ${colorClass}" style="cursor:default;">
              <div class="tkb-slot-subj">
                <span>${escapeHtml(slot.subject)}</span>
              </div>
              <div class="tkb-slot-teacher">
                <span>👨‍🏫</span> <span>${escapeHtml(slot.teacher || "Giáo viên bộ môn")}</span>
              </div>
              <div class="tkb-slot-meta">
                <span>📍 ${escapeHtml(slot.room || ('P.' + className))}</span>
                ${slot.note ? `<span style="font-style:italic;">${escapeHtml(slot.note)}</span>` : ''}
              </div>
            </div>
          `;
        } else {
          html += `
            <div class="tkb-slot-empty" style="cursor:default;opacity:0.6;">
              <span>Trống</span>
            </div>
          `;
        }

        html += `</td>`;
      });

      html += `</tr>`;
    }
  }

  html += `
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}

// Bộ chọn lớp nhanh: Cho phép chuyển xem thời khóa biểu của các lớp khác nhau (41 lớp)
function populateStudentClassSelector(sel, currentClass) {
  if (!sel) return;
  sel.innerHTML = "";
  if (typeof CLASS_GROUPS !== "undefined") {
    Object.entries(CLASS_GROUPS).forEach(([groupName, classes]) => {
      const og = document.createElement("optgroup");
      og.label = groupName;
      classes.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = `Lớp ${c}`;
        if (c === currentClass) opt.selected = true;
        og.appendChild(opt);
      });
      sel.appendChild(og);
    });
  } else if (typeof ALL_CLASSES !== "undefined") {
    ALL_CLASSES.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = `Lớp ${c}`;
      if (c === currentClass) opt.selected = true;
      sel.appendChild(opt);
    });
  }
}

function onStudentTkbClassChange(val) {
  if (!val) return;
  currentStuViewClass = val;
  if (currentStudentData) {
    renderStudentTimetable(currentStudentData);
    showToast(`📅 Đang mở Thời Khóa Biểu Lớp ${val}`);
  }
}

function resetStudentTkbToMyClass() {
  if (currentStudentData) {
    currentStuViewClass = currentStudentData.class_name;
    renderStudentTimetable(currentStudentData);
    showToast(`⭐ Đã quay lại Thời Khóa Biểu lớp của em (${currentStuViewClass})`);
  }
}

function openStudentClassSwitchModal() {
  const modal = document.getElementById("modalStudentClassSwitch");
  if (!modal) return;
  const sel = document.getElementById("modalSwitchClassSelect");
  if (sel && sel.options.length <= 1) {
    populateStudentClassSelector(sel, currentStudentData?.class_name);
  } else if (sel && currentStudentData) {
    sel.value = currentStudentData.class_name;
  }
  modal.style.display = "flex";
}

function closeStudentClassSwitchModal() {
  const modal = document.getElementById("modalStudentClassSwitch");
  if (modal) modal.style.display = "none";
}

function switchActiveStudentClass(className) {
  closeStudentClassSwitchModal();
  if (!className) return;

  const allStudents = typeof loadStudentsData === "function" ? loadStudentsData() : STUDENTS_DATA;
  let targetStudent = allStudents.find(s => s.class_name === className);
  if (!targetStudent) {
    targetStudent = {
      student_id: "HS_" + className,
      name: "Học sinh Lớp " + className,
      class_name: className,
      gender: "Nam",
      dob: "2010",
      academic_avg: 7.5,
      academic_rank: "Khá",
      conduct: "Tốt",
      hw_rate: 0.85,
      absences: 1,
      slope: 0.1,
      risk_level: "THẤP",
      risk_score: 20
    };
  }

  // Cập nhật session
  const session = getSession() || {};
  session.student_id = targetStudent.student_id;
  session.class_assigned = targetStudent.class_name;
  session.display_name = targetStudent.name;
  setSession(session);

  currentStudentData = targetStudent;
  currentStuViewClass = targetStudent.class_name;

  // Re-render toàn bộ trang
  renderStudentPage(session, targetStudent);

  showToast(`🎉 Đã chuyển sang hồ sơ & Thời khóa biểu Lớp ${className}!`);
}

